import { useState, useEffect, useCallback, useMemo } from 'react';
import { INITIAL_PROPERTIES, LEGACY_MOCKUP_IDS, getCategoryPrefix } from '../data/properties';
import { db, auth, isFirebaseConfigured } from '../lib/firebase';
import { sanitizePropertyPayload } from '../utils/security';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  writeBatch
} from 'firebase/firestore';

export const STORAGE_KEY = 'anderson_kunicki_properties_v3';
export const INITIALIZED_KEY = 'anderson_kunicki_db_initialized_v3';
const COLLECTION_NAME = 'properties';

// Normaliza codigos legados e remove os 5 mockups antigos descartados
function normalizePropertyCodes(list) {
  if (!Array.isArray(list)) return [];
  const legacySet = new Set(LEGACY_MOCKUP_IDS);

  const cleaned = list
    .filter(p => p && !p.id?.startsWith('prop-00') && !legacySet.has(p.id))
    .map(p => {
      if (p.id === 'prop-ca-101' && (!Array.isArray(p.images) || p.images.length <= 3) && p.price === 420000) {
        return { ...INITIAL_PROPERTIES[0] };
      }
      if (p.code && p.code.startsWith('AK-')) {
        const num = p.code.replace('AK-', '');
        const prefix = getCategoryPrefix(p.type, p.purpose);
        return { ...p, code: `${prefix}-${num}` };
      }
      return p;
    });

  return cleaned;
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

      // Se o usuário já operou no sistema e a lista ficou vazia, mantém vazia
      if (isInitialized) {
        return [];
      }

      // Primeira carga inicial absoluta do sistema
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

  // Listener em tempo real do Firestore (ou sincronização local)
  useEffect(() => {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, COLLECTION_NAME));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const fetched = [];
          snapshot.forEach((docSnap) => {
            fetched.push({ id: docSnap.id, ...docSnap.data() });
          });
          
          fetched.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
          const normalized = normalizePropertyCodes(fetched);

          // Atualiza o estado mesmo se o Firestore estiver vazio (ex: usuário excluiu todos os imóveis)
          try { localStorage.setItem(INITIALIZED_KEY, 'true'); } catch {}
          setProperties(normalized);
          try { localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized)); } catch {}
        }, (error) => {
          console.warn('Erro ao sincronizar com Firestore, operando com cache local:', error);
        });

        return () => unsubscribe();
      } catch (err) {
        console.warn('Falha ao inicializar listener do Firestore:', err);
      }
    } else {
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

  const saveLocalBackup = useCallback((updatedProps) => {
    setProperties(updatedProps);
    try {
      localStorage.setItem(INITIALIZED_KEY, 'true');
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProps));
    } catch (err) {
      console.warn('Limite de armazenamento local atingido:', err);
    }
  }, []);

  // CRUD integrado com Firestore + Atualização Local Imediata
  const saveProperty = useCallback(async (formData, editId) => {
    const targetId = editId || `prop-${Date.now()}`;
    const sanitized = sanitizePropertyPayload(formData);
    const payload = {
      ...sanitized,
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

    // 2. Salvar na nuvem (Firestore) se configurado
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, COLLECTION_NAME, targetId);
        await setDoc(docRef, payload, { merge: true });
        if (onToast) onToast(editId ? 'Imóvel atualizado na nuvem (Firebase)!' : 'Novo imóvel salvo na nuvem (Firebase)!');
        return;
      } catch (err) {
        console.error('Erro ao salvar no Firestore:', err);
        if (onToast) onToast(editId ? 'Anúncio atualizado localmente!' : 'Novo imóvel salvo localmente!');
        return;
      }
    }

    if (onToast) onToast(editId ? 'Anúncio atualizado com sucesso!' : 'Novo imóvel cadastrado com sucesso!');
  }, [properties, saveLocalBackup, onToast]);

  const deleteProperty = useCallback(async (id, skipConfirm = false) => {
    if (!skipConfirm && typeof window !== 'undefined' && typeof window.confirm === 'function') {
      if (!window.confirm('Tem certeza de que deseja excluir este anúncio permanentemente?')) return;
    }

    // 1. Atualizar imediatamente o estado local (UI rápida e garantida)
    const updated = properties.filter(p => p.id !== id);
    saveLocalBackup(updated);

    // 2. Excluir no Firestore se configurado
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
        if (onToast) onToast('Anúncio excluído da nuvem (Firebase).');
        return;
      } catch (err) {
        console.error('Erro ao excluir no Firestore:', err);
        if (onToast) onToast('Anúncio excluído localmente.');
        return;
      }
    }

    if (onToast) onToast('Anúncio excluído com sucesso.');
  }, [properties, saveLocalBackup, onToast]);

  const toggleFeatured = useCallback(async (id) => {
    const target = properties.find(p => p.id === id);
    if (!target) return;
    const newFeatured = !target.featured;

    // 1. Atualizar imediatamente local
    const updated = properties.map(p => p.id === id ? { ...p, featured: newFeatured } : p);
    saveLocalBackup(updated);

    // 2. Atualizar no Firestore
    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, COLLECTION_NAME, id), { featured: newFeatured });
        if (onToast) onToast(newFeatured ? 'Imóvel destacado na vitrine!' : 'Destaque removido.');
        return;
      } catch (err) {
        console.error('Erro ao atualizar destaque no Firestore:', err);
      }
    }

    if (onToast) onToast(newFeatured ? 'Imóvel destacado na vitrine!' : 'Destaque removido.');
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

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, COLLECTION_NAME, newId), duplicated);
        if (onToast) onToast(`Imóvel duplicado na nuvem! Código: ${duplicated.code}`);
        return;
      } catch (err) {
        console.error('Erro ao duplicar no Firestore:', err);
      }
    }

    if (onToast) onToast(`Imóvel duplicado! Código: ${duplicated.code}`);
  }, [properties, saveLocalBackup, onToast]);

  const toggleStatus = useCallback(async (id, newStatus) => {
    const updated = properties.map(p => p.id === id ? { ...p, status: newStatus } : p);
    saveLocalBackup(updated);

    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, COLLECTION_NAME, id), { status: newStatus });
        if (onToast) onToast(`Status atualizado para: ${newStatus.toUpperCase()}`);
        return;
      } catch (err) {
        console.error('Erro ao atualizar status no Firestore:', err);
      }
    }

    if (onToast) onToast(`Status atualizado para: ${newStatus.toUpperCase()}`);
  }, [properties, saveLocalBackup, onToast]);

  const bulkDelete = useCallback(async (ids, skipConfirm = false) => {
    if (!Array.isArray(ids) || ids.length === 0) return;
    if (!skipConfirm && typeof window !== 'undefined' && typeof window.confirm === 'function') {
      if (!window.confirm(`Tem certeza de que deseja excluir ${ids.length} imóvel(is) selecionado(s)?`)) return;
    }

    const updated = properties.filter(p => !ids.includes(p.id));
    saveLocalBackup(updated);

    if (isFirebaseConfigured && db) {
      try {
        const batch = writeBatch(db);
        ids.forEach(id => {
          batch.delete(doc(db, COLLECTION_NAME, id));
        });
        await batch.commit();
        if (onToast) onToast(`${ids.length} imóvel(is) excluído(s) da nuvem (Firebase).`);
        return;
      } catch (err) {
        console.error('Erro ao excluir em lote no Firestore:', err);
      }
    }

    if (onToast) onToast(`${ids.length} imóvel(is) excluído(s) em lote.`);
  }, [properties, saveLocalBackup, onToast]);

  const bulkStatusChange = useCallback(async (ids, newStatus) => {
    const updated = properties.map(p => ids.includes(p.id) ? { ...p, status: newStatus } : p);
    saveLocalBackup(updated);

    if (isFirebaseConfigured && db) {
      try {
        const batch = writeBatch(db);
        ids.forEach(id => {
          batch.update(doc(db, COLLECTION_NAME, id), { status: newStatus });
        });
        await batch.commit();
        if (onToast) onToast(`Status de ${ids.length} imóvel(is) atualizado na nuvem.`);
        return;
      } catch (err) {
        console.error('Erro ao atualizar status em lote no Firestore:', err);
      }
    }

    if (onToast) onToast(`Status de ${ids.length} imóvel(is) alterado para ${newStatus.toUpperCase()}`);
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

          if (isFirebaseConfigured && db) {
            try {
              const batch = writeBatch(db);
              sanitizedList.forEach(prop => {
                batch.set(doc(db, COLLECTION_NAME, prop.id), prop, { merge: true });
              });
              await batch.commit();
              if (onToast) onToast(`${sanitizedList.length} imóvel(is) importado(s) para o Firebase!`);
              return;
            } catch (err) {
              console.error('Erro ao importar para Firestore, salvando localmente:', err);
            }
          }
          if (onToast) onToast(`${sanitizedList.length} imóvel(is) importado(s) localmente!`);
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
