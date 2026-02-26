// src/hooks/usePatients.js
import { useState, useEffect } from 'react';
import { useFirestore } from './useFirestore';
import { where } from 'firebase/firestore';

export const usePatients = (includeArchived = false) => {
  const { addDocument, updateDocument, deleteDocument, getDocuments } = useFirestore('patients');
  const { getDocuments: getAppointments } = useFirestore('appointments');
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const data = await getDocuments();
      const filtered = includeArchived ? data : data.filter(p => !p.archived);
      setPatients(filtered);
      setFilteredPatients(filtered);
    } finally {
      setLoading(false);
    }
  };

  const searchPatients = (searchTerm) => {
    const filtered = patients.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.dni.includes(searchTerm)
    );
    setFilteredPatients(filtered);
  };

  const addPatient = async (patientData) => {
    const id = await addDocument(patientData);
    await fetchPatients();
    return id;
  };

  const updatePatient = async (id, patientData) => {
    await updateDocument(id, patientData);
    await fetchPatients();
  };

  const deletePatient = async (id) => {
    await deleteDocument(id);
    await fetchPatients();
  };

  const archivePatient = async (id) => {
    await updateDocument(id, { archived: true, archivedAt: new Date().toISOString() });
    await fetchPatients();
  };

  const unarchivePatient = async (id) => {
    await updateDocument(id, { archived: false, archivedAt: null });
    await fetchPatients();
  };

  const getPatientAppointments = async (patientId) => {
    return await getAppointments([where('patientId', '==', patientId)]);
  };

  useEffect(() => {
    fetchPatients();
  }, [includeArchived]);

  return {
    patients,
    filteredPatients,
    searchPatients,
    addPatient,
    updatePatient,
    deletePatient,
    archivePatient,
    unarchivePatient,
    getPatientAppointments,
    loading,
    fetchPatients,
  };
};
