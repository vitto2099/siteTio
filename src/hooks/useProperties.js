import { useState, useEffect, useCallback, useMemo } from 'react';
import { INITIAL_PROPERTIES, LEGACY_MOCKUP_IDS, getCategoryPrefix } from '../data/properties';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { sanitizePropertyPayload } from '../utils/security';

export const STORAGE_KEY = 'anderson_kunicki_properties_v3';
export const INITIALIZED_KEY = 'anderson_kunicki_db_initialized_v3';
const TABLE_NAME = 'properties';

// Normaliza codigos legados e remove mockups antigos descartados
function normalizePropertyCodes(list) {
  if (!Array.isArray(list)) return [];
  const legacySet = new Set(LEGACY_MOCKUP_IDS);

  const cleaned = list
    .filter(p => p && !p.id?.startsWith('prop-00') && !legacySet.has(p.id))
    .map(p => {
      if (p.code && p.code.startsWith('AK-')) {
        const num = p.code.replace('AK-', '');
        const prefix = getCategoryPrefix(p.type, p.purpose);
        return { ...p, code: `${prefix}-${num}` };
      }
      return p;
    });

  return cleaned;
}

// Converte registro do Supabase para o formato do imóvel
function mapSupabaseRow(row) {
  if (!row) return null;
  if (row.data && typeof row.data === 'object') {
    return { id: row.id, ...row.data };
  }
  return row;
}

export function useProperties(onToast) {
  const [properties, setProperties] = useState(() => {
    try {
      localStorage.removeItem('anderson_kunicki_react_properties_v1');
      localStorage.removeItem('anderson_kunicki_react_properties_v2');
      
      const stored = localStorage.getItem(STORAGE_KEY);
      const isInitialized = localStorage.getItem(INITIALIZED_KEY);

      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return normalizePropertyCodes(parsed);
        }
      }

      if (isInitialized) {
        return [];
      }

      try {
        localStorage.setItem(INITIALIZED_KEY, 'true');
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROPERTIES));
      } catch {}
      return INITIAL_PROPERTIES;
    } catch {
      return [];
    }
  });
  
  const [filters, setFilters] = useState({
    keyword: '',
    purpose: 'todos',
    type: 'todos',
    bedrooms: 'todos',
    maxPrice: 'Infinity',
    sortBy: 'recente'
  });

  const saveLocalBackup = useCallback((updatedProps) => {
    setProperties(updatedProps);
    try {
      localStorage.setItem(INITIALIZED_KEY, 'true');
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProps));
    } catch (err) {
      console.warn('Limite de armazenamento local atingido:', err);
    }
  }, []);

  // Sincronização em tempo real com o Supabase
  useEffect(() => {
    let isMounted = true;

    if (isSupabaseConfigured && supabase) {
      // 1. Carregar registros iniciais do Supabase
      const fetchFromSupabase = async () => {
        try {
          const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .order('updated_at', { ascending: false });

          if (!error && Array.isArray(data)) {
            const mapped = data.map(mapSupabaseRow).filter(Boolean);
            mapped.sort((a, b) => new Date(b.createdAt || b.updatedAt || 0) - new Date(a.createdAt || a.updatedAt || 0));
            const normalized = normalizePropertyCodes(mapped);

            if (isMounted) {
              try { localStorage.setItem(INITIALIZED_KEY, 'true'); } catch {}
              setProperties(normalized);
              try { localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized)); } catch {}
            }
          } else if (error) {
            console.warn('Erro ao carregar imóveis do Supabase:', error.message);
          }
        } catch (err) {
          console.warn('Falha na conexão com Supabase:', err);
        }
      };

      fetchFromSupabase();

      // 2. Ouvir alterações em tempo real (Realtime Channel)
      let channel;
      try {
        channel = supabase
          .channel('public:properties')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: TABLE_NAME },
            () => {
              // Ao receber qualquer evento (INSERT, UPDATE, DELETE), recarregar para manter consistência
              fetchFromSupabase();
            }
          )
          .subscribe();
      } catch (err) {
        console.warn('Falha ao assinar canal Realtime do Supabase:', err);
      }

      return () => {
        isMounted = false;
        if (channel && supabase) {
          supabase.removeChannel(channel);
        }
      };
    } else {
      // Fallback: carregar dados locais se Supabase não estiver configurado
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setProperties(normalizePropertyCodes(parsed));
          }
        } catch {}
      }
    }
  }, []);

  // CRUD com Publicação Online Direta no Supabase
  const saveProperty = useCallback(async (formData, editId) => {
    const targetId = editId || `prop-${Date.now()}`;
    const sanitized = sanitizePropertyPayload(formData);
    const payload = {
      ...sanitized,
      id: targetId,
      status: sanitized.status || 'ativo',
      updatedAt: new Date().toISOString()
    };

    if (!editId) {
      payload.createdAt = formData?.createdAt || new Date().toISOString().split('T')[0];
    }

    // 1. Atualizar imediatamente o estado local
    try { localStorage.setItem(INITIALIZED_KEY, 'true'); } catch {}
    let updated;
    if (editId) {
      updated = properties.map(p => p.id === editId ? { ...p, ...payload } : p);
    } else {
      updated = [{ id: targetId, ...payload }, ...properties];
    }
    saveLocalBackup(updated);

    // 2. Salvar na nuvem Supabase se configurado
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from(TABLE_NAME).upsert({
          id: targetId,
          data: payload,
          updated_at: new Date().toISOString()
        });

        if (error) throw error;
        if (onToast) onToast(editId ? 'Imóvel atualizado na nuvem (Supabase)!' : 'Novo imóvel publicado online!');
      } catch (err) {
        console.error('Erro ao salvar no Supabase:', err);
        if (onToast) onToast(editId ? 'Imóvel atualizado localmente.' : 'Novo imóvel salvo localmente.');
      }
    } else {
      if (onToast) onToast(editId ? 'Imóvel atualizado localmente.' : 'Novo imóvel salvo localmente.');
    }
  }, [properties, saveLocalBackup, onToast]);

  const deleteProperty = useCallback(async (id, skipConfirm = false) => {
    if (!skipConfirm && typeof window !== 'undefined' && typeof window.confirm === 'function') {
      if (!window.confirm('Tem certeza de que deseja excluir este anúncio permanentemente?')) return;
    }

    // 1. Atualizar imediatamente o estado local
    const updated = properties.filter(p => p.id !== id);
    saveLocalBackup(updated);

    // 2. Excluir no Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from(TABLE_NAME).delete().eq('id', id);
        if (error) throw error;
        if (onToast) onToast('Anúncio excluído da nuvem com sucesso.');
      } catch (err) {
        console.error('Erro ao excluir no Supabase:', err);
        if (onToast) onToast('Anúncio excluído localmente.');
      }
    } else {
      if (onToast) onToast('Anúncio excluído localmente.');
    }
  }, [properties, saveLocalBackup, onToast]);

  const toggleFeatured = useCallback(async (id) => {
    const target = properties.find(p => p.id === id);
    if (!target) return;
    const newFeatured = !target.featured;

    const updatedPayload = { ...target, featured: newFeatured, updatedAt: new Date().toISOString() };
    const updated = properties.map(p => p.id === id ? updatedPayload : p);
    saveLocalBackup(updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from(TABLE_NAME).upsert({
          id,
          data: updatedPayload,
          updated_at: new Date().toISOString()
        });
        if (onToast) onToast(newFeatured ? 'Imóvel destacado na vitrine!' : 'Destaque removido.');
      } catch (err) {
        console.error('Erro ao atualizar destaque no Supabase:', err);
      }
    } else {
      if (onToast) onToast(newFeatured ? 'Imóvel destacado na vitrine!' : 'Destaque removido.');
    }
  }, [properties, saveLocalBackup, onToast]);

  const duplicateProperty = useCallback(async (prop) => {
    const newId = `prop-${Date.now()}`;
    const sanitized = sanitizePropertyPayload({
      ...prop,
      code: `${prop.code || prop.id}-COPIA`,
      title: `${prop.title} (Cópia)`
    });
    const duplicated = {
      ...sanitized,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString()
    };

    saveLocalBackup([duplicated, ...properties]);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from(TABLE_NAME).upsert({
          id: newId,
          data: duplicated,
          updated_at: new Date().toISOString()
        });
        if (onToast) onToast(`Imóvel duplicado na nuvem! Código: ${duplicated.code}`);
      } catch (err) {
        console.error('Erro ao duplicar no Supabase:', err);
        if (onToast) onToast(`Imóvel duplicado localmente.`);
      }
    } else {
      if (onToast) onToast(`Imóvel duplicado localmente. Código: ${duplicated.code}`);
    }
  }, [properties, saveLocalBackup, onToast]);

  const toggleStatus = useCallback(async (id, newStatus) => {
    const target = properties.find(p => p.id === id);
    if (!target) return;
    const updatedPayload = { ...target, status: newStatus, updatedAt: new Date().toISOString() };
    const updated = properties.map(p => p.id === id ? updatedPayload : p);
    saveLocalBackup(updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from(TABLE_NAME).upsert({
          id,
          data: updatedPayload,
          updated_at: new Date().toISOString()
        });
        if (onToast) onToast(`Status atualizado para: ${newStatus.toUpperCase()}`);
      } catch (err) {
        console.error('Erro ao atualizar status no Supabase:', err);
      }
    } else {
      if (onToast) onToast(`Status atualizado para: ${newStatus.toUpperCase()}`);
    }
  }, [properties, saveLocalBackup, onToast]);

  const bulkDelete = useCallback(async (ids, skipConfirm = false) => {
    if (!Array.isArray(ids) || ids.length === 0) return;
    if (!skipConfirm && typeof window !== 'undefined' && typeof window.confirm === 'function') {
      if (!window.confirm(`Tem certeza de que deseja excluir ${ids.length} imóvel(is) selecionado(s)?`)) return;
    }

    const updated = properties.filter(p => !ids.includes(p.id));
    saveLocalBackup(updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from(TABLE_NAME).delete().in('id', ids);
        if (onToast) onToast(`${ids.length} imóvel(is) excluído(s) da nuvem.`);
      } catch (err) {
        console.error('Erro ao excluir em lote no Supabase:', err);
      }
    } else {
      if (onToast) onToast(`${ids.length} imóvel(is) excluído(s) localmente.`);
    }
  }, [properties, saveLocalBackup, onToast]);

  const bulkStatusChange = useCallback(async (ids, newStatus) => {
    const updated = properties.map(p => ids.includes(p.id) ? { ...p, status: newStatus, updatedAt: new Date().toISOString() } : p);
    saveLocalBackup(updated);

    if (isSupabaseConfigured && supabase) {
      try {
        const rows = ids.map(id => {
          const prop = updated.find(p => p.id === id);
          return prop ? { id, data: prop, updated_at: new Date().toISOString() } : null;
        }).filter(Boolean);

        await supabase.from(TABLE_NAME).upsert(rows);
        if (onToast) onToast(`Status de ${ids.length} imóvel(is) atualizado na nuvem.`);
      } catch (err) {
        console.error('Erro ao atualizar status em lote no Supabase:', err);
      }
    } else {
      if (onToast) onToast(`Status de ${ids.length} imóvel(is) atualizado localmente.`);
    }
  }, [properties, saveLocalBackup, onToast]);

  // Backups
  const exportBackupJSON = useCallback(() => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(properties, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `backup_imoveis_anderson_kunicki_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    if (onToast) onToast('Backup JSON exportado com sucesso!');
  }, [properties, onToast]);

  const importBackupJSON = useCallback(async (file) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        if (Array.isArray(importedData)) {
          const sanitizedList = importedData.map((prop, index) => {
            const clean = sanitizePropertyPayload(prop);
            const docId = prop.id ? String(prop.id).trim() : `prop-${Date.now()}-${index}`;
            return {
              ...clean,
              id: docId,
              createdAt: prop.createdAt || new Date().toISOString().split('T')[0],
              updatedAt: new Date().toISOString()
            };
          });

          saveLocalBackup(sanitizedList);

          if (isSupabaseConfigured && supabase) {
            try {
              const rows = sanitizedList.map(p => ({
                id: p.id,
                data: p,
                updated_at: new Date().toISOString()
              }));
              const { error } = await supabase.from(TABLE_NAME).upsert(rows);
              if (error) throw error;
              if (onToast) onToast(`${sanitizedList.length} imóvel(is) publicado(s) online no Supabase!`);
            } catch (err) {
              console.error('Erro ao importar no Supabase:', err);
              if (onToast) onToast(`${sanitizedList.length} imóvel(is) importado(s) localmente.`);
            }
          } else {
            if (onToast) onToast(`${sanitizedList.length} imóvel(is) importado(s) localmente.`);
          }
        } else {
          if (onToast) onToast('Arquivo JSON inválido. Certifique-se de que é uma lista válida de imóveis.');
        }
      } catch (err) {
        if (onToast) onToast('Erro ao ler o arquivo JSON: ' + (err.message || 'Arquivo corrompido.'));
      }
    };
    reader.readAsText(file);
  }, [saveLocalBackup, onToast]);

  const resetFilters = useCallback(() => {
    setFilters({
      keyword: '',
      purpose: 'todos',
      type: 'todos',
      bedrooms: 'todos',
      maxPrice: 'Infinity',
      sortBy: 'recente'
    });
  }, []);

  // Propriedades Ativas e Filtradas
  const activeProperties = useMemo(() => {
    return properties.filter(prop => prop.status === 'ativo' || !prop.status);
  }, [properties]);

  const featuredProperties = useMemo(() => {
    return activeProperties.filter(prop => prop.featured);
  }, [activeProperties]);

  const filteredProperties = useMemo(() => {
    return activeProperties.filter(prop => {
      if (filters.purpose !== 'todos' && prop.purpose !== filters.purpose) return false;
      if (filters.type !== 'todos' && prop.type !== filters.type) return false;
      if (filters.bedrooms !== 'todos') {
        const minBeds = parseInt(filters.bedrooms, 10);
        if (prop.bedrooms < minBeds) return false;
      }
      if (filters.maxPrice !== 'Infinity') {
        const maxP = parseFloat(filters.maxPrice);
        if (prop.price > maxP) return false;
      }
      if (filters.keyword) {
        const kw = filters.keyword.toLowerCase();
        const mCode = (prop.code || prop.id || '').toLowerCase().includes(kw);
        const mTitle = (prop.title || '').toLowerCase().includes(kw);
        const mAddress = (prop.address || '').toLowerCase().includes(kw);
        const mNeigh = (prop.neighborhood || '').toLowerCase().includes(kw);
        if (!mCode && !mTitle && !mAddress && !mNeigh) return false;
      }
      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'preco-asc' || filters.sortBy === 'menor-preco') {
        return (Number(a.price) || 0) - (Number(b.price) || 0);
      }
      if (filters.sortBy === 'preco-desc' || filters.sortBy === 'maior-preco') {
        return (Number(b.price) || 0) - (Number(a.price) || 0);
      }
      if (Boolean(b.featured) !== Boolean(a.featured)) {
        return Boolean(b.featured) ? 1 : -1;
      }
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [activeProperties, filters]);

  return {
    properties,
    activeProperties,
    featuredProperties,
    filteredProperties,
    filters,
    setFilters,
    resetFilters,
    saveProperty,
    deleteProperty,
    toggleFeatured,
    duplicateProperty,
    toggleStatus,
    bulkDelete,
    bulkStatusChange,
    exportBackupJSON,
    importBackupJSON
  };
}
