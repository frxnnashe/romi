// src/pages/PatientsPage.jsx
import { useState } from 'react';
import PatientList from '../components/PatientList';
import PatientModal from '../components/PatientModal';
import PatientAnnualCalendar from '../components/PatientAnnualCalendar';
import { usePatients } from '../hooks/usePatients';
import toast from 'react-hot-toast';

export default function PatientsPage({ darkMode }) {
  const { patients, addPatient, updatePatient, deletePatient } = usePatients();
  
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

  const handleEditPatient = (patient) => {
    setSelectedPatient(patient);
    setIsPatientModalOpen(true);
  };

  const handleSavePatient = async (patientData) => {
    try {
      if (selectedPatient) {
        await updatePatient(selectedPatient.id, patientData);
        toast.success('Paciente actualizado');
      } else {
        await addPatient({
          ...patientData,
          annualCalendar: {} // Inicializar calendario vacío
        });
        toast.success('Paciente creado');
      }
      setIsPatientModalOpen(false);
      setSelectedPatient(null);
    } catch (error) {
      toast.error('Error al guardar paciente');
    }
  };

  const handleDeletePatient = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este paciente?')) {
      try {
        await deletePatient(id);
        toast.success('Paciente eliminado');
      } catch (error) {
        toast.error('Error al eliminar paciente');
      }
    }
  };

  const handleViewAppointments = (patientId) => {
    // Aquí puedes redirigir a una vista de historial de turnos
    toast.info('Función de historial de turnos (próximamente)');
  };

  const handleViewAnnualCalendar = (patient) => {
    setSelectedPatient(patient);
    setIsCalendarModalOpen(true);
  };

  const handleSaveCalendar = async (patientId, calendarData) => {
    try {
      await updatePatient(patientId, { annualCalendar: calendarData });
      toast.success('Calendario guardado exitosamente');
      setIsCalendarModalOpen(false);
      setSelectedPatient(null);
    } catch (error) {
      toast.error('Error al guardar calendario');
    }
  };

  return (
    <div>
      <PatientList
        darkMode={darkMode}
        patients={patients}
        onEdit={handleEditPatient}
        onDelete={handleDeletePatient}
        onViewAppointments={handleViewAppointments}
        onViewAnnualCalendar={handleViewAnnualCalendar}
      />

      <PatientModal
        darkMode={darkMode}
        isOpen={isPatientModalOpen}
        onClose={() => {
          setIsPatientModalOpen(false);
          setSelectedPatient(null);
        }}
        onSave={handleSavePatient}
        patient={selectedPatient}
      />

      <PatientAnnualCalendar
        darkMode={darkMode}
        isOpen={isCalendarModalOpen}
        onClose={() => {
          setIsCalendarModalOpen(false);
          setSelectedPatient(null);
        }}
        patient={selectedPatient}
        onSave={handleSaveCalendar}
      />
    </div>
  );
}