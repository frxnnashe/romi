import { useState, useEffect } from 'react';
import { FiFileText, FiSearch, FiPlus, FiEdit2, FiEye, FiTrash2 } from 'react-icons/fi';
import ClinicalHistoryModal from '../components/ClinicalHistoryModal';
import ClinicalHistoryViewModal from '../components/ClinicalHistoryViewModal';
import { usePatients } from '../hooks/usePatients';
import { useClinicalHistory } from '../hooks/useClinicalHistory';
import toast from 'react-hot-toast';

export default function ClinicalHistoryPage({ darkMode }) {
  const { patients } = usePatients();
  const { clinicalHistories, saveClinicalHistory, deleteClinicalHistory, getClinicalHistoryByPatient } = useClinicalHistory();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [showPatientSelector, setShowPatientSelector] = useState(false);

  // Combinar pacientes con sus historias
  const patientsWithHistory = patients.map(patient => {
    const history = clinicalHistories.find(h => h.patientId === patient.id);
    return {
      ...patient,
      hasHistory: !!history,
      history: history || null
    };
  });

  const filteredPatients = patientsWithHistory.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.dni.includes(searchTerm)
  );

  const handleCreateHistory = (patient) => {
    setSelectedPatient(patient);
    setSelectedHistory(patient.history);
    setIsEditModalOpen(true);
    setShowPatientSelector(false);
  };

  const handleViewHistory = (patient) => {
    setSelectedPatient(patient);
    setSelectedHistory(patient.history);
    setIsViewModalOpen(true);
  };

  const handleEditHistory = (patient) => {
    setSelectedPatient(patient);
    setSelectedHistory(patient.history);
    setIsEditModalOpen(true);
  };

  const handleSaveHistory = async (historyData) => {
    try {
      await saveClinicalHistory(historyData);
      toast.success('Historia clínica guardada exitosamente');
      setIsEditModalOpen(false);
      setSelectedPatient(null);
      setSelectedHistory(null);
    } catch (error) {
      toast.error('Error al guardar historia clínica');
    }
  };

  const handleDeleteHistory = async (historyId, patientName) => {
    if (window.confirm(`¿Estás seguro de eliminar la historia clínica de ${patientName}?`)) {
      try {
        await deleteClinicalHistory(historyId);
        toast.success('Historia clínica eliminada');
      } catch (error) {
        toast.error('Error al eliminar historia clínica');
      }
    }
  };

  const patientsWithHistoryCount = patientsWithHistory.filter(p => p.hasHistory).length;
  const patientsWithoutHistoryCount = patients.length - patientsWithHistoryCount;

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-3`}>
              <FiFileText className="text-purple-500" size={32} />
              Historias Clínicas
            </h1>
            <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Gestión de historias clínicas de pacientes
            </p>
          </div>
          <button
            onClick={() => setShowPatientSelector(!showPatientSelector)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white transition ${
              darkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'
            }`}
          >
            <FiPlus size={20} />
            Nueva Historia
          </button>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Pacientes</p>
            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {patients.length}
            </p>
          </div>
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-green-900/20 border border-green-700' : 'bg-green-50 border border-green-200'}`}>
            <p className={`text-sm ${darkMode ? 'text-green-400' : 'text-green-700'}`}>Con Historia Clínica</p>
            <p className={`text-2xl font-bold ${darkMode ? 'text-green-300' : 'text-green-600'}`}>
              {patientsWithHistoryCount}
            </p>
          </div>
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-orange-900/20 border border-orange-700' : 'bg-orange-50 border border-orange-200'}`}>
            <p className={`text-sm ${darkMode ? 'text-orange-400' : 'text-orange-700'}`}>Sin Historia Clínica</p>
            <p className={`text-2xl font-bold ${darkMode ? 'text-orange-300' : 'text-orange-600'}`}>
              {patientsWithoutHistoryCount}
            </p>
          </div>
        </div>
      </div>

      {/* Selector de paciente para nueva historia */}
      {showPatientSelector && (
        <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border-2 rounded-lg shadow-lg p-6`}>
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Selecciona un paciente para crear/editar su historia clínica
          </h3>
          <div className="mb-4 relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar paciente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border transition ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
          <div className="max-h-64 overflow-y-auto space-y-2">
            {filteredPatients.map((patient) => (
              <button
                key={patient.id}
                onClick={() => handleCreateHistory(patient)}
                className={`w-full text-left p-3 rounded-lg transition flex items-center justify-between ${
                  darkMode
                    ? 'bg-slate-700 hover:bg-slate-600 text-white'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                }`}
              >
                <div>
                  <p className="font-semibold">{patient.name}</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    DNI: {patient.dni}
                  </p>
                </div>
                {patient.hasHistory && (
                  <span className={`text-xs px-2 py-1 rounded ${
                    darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'
                  }`}>
                    Con Historia
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Lista de historias clínicas */}
      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
        <div className="mb-6">
          <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Historias Clínicas Registradas
          </h2>
        </div>

        {/* Búsqueda */}
        {!showPatientSelector && (
          <div className="mb-6 relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o DNI..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border transition ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
        )}

        {/* Lista */}
        <div className="space-y-3">
          {filteredPatients.filter(p => p.hasHistory).length > 0 ? (
            filteredPatients.filter(p => p.hasHistory).map((patient) => (
              <div
                key={patient.id}
                className={`p-4 rounded-lg border transition ${
                  darkMode
                    ? 'bg-slate-700 border-slate-600 hover:bg-slate-650'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {patient.name}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded ${
                        darkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-700'
                      }`}>
                        <FiFileText className="inline mr-1" size={12} />
                        Historia Completa
                      </span>
                    </div>
                    <div className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <p>DNI: {patient.dni}</p>
                      {patient.history?.lastUpdate && (
                        <p className="text-xs mt-1">
                          Última actualización: {new Date(patient.history.lastUpdate).toLocaleDateString('es-AR')}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewHistory(patient)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1 ${
                        darkMode
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                      title="Ver Historia"
                    >
                      <FiEye size={16} />
                      Ver
                    </button>
                    <button
                      onClick={() => handleEditHistory(patient)}
                      className={`p-2 rounded-lg transition ${
                        darkMode
                          ? 'bg-slate-600 hover:bg-slate-500 text-white'
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                      title="Editar"
                    >
                      <FiEdit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteHistory(patient.history.id, patient.name)}
                      className={`p-2 rounded-lg transition ${
                        darkMode
                          ? 'bg-red-600/20 hover:bg-red-600/30 text-red-400'
                          : 'bg-red-100 hover:bg-red-200 text-red-600'
                      }`}
                      title="Eliminar"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {searchTerm ? 'No se encontraron historias clínicas' : 'No hay historias clínicas registradas'}
            </div>
          )}
        </div>
      </div>

      {/* Modales */}
      <ClinicalHistoryModal
        darkMode={darkMode}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedPatient(null);
          setSelectedHistory(null);
        }}
        onSave={handleSaveHistory}
        patient={selectedPatient}
        clinicalHistory={selectedHistory}
      />

      {selectedHistory && (
        <ClinicalHistoryViewModal
          darkMode={darkMode}
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedPatient(null);
            setSelectedHistory(null);
          }}
          patient={selectedPatient}
          clinicalHistory={selectedHistory}
        />
      )}
    </div>
  );
}