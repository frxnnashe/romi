// src/hooks/useAppointments.js
import { useState, useEffect } from 'react';
import { useFirestore } from './useFirestore';
import { where } from 'firebase/firestore';

export const useAppointments = () => {
  const { addDocument, updateDocument, deleteDocument, getDocuments } = useFirestore('appointments');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const data = await getDocuments();
      setAppointments(data);
    } finally {
      setLoading(false);
    }
  };

  const addAppointment = async (appointmentData) => {
    const dataWithStatus = {
      ...appointmentData,
      status: appointmentData.status || null, // D, //, F, S o null
    };
    const id = await addDocument(dataWithStatus);
    await fetchAppointments();
    return id;
  };

  const updateAppointment = async (id, appointmentData) => {
    await updateDocument(id, appointmentData);
    await fetchAppointments();
  };

  const updateAppointmentStatus = async (id, status) => {
    await updateDocument(id, { status });
    await fetchAppointments();
  };

  const deleteAppointment = async (id) => {
    await deleteDocument(id);
    await fetchAppointments();
  };

  const getAppointmentsByPatient = async (patientId) => {
    return await getDocuments([where('patientId', '==', patientId)]);
  };

  const getAppointmentsByDate = async (date) => {
    return await getDocuments([where('date', '==', date)]);
  };

  const getAppointmentsByMonth = async (month, year) => {
    const allAppointments = await getDocuments();
    return allAppointments.filter((apt) => {
      const date = new Date(apt.date);
      return date.getMonth() === month && date.getFullYear() === year;
    });
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return {
    appointments,
    addAppointment,
    updateAppointment,
    updateAppointmentStatus,
    deleteAppointment,
    getAppointmentsByPatient,
    getAppointmentsByDate,
    getAppointmentsByMonth,
    loading,
    fetchAppointments,
  };
};