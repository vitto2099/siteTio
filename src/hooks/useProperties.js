import { useState, useEffect, useCallback, useMemo } from 'react';
import { INITIAL_PROPERTIES } from '../data/properties';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  writeBatch
} from 'firebase/firestore';

const STORAGE_KEY = 'anderson_kunicki_react_properties_v2';
const COLLECTION_NAME = 'properties';

export function useProperties(onToast) {
  const [properties, setProperties] = useState(() => {
    try {
      // Limpa chave antiga de demonstração se existir
      localStorage.removeItem('anderson_kunicki_react_properties_v1');
      
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Filtra quaisquer itens mock antigos
          const realProps = parsed.filter(p => !p.id?.startsWith('prop-00'));
          return realProps;
        }
      }
      return INITIAL_PROPERTIES;
    } catch {
      return INITIAL_PROPERTIES;
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
          
          // Ordenar por data de criação decrescente
          fetched.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

          setProperties(fetched);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(fetched));
        }, (error) => {
          console.warn('⚠️ Erro ao sincronizar com Firestore, operando com cache local:', error);
        });

        return () => unsubscribe();
      } catch (err) {
        console.warn('⚠️ Falha ao inicializar listener do Firestore:', err);
      }
    } else {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setProperties(JSON.parse(stored));
        } catch {
          setProperties(INITIAL_PROPERTIES);
        }
      }
    }
  }, []);

  const saveLocalBackup = useCallback((updatedProps) => {
    setProperties(updatedProps);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProps));
  }, []);

  // CRUD — Integrado com Firestore + Contingência Local
  const saveProperty = useCallback(async (formData, editId) => {
    const targetId = editId || `prop-${Date.now()}`;
    const payload = {
      ...formData,
      status: formData.status || 'ativo',
      updatedAt: new Date().toISOString()
    };

    if (!editId) {
      payload.createdAt = new Date().toISOString().split('T')[0];
    }

    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, COLLECTION_NAME, targetId);
        await setDoc(docRef, payload, { merge: true });
        if (onToast) onToast(editId ? 'Imóvel atualizado na nuvem (Firebase)!' : 'Novo imóvel salvo na nuvem (Firebase)!');
        return;
      } catch (err) {
        console.error('Erro ao salvar no Firestore:', err);
        if (onToast) onToast('Erro de conexao com o banco de dados. Salvando localmente...');
      }
    }

    // Fallback local
    if (editId) {
      const updated = properties.map(p => p.id === editId ? { ...p, ...payload } : p);
      saveLocalBackup(updated);
      if (onToast) onToast('Anúncio imobiliário atualizado com sucesso!');
    } else {
      const newProp = { id: targetId, ...payload };
      saveLocalBackup([newProp, ...properties]);
      if (onToast) onToast('Novo imóvel cadastrado com sucesso!');
    }
  }, [properties, saveLocalBackup, onToast]);

  const deleteProperty = useCallback(async (id) => {
    if (!window.confirm('Tem certeza de que deseja excluir este anúncio permanentemente?')) return;

    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
        if (onToast) onToast('Anúncio excluído da nuvem (Firebase).');
        return;
      } catch (err) {
        console.error('Erro ao excluir no Firestore:', err);
      }
    }

    const updated = properties.filter(p => p.id !== id);
    saveLocalBackup(updated);
    if (onToast) onToast('Anúncio excluído com sucesso.');
  }, [properties, saveLocalBackup, onToast]);

  const toggleFeatured = useCallback(async (id) => {
    const target = properties.find(p => p.id === id);
    if (!target) return;
    const newFeatured = !target.featured;

    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, COLLECTION_NAME, id), { featured: newFeatured });
        if (onToast) onToast(newFeatured ? 'Imóvel destacado na vitrine!' : 'Destaque removido.');
        return;
      } catch (err) {
        console.error('Erro ao atualizar destaque no Firestore:', err);
      }
    }

    const updated = properties.map(p => p.id === id ? { ...p, featured: newFeatured } : p);
    saveLocalBackup(updated);
    if (onToast) onToast(newFeatured ? 'Imóvel destacado na vitrine!' : 'Destaque removido.');
  }, [properties, saveLocalBackup, onToast]);

  const duplicateProperty = useCallback(async (prop) => {
    const newId = `prop-${Date.now()}`;
    const duplicated = {
      ...prop,
      id: newId,
      code: `${prop.code || prop.id}-COPIA`,
      title: `${prop.title} (Cópia)`,
      createdAt: new Date().toISOString().split('T')[0]
    };

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, COLLECTION_NAME, newId), duplicated);
        if (onToast) onToast(`Imóvel duplicado na nuvem! Código: ${duplicated.code}`);
        return;
      } catch (err) {
        console.error('Erro ao duplicar no Firestore:', err);
      }
    }

    saveLocalBackup([duplicated, ...properties]);
    if (onToast) onToast(`Imóvel duplicado! Código: ${duplicated.code}`);
  }, [properties, saveLocalBackup, onToast]);

  const toggleStatus = useCallback(async (id, newStatus) => {
    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, COLLECTION_NAME, id), { status: newStatus });
        if (onToast) onToast(`Status atualizado para: ${newStatus.toUpperCase()}`);
        return;
      } catch (err) {
        console.error('Erro ao atualizar status no Firestore:', err);
      }
    }

    const updated = properties.map(p => p.id === id ? { ...p, status: newStatus } : p);
    saveLocalBackup(updated);
    if (onToast) onToast(`Status atualizado para: ${newStatus.toUpperCase()}`);
  }, [properties, saveLocalBackup, onToast]);

  const bulkDelete = useCallback(async (ids) => {
    if (!window.confirm(`Tem certeza de que deseja excluir ${ids.length} imóvel(is) selecionado(s)?`)) return;

    if (isFirebaseConfigured && db) {
      try {
        const batch = writeBatch(db);
        ids.forEach(id => {
          batch.delete(doc(db, COLLECTION_NAME, id));
        });
        await batch.commit();
        if (onToast) onToast(`${ids.length} imóvel(is) excluído(s) da nuvem.`);
        return;
      } catch (err) {
        console.error('Erro ao excluir em lote no Firestore:', err);
      }
    }

    const updated = properties.filter(p => !ids.includes(p.id));
    saveLocalBackup(updated);
    if (onToast) onToast(`${ids.length} imóvel(is) excluído(s) em lote.`);
  }, [properties, saveLocalBackup, onToast]);

  const bulkStatusChange = useCallback(async (ids, newStatus) => {
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

    const updated = properties.map(p => ids.includes(p.id) ? { ...p, status: newStatus } : p);
    saveLocalBackup(updated);
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
          if (isFirebaseConfigured && db) {
            const batch = writeBatch(db);
            importedData.forEach(prop => {
              const docId = prop.id || `prop-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
              batch.set(doc(db, COLLECTION_NAME, docId), prop, { merge: true });
            });
            await batch.commit();
            if (onToast) onToast(`${importedData.length} imóvel(is) importado(s) para o Firebase!`);
          } else {
            saveLocalBackup(importedData);
            if (onToast) onToast(`${importedData.length} imóvel(is) importado(s) localmente!`);
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
      if (filters.sortBy === 'preco-asc') return a.price - b.price;
      if (filters.sortBy === 'preco-desc') return b.price - a.price;
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
