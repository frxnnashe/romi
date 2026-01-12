// src/hooks/usePendientes.js
import { useState, useEffect } from 'react';
import { useFirestore } from './useFirestore';

export const usePendientes = () => {
  const { addDocument, updateDocument, deleteDocument, getDocuments } = useFirestore('pendientes');
  const [pendientes, setPendientes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPendientes = async () => {
    setLoading(true);
    try {
      const data = await getDocuments();
      setPendientes(data);
    } finally {
      setLoading(false);
    }
  };

  const savePendiente = async (pendienteData) => {
    if (pendienteData.id) {
      const { id, ...dataWithoutId } = pendienteData;
      await updateDocument(id, dataWithoutId);
      await fetchPendientes();
      return id;
    } else {
      const id = await addDocument(pendienteData);
      await fetchPendientes();
      return id;
    }
  };

  const deletePendiente = async (id) => {
    await deleteDocument(id);
    await fetchPendientes();
  };

  const toggleComplete = async (id, completed) => {
    const updateData = {
      completed,
      completedAt: completed ? new Date().toISOString() : null,
      updatedAt: new Date().toISOString(),
    };
    await updateDocument(id, updateData);
    await fetchPendientes();
  };

  useEffect(() => {
    fetchPendientes();
  }, []);

  return {
    pendientes,
    savePendiente,
    deletePendiente,
    toggleComplete,
    loading,
    fetchPendientes,
  };
};