import { useState } from 'react';
import { FiTool, FiSearch, FiPlus, FiEdit2, FiTrash2, FiCalendar, FiPackage } from 'react-icons/fi';
import ToolSessionModal from '../components/ToolSessionModal';
import ToolManagementModal from '../components/ToolManagementModal';
import { usePatients } from '../hooks/usePatients';
import { useTherapeuticTools } from '../hooks/useTherapeuticTools';
import toast from 'react-hot-toast';

export default function TherapeuticToolsPage({ darkMode }) {
  const { patients } = usePatients();
  const { 
    toolSessions, 
    availableTools, 
    saveToolSession, 
    deleteToolSession,
    saveAvailableTool,
    deleteAvailableTool 
  } = useTherapeuticTools();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPatientId, setFilterPatientId] = useState('all');
  const [selectedSession, setSelectedSession] = useState(null);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [isToolManagementOpen, setIsToolManagementOpen] = useState(false);

  // Filtrar sesiones
  const filteredSessions = toolSessions.filter(session => {
    const matchesSearch = session.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPatient = filterPatientId === 'all' || session.patientId === filterPatientId;
    return matchesSearch && matchesPatient;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleCreateSession = () => {
    setSelectedSession(null);
    setIsSessionModalOpen(true);
  };

  const handleEditSession = (session) => {
    setSelectedSession(session);
    setIsSessionModalOpen(true);
  };

  const handleSaveSession = async (sessionData) => {
    try {
      await saveToolSession(sessionData);
      toast.success(selectedSession ? 'Sesión actualizada' : 'Sesión registrada');
      setIsSessionModalOpen(false);
      setSelectedSession(null);
    } catch (error) {
      toast.error('Error al guardar sesión');
    }
  };

  const handleDeleteSession = async (sessionId) => {
    if (window.confirm('¿Estás seguro de eliminar este registro?')) {
      try {
        await deleteToolSession(sessionId);
        toast.success('Registro eliminado');
      } catch (error) {
        toast.error('Error al eliminar');
      }
    }
  };

  const handleSaveTool = async (toolData) => {
    try {
      await saveAvailableTool(toolData);
      toast.success('Herramienta guardada');
    } catch (error) {
      toast.error('Error al guardar herramienta');
    }
  };

  const handleDeleteTool = async (toolId) => {
    if (window.confirm('¿Estás seguro de eliminar esta herramienta?')) {
      try {
        await deleteAvailableTool(toolId);
        toast.success('Herramienta eliminada');
      } catch (error) {
        toast.error('Error al eliminar');
      }
    }
  };

  // Estadísticas
  const totalSessions = toolSessions.length;
  const patientsWithSessions = new Set(toolSessions.map(s => s.patientId)).size;
  const mostUsedTool = availableTools.reduce((acc, tool) => {
    const count = toolSessions.filter(s => s.tools && s.tools.includes(tool.name)).length;
    return count > acc.count ? { name: tool.name, count } : acc;
  }, { name: '-', count: 0 });

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-lg p-4 md:p-6`}>
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-3`}>
              <FiTool className="text-orange-500" size={28} />
              Herramientas Terapéuticas
            </h1>
            <p className={`mt-2 text-sm md:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Registro y gestión de herramientas utilizadas
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => setIsToolManagementOpen(true)}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-white transition text-sm md:text-base ${
                darkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'
              }`}
            >
              <FiPackage size={18} />
              Gestionar Herramientas
            </button>
            <button
              onClick={handleCreateSession}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-white transition text-sm md:text-base ${
                darkMode ? 'bg-orange-600 hover:bg-orange-700' : 'bg-orange-500 hover:bg-orange-600'
              }`}
            >
              <FiPlus size={18} />
              Nueva Sesión
            </button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mt-6">
          <div className={`p-3 md:p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
            <p className={`text-xs md:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Sesiones</p>
            <p className={`text-xl md:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {totalSessions}
            </p>
          </div>
          <div className={`p-3 md:p-4 rounded-lg ${darkMode ? 'bg-orange-900/20 border border-orange-700' : 'bg-orange-50 border border-orange-200'}`}>
            <p className={`text-xs md:text-sm ${darkMode ? 'text-orange-400' : 'text-orange-700'}`}>Herramientas</p>
            <p className={`text-xl md:text-2xl font-bold ${darkMode ? 'text-orange-300' : 'text-orange-600'}`}>
              {availableTools.length}
            </p>
          </div>
          <div className={`p-3 md:p-4 rounded-lg ${darkMode ? 'bg-blue-900/20 border border-blue-700' : 'bg-blue-50 border border-blue-200'}`}>
            <p className={`text-xs md:text-sm ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>Pacientes</p>
            <p className={`text-xl md:text-2xl font-bold ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
              {patientsWithSessions}
            </p>
          </div>
          <div className={`p-3 md:p-4 rounded-lg ${darkMode ? 'bg-green-900/20 border border-green-700' : 'bg-green-50 border border-green-200'}`}>
            <p className={`text-xs md:text-sm ${darkMode ? 'text-green-400' : 'text-green-700'}`}>Más Utilizada</p>
            <p className={`text-sm md:text-lg font-bold truncate ${darkMode ? 'text-green-300' : 'text-green-600'}`}>
              {mostUsedTool.name}
            </p>
            <p className={`text-xs ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
              {mostUsedTool.count} veces
            </p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-lg p-4`}>
        <div className="flex flex-col md:flex-row gap-3 md:gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Buscar por paciente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border transition text-sm md:text-base ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
          <select
            value={filterPatientId}
            onChange={(e) => setFilterPatientId(e.target.value)}
            className={`px-4 py-2 rounded-lg border transition text-sm md:text-base ${
              darkMode
                ? 'bg-slate-700 border-slate-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="all">Todos</option>
            {patients.map(patient => (
              <option key={patient.id} value={patient.id}>
                {patient.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de Sesiones */}
      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-lg p-4 md:p-6`}>
        <h2 className={`text-lg md:text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Sesiones Registradas
        </h2>

        <div className="space-y-3">
          {filteredSessions.length > 0 ? (
            filteredSessions.map((session) => (
              <div
                key={session.id}
                className={`p-4 rounded-lg border transition ${
                  darkMode
                    ? 'bg-slate-700 border-slate-600 hover:bg-slate-650'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className={`font-semibold text-base md:text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {session.patientName}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${
                        darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'
                      }`}>
                        <FiCalendar size={12} />
                        {new Date(session.date).toLocaleDateString('es-AR')}
                      </span>
                    </div>
                    
                    <div className={`text-xs md:text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <span className="font-medium">Herramientas:</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {session.tools && session.tools.map((tool, idx) => {
                        const toolData = availableTools.find(t => t.name === tool);
                        return (
                          <span
                            key={idx}
                            className="px-3 py-1 rounded-full text-xs md:text-sm font-medium"
                            style={{
                              backgroundColor: toolData?.color || '#6b7280',
                              color: '#ffffff'
                            }}
                          >
                            {tool}
                          </span>
                        );
                      })}
                    </div>

                    {session.notes && (
                      <p className={`text-xs md:text-sm mt-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        📝 {session.notes}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditSession(session)}
                      className={`p-2 rounded-lg transition ${
                        darkMode
                          ? 'bg-slate-600 hover:bg-slate-500 text-white'
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteSession(session.id)}
                      className={`p-2 rounded-lg transition ${
                        darkMode
                          ? 'bg-red-600/20 hover:bg-red-600/30 text-red-400'
                          : 'bg-red-100 hover:bg-red-200 text-red-600'
                      }`}
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={`text-center py-12 text-sm md:text-base ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {searchTerm || filterPatientId !== 'all' 
                ? 'No se encontraron sesiones'
                : 'No hay sesiones registradas'}
            </div>
          )}
        </div>
      </div>

      {/* Modales */}
      <ToolSessionModal
        darkMode={darkMode}
        isOpen={isSessionModalOpen}
        onClose={() => {
          setIsSessionModalOpen(false);
          setSelectedSession(null);
        }}
        onSave={handleSaveSession}
        patients={patients}
        availableTools={availableTools}
        session={selectedSession}
      />

      <ToolManagementModal
        darkMode={darkMode}
        isOpen={isToolManagementOpen}
        onClose={() => setIsToolManagementOpen(false)}
        availableTools={availableTools}
        onSaveTool={handleSaveTool}
        onDeleteTool={handleDeleteTool}
      />
    </div>
  );
}