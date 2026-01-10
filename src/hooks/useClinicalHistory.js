// src/hooks/useClinicalHistory.js
import { useState, useEffect } from 'react';
import { useFirestore } from './useFirestore';
import { where } from 'firebase/firestore';

export const useClinicalHistory = () => {
  const { addDocument, updateDocument, deleteDocument, getDocuments } = useFirestore('clinicalHistories');
  const [clinicalHistories, setClinicalHistories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchClinicalHistories = async () => {
    setLoading(true);
    try {
      const data = await getDocuments();
      setClinicalHistories(data);
    } finally {
      setLoading(false);
    }
  };

  const getClinicalHistoryByPatient = async (patientId) => {
    const histories = await getDocuments([where('patientId', '==', patientId)]);
    return histories.length > 0 ? histories[0] : null;
  };

  const saveClinicalHistory = async (historyData) => {
    // Verificar si ya existe una historia para este paciente
    const existing = await getClinicalHistoryByPatient(historyData.patientId);
    
    if (existing) {
      // Actualizar la existente
      await updateDocument(existing.id, historyData);
      await fetchClinicalHistories();
      return existing.id;
    } else {
      // Crear nueva
      const id = await addDocument(historyData);
      await fetchClinicalHistories();
      return id;
    }
  };

  const deleteClinicalHistory = async (id) => {
    await deleteDocument(id);
    await fetchClinicalHistories();
  };

  useEffect(() => {
    fetchClinicalHistories();
  }, []);

  return {
    clinicalHistories,
    getClinicalHistoryByPatient,
    saveClinicalHistory,
    deleteClinicalHistory,
    loading,
    fetchClinicalHistories,
  };
};