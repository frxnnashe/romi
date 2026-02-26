// src/pages/PatientsPage.jsx
import { useState } from 'react';
import { FiArchive } from 'react-icons/fi';
import PatientList from '../components/PatientList';
import PatientModal from '../components/PatientModal';
import PatientAnnualCalendar from '../components/PatientAnnualCalendar';
import { usePatients } from '../hooks/usePatients';
import toast from 'react-hot-toast';

export default function PatientsPage({ darkMode }) {
  const [showArchived, setShowArchived] = useState(false);
  const { patients, addPatient, updatePatient, deletePatient, archivePatient, unarchivePatient } = usePatients(showArchived);
  
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
    if (window.confirm('¿Estás seguro de eliminar este paciente? Esta acción no se puede deshacer.')) {
      try {
        await deletePatient(id);
        toast.success('Paciente eliminado');
      } catch (error) {
        toast.error('Error al eliminar paciente');
      }
    }
  };

  const handleArchivePatient = async (id) => {
    try {
      await archivePatient(id);
      toast.success('Paciente archivado');
    } catch (error) {
      toast.error('Error al archivar paciente');
    }
  };

  const handleUnarchivePatient = async (id) => {
    try {
      await unarchivePatient(id);
      toast.success('Paciente desarchivado');
    } catch (error) {
      toast.error('Error al desarchivar paciente');
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
    <div className="space-y-4">
      {/* Toggle para ver archivados */}
      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-lg p-4`}>
        <button
          onClick={() => setShowArchived(!showArchived)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
            showArchived
              ? darkMode
                ? 'bg-orange-600 hover:bg-orange-700 text-white'
                : 'bg-orange-500 hover:bg-orange-600 text-white'
              : darkMode
                ? 'bg-slate-700 hover:bg-slate-600 text-gray-300'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
        >
          <FiArchive size={18} />
          {showArchived ? 'Ocultar Archivados' : 'Mostrar Archivados'}
        </button>
      </div>

      <PatientList
        darkMode={darkMode}
        patients={patients}
        onEdit={handleEditPatient}
        onDelete={handleDeletePatient}
        onArchive={handleArchivePatient}
        onUnarchive={handleUnarchivePatient}
        onViewAppointments={handleViewAppointments}
        onViewAnnualCalendar={handleViewAnnualCalendar}
        showArchived={showArchived}
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