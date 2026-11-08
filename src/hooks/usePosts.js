import { useState, useEffect, useCallback } from 'react';
import { INITIAL_POSTS, POST_CATEGORIES } from '../data/posts';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { sanitizeText, isValidSafeUrl } from '../utils/security';

export const STORAGE_POSTS_KEY = 'anderson_kunicki_posts_v1';
const DELETED_INITIAL_POSTS_KEY = 'anderson_kunicki_deleted_initial_posts_v1';
const TABLE_NAME = 'properties';

const VALID_CATEGORIES = POST_CATEGORIES.map((c) => c.value);

function getDeletedInitialIds() {
  try {
    const raw = localStorage.getItem(DELETED_INITIAL_POSTS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

function addDeletedInitialId(id) {
  try {
    const set = getDeletedInitialIds();
    set.add(id);
    localStorage.setItem(DELETED_INITIAL_POSTS_KEY, JSON.stringify(Array.from(set)));
  } catch {}
}

export function sanitizePostPayload(raw = {}) {
  const source = raw && typeof raw === 'object' ? raw : {};
  const title = sanitizeText(source.title ?? '', 180) || 'Atualização Anderson Kunicki';
  const content = sanitizeText(source.content ?? '', 5000);
  const rawCategory = String(source.category ?? '').toLowerCase().trim();
  const category = VALID_CATEGORIES.includes(rawCategory) ? rawCategory : 'movimentacao';
  const propertyRef = sanitizeText(source.propertyRef ?? '', 30).toUpperCase();
  const imageUrl = isValidSafeUrl(source.imageUrl) ? source.imageUrl.trim() : '';
  const featured = Boolean(source.featured);

  return {
    entityType: 'post',
    title,
    content,
    category,
    propertyRef,
    imageUrl,
    featured
  };
}

function mapSupabasePostRow(row) {
  if (!row) return null;
  const item = row.data && typeof row.data === 'object' ? { id: row.id, ...row.data } : row;
  if (item.id?.startsWith('post-') || item.entityType === 'post') {
    return item;
  }
  return null;
}

function mergeWithInitialPosts(list) {
  const deletedSet = getDeletedInitialIds();
  const validList = Array.isArray(list)
    ? list.filter((p) => p && (p.id?.startsWith('post-') || p.entityType === 'post') && !deletedSet.has(p.id))
    : [];

  const existingIds = new Set(validList.map((p) => p.id));
  const missingInitial = INITIAL_POSTS.filter((p) => !existingIds.has(p.id) && !deletedSet.has(p.id));

  const combined = [...missingInitial, ...validList];
  combined.sort(
    (a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0)
  );
  return combined;
}

export function usePosts(onToast) {
  const [posts, setPosts] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_POSTS_KEY);
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return mergeWithInitialPosts(parsed);
        }
      }
      const initial = mergeWithInitialPosts([]);
      try {
        localStorage.setItem(STORAGE_POSTS_KEY, JSON.stringify(initial));
      } catch {}
      return initial;
    } catch {
      return INITIAL_POSTS;
    }
  });

  const saveLocalPosts = useCallback((updatedPosts) => {
    setPosts(updatedPosts);
    try {
      localStorage.setItem(STORAGE_POSTS_KEY, JSON.stringify(updatedPosts));
    } catch (err) {
      console.warn('Limite de armazenamento local atingido para postagens:', err);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    if (isSupabaseConfigured && supabase) {
      const fetchPostsFromSupabase = async () => {
        try {
          const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .order('updated_at', { ascending: false });

          if (!error && Array.isArray(data)) {
            const mappedPosts = data.map(mapSupabasePostRow).filter(Boolean);
            const merged = mergeWithInitialPosts(mappedPosts);

            const existingCloudIds = new Set(mappedPosts.map((p) => p.id));
            const deletedSet = getDeletedInitialIds();
            const missingSeed = INITIAL_POSTS.filter(
              (p) => !existingCloudIds.has(p.id) && !deletedSet.has(p.id)
            );

            if (missingSeed.length > 0) {
              try {
                const seedRows = missingSeed.map((p) => ({
                  id: p.id,
                  data: p,
                  updated_at: new Date().toISOString()
                }));
                await supabase.from(TABLE_NAME).upsert(seedRows);
              } catch {}
            }

            if (isMounted) {
              setPosts(merged);
              try {
                localStorage.setItem(STORAGE_POSTS_KEY, JSON.stringify(merged));
              } catch {}
            }
          }
        } catch (err) {
          console.warn('Falha ao carregar postagens do Supabase:', err);
        }
      };

      fetchPostsFromSupabase();

      let channel;
      try {
        channel = supabase
          .channel('public:posts_feed')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: TABLE_NAME },
            () => {
              fetchPostsFromSupabase();
            }
          )
          .subscribe();
      } catch {}

      return () => {
        isMounted = false;
        if (channel && supabase) {
          supabase.removeChannel(channel);
        }
      };
    }
  }, []);

  const savePost = useCallback(
    async (formData, editId) => {
      const targetId = editId || `post-${Date.now()}`;
      const sanitized = sanitizePostPayload(formData);
      const nowIso = new Date().toISOString();

      const existingPost = editId ? posts.find((p) => p.id === editId) : null;
      const payload = {
        ...sanitized,
        id: targetId,
        createdAt: existingPost?.createdAt || formData?.createdAt || nowIso.split('T')[0],
        updatedAt: nowIso
      };

      let updated;
      if (editId) {
        updated = posts.map((p) => (p.id === editId ? { ...p, ...payload } : p));
      } else {
        updated = [payload, ...posts];
      }
      saveLocalPosts(updated);

      if (isSupabaseConfigured && supabase) {
        try {
          const { error } = await supabase.from(TABLE_NAME).upsert({
            id: targetId,
            data: payload,
            updated_at: nowIso
          });
          if (error) throw error;
          if (onToast) {
            onToast(editId ? 'Publicação atualizada com sucesso!' : 'Nova publicação adicionada no mural!');
          }
        } catch (err) {
          console.error('Erro ao salvar publicação no Supabase:', err);
          if (onToast) {
            onToast(editId ? 'Publicação atualizada localmente.' : 'Publicação salva localmente.');
          }
        }
      } else if (onToast) {
        onToast(editId ? 'Publicação atualizada com sucesso!' : 'Nova publicação adicionada no mural!');
      }
    },
    [posts, saveLocalPosts, onToast]
  );

  const deletePost = useCallback(
    async (id, skipConfirm = false) => {
      if (!skipConfirm && typeof window !== 'undefined' && typeof window.confirm === 'function') {
        if (!window.confirm('Tem certeza de que deseja excluir esta publicação?')) return;
      }

      addDeletedInitialId(id);
      const updated = posts.filter((p) => p.id !== id);
      saveLocalPosts(updated);

      if (isSupabaseConfigured && supabase) {
        try {
          const { error } = await supabase.from(TABLE_NAME).delete().eq('id', id);
          if (error) throw error;
          if (onToast) onToast('Publicação excluída com sucesso.');
        } catch {
          if (onToast) onToast('Publicação excluída localmente.');
        }
      } else if (onToast) {
        onToast('Publicação excluída com sucesso.');
      }
    },
    [posts, saveLocalPosts, onToast]
  );

  return {
    posts,
    savePost,
    deletePost
  };
}

