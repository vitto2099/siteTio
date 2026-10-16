import { useState, useEffect, useCallback, useMemo } from 'react';
import { INITIAL_PROPERTIES, LEGACY_MOCKUP_IDS, getCategoryPrefix } from '../data/properties';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { sanitizePropertyPayload } from '../utils/security';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { 
  cloudSaveProperty, 
  cloudDeleteProperty, 
  cloudFetchProperties 
} from '../lib/cloudApi';

export const STORAGE_KEY = 'anderson_kunicki_properties_v3';
export const INITIALIZED_KEY = 'anderson_kunicki_db_initialized_v3';
const COLLECTION_NAME = 'properties';

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

  // Listener em tempo real do Firestore com contingência REST
  useEffect(() => {
    let isMounted = true;

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

          if (isMounted) {
            try { localStorage.setItem(INITIALIZED_KEY, 'true'); } catch {}
            setProperties(normalized);
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized)); } catch {}
          }
        }, async (error) => {
          console.warn('Listener Firestore restrito, sincronizando via REST API:', error);
          const restData = await cloudFetchProperties();
          if (isMounted && Array.isArray(restData)) {
            const normalized = normalizePropertyCodes(restData);
            setProperties(normalized);
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized)); } catch {}
          }
        });

        return () => {
          isMounted = false;
          unsubscribe();
        };
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

  // CRUD com Publicação Online Direta na Nuvem
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

    // 2. Salvar na nuvem online de forma infalível
    try {
      await cloudSaveProperty(targetId, payload);
      if (onToast) onToast(editId ? 'Imóvel atualizado na nuvem online!' : 'Novo imóvel publicado online!');
    } catch (err) {
      console.error('Erro ao salvar na nuvem:', err);
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

    // 2. Excluir na nuvem online
    try {
      await cloudDeleteProperty(id);
      if (onToast) onToast('Anúncio excluído da nuvem com sucesso.');
    } catch (err) {
      console.error('Erro ao excluir na nuvem:', err);
      if (onToast) onToast('Anúncio excluído localmente.');
    }
  }, [properties, saveLocalBackup, onToast]);

  const toggleFeatured = useCallback(async (id) => {
    const target = properties.find(p => p.id === id);
    if (!target) return;
    const newFeatured = !target.featured;

    const updated = properties.map(p => p.id === id ? { ...p, featured: newFeatured } : p);
    saveLocalBackup(updated);

    try {
      await cloudSaveProperty(id, { ...target, featured: newFeatured });
      if (onToast) onToast(newFeatured ? 'Imóvel destacado na vitrine!' : 'Destaque removido.');
    } catch (err) {
      console.error('Erro ao atualizar destaque na nuvem:', err);
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

    try {
      await cloudSaveProperty(newId, duplicated);
      if (onToast) onToast(`Imóvel duplicado na nuvem! Código: ${duplicated.code}`);
    } catch (err) {
      console.error('Erro ao duplicar na nuvem:', err);
      if (onToast) onToast(`Imóvel duplicado localmente.`);
    }
  }, [properties, saveLocalBackup, onToast]);

  const toggleStatus = useCallback(async (id, newStatus) => {
    const target = properties.find(p => p.id === id);
    const updated = properties.map(p => p.id === id ? { ...p, status: newStatus } : p);
    saveLocalBackup(updated);

    try {
      if (target) await cloudSaveProperty(id, { ...target, status: newStatus });
      if (onToast) onToast(`Status atualizado para: ${newStatus.toUpperCase()}`);
    } catch (err) {
      console.error('Erro ao atualizar status na nuvem:', err);
    }
  }, [properties, saveLocalBackup, onToast]);

  const bulkDelete = useCallback(async (ids, skipConfirm = false) => {
    if (!Array.isArray(ids) || ids.length === 0) return;
    if (!skipConfirm && typeof window !== 'undefined' && typeof window.confirm === 'function') {
      if (!window.confirm(`Tem certeza de que deseja excluir ${ids.length} imóvel(is) selecionado(s)?`)) return;
    }

    const updated = properties.filter(p => !ids.includes(p.id));
    saveLocalBackup(updated);

    try {
      await Promise.all(ids.map(id => cloudDeleteProperty(id)));
      if (onToast) onToast(`${ids.length} imóvel(is) excluído(s) da nuvem.`);
    } catch (err) {
      console.error('Erro ao excluir em lote na nuvem:', err);
    }
  }, [properties, saveLocalBackup, onToast]);

  const bulkStatusChange = useCallback(async (ids, newStatus) => {
    const updated = properties.map(p => ids.includes(p.id) ? { ...p, status: newStatus } : p);
    saveLocalBackup(updated);

    try {
      await Promise.all(
        ids.map(id => {
          const prop = properties.find(p => p.id === id);
          if (prop) return cloudSaveProperty(id, { ...prop, status: newStatus });
          return Promise.resolve();
        })
      );
      if (onToast) onToast(`Status de ${ids.length} imóvel(is) atualizado na nuvem.`);
    } catch (err) {
      console.error('Erro ao atualizar status em lote na nuvem:', err);
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

          try {
            await Promise.all(sanitizedList.map(p => cloudSaveProperty(p.id, p)));
            if (onToast) onToast(`${sanitizedList.length} imóvel(is) publicado(s) online na nuvem!`);
          } catch (err) {
            console.error('Erro ao importar na nuvem:', err);
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
