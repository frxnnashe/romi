// src/hooks/useTherapyNotes.js
import { useState, useEffect } from 'react';
import { useFirestore } from './useFirestore';
import { where } from 'firebase/firestore';

export const useTherapyNotes = () => {
  const { addDocument, updateDocument, deleteDocument, getDocuments } = useFirestore('therapyNotes');
  const [therapyNotes, setTherapyNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTherapyNotes = async () => {
    setLoading(true);
    try {
      const data = await getDocuments();
      setTherapyNotes(data);
    } finally {
      setLoading(false);
    }
  };

  const getNotesByPatient = async (patientId) => {
    return await getDocuments([where('patientId', '==', patientId)]);
  };

  const saveTherapyNote = async (noteData) => {
    // Si tiene ID, es una actualización
    if (noteData.id) {
      const { id, ...dataWithoutId } = noteData;
      await updateDocument(id, dataWithoutId);
      await fetchTherapyNotes();
      return id;
    } else {
      // Si no tiene ID, es nuevo
      const id = await addDocument(noteData);
      await fetchTherapyNotes();
      return id;
    }
  };

  const deleteTherapyNote = async (id) => {
    await deleteDocument(id);
    await fetchTherapyNotes();
  };

  useEffect(() => {
    fetchTherapyNotes();
  }, []);

  return {
    therapyNotes,
    getNotesByPatient,
    saveTherapyNote,
    deleteTherapyNote,
    loading,
    fetchTherapyNotes,
  };
};