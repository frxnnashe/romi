import { useState } from 'react';
import { FiCheckSquare, FiSquare, FiPlus, FiTrash2, FiEdit2, FiFilter, FiClock, FiAlertCircle } from 'react-icons/fi';
import PendienteModal from '../components/PendienteModal';
import { usePendientes } from '../hooks/usePendientes';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { value: 'informe', label: '📄 Informes', color: 'blue' },
  { value: 'turno', label: '📅 Turnos', color: 'green' },
  { value: 'contacto', label: '📞 Contactos', color: 'purple' },
  { value: 'administrativo', label: '📋 Administrativo', color: 'orange' },
  { value: 'personal', label: '💼 Personal', color: 'pink' },
  { value: 'otro', label: '📌 Otros', color: 'gray' },
];

const PRIORITIES = [
  { value: 'alta', label: '🔴 Alta', color: 'red' },
  { value: 'media', label: '🟡 Media', color: 'yellow' },
  { value: 'baja', label: '🟢 Baja', color: 'green' },
];

export default function PendientesPage({ darkMode }) {
  const { pendientes, savePendiente, deletePendiente, toggleComplete } = usePendientes();
  
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedPendiente, setSelectedPendiente] = useState(null);

  // Filtrar pendientes
  const filteredPendientes = pendientes.filter(p => {
    const matchCategory = filterCategory === 'all' || p.category === filterCategory;
    const matchStatus = filterStatus === 'all' || 
                       (filterStatus === 'completed' ? p.completed : !p.completed);
    return matchCategory && matchStatus;
  }).sort((a, b) => {
    // Ordenar por: no completados primero, luego por prioridad, luego por fecha
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    
    const priorityOrder = { alta: 0, media: 1, baja: 2 };
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const handleCreate = () => {
    setSelectedPendiente(null);
    setShowModal(true);
  };

  const handleEdit = (pendiente) => {
    setSelectedPendiente(pendiente);
    setShowModal(true);
  };

  const handleSave = async (pendienteData) => {
    try {
      await savePendiente(pendienteData);
      toast.success(selectedPendiente ? 'Pendiente actualizado' : 'Pendiente creado');
      setShowModal(false);
      setSelectedPendiente(null);
    } catch (error) {
      toast.error('Error al guardar');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar este pendiente?')) {
      try {
        await deletePendiente(id);
        toast.success('Pendiente eliminado');
      } catch (error) {
        toast.error('Error al eliminar');
      }
    }
  };

  const handleToggle = async (id, currentStatus) => {
    try {
      await toggleComplete(id, !currentStatus);
      toast.success(currentStatus ? 'Marcado como pendiente' : '✓ Completado');
    } catch (error) {
      toast.error('Error al actualizar');
    }
  };

  // Estadísticas
  const totalPendientes = pendientes.length;
  const completados = pendientes.filter(p => p.completed).length;
  const pendientesActivos = totalPendientes - completados;
  const urgentes = pendientes.filter(p => !p.completed && p.priority === 'alta').length;

  const getCategoryColor = (category) => {
    const cat = CATEGORIES.find(c => c.value === category);
    return cat ? cat.color : 'gray';
  };

  const getPriorityColor = (priority) => {
    const pri = PRIORITIES.find(p => p.value === priority);
    return pri ? pri.color : 'gray';
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-lg p-4 md:p-6`}>
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-3`}>
              <FiCheckSquare className="text-teal-500" size={28} />
              Pendientes
            </h1>
            <p className={`mt-2 text-sm md:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Gestiona tareas, recordatorios y pendientes
            </p>
          </div>
          <button
            onClick={handleCreate}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-white transition text-sm md:text-base ${
              darkMode ? 'bg-teal-600 hover:bg-teal-700' : 'bg-teal-500 hover:bg-teal-600'
            }`}
          >
            <FiPlus size={18} />
            Nuevo Pendiente
          </button>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-6">
          <div className={`p-3 md:p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
            <p className={`text-xs md:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total</p>
            <p className={`text-xl md:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {totalPendientes}
            </p>
          </div>
          <div className={`p-3 md:p-4 rounded-lg ${darkMode ? 'bg-yellow-900/20 border border-yellow-700' : 'bg-yellow-50 border border-yellow-200'}`}>
            <p className={`text-xs md:text-sm ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>Pendientes</p>
            <p className={`text-xl md:text-2xl font-bold ${darkMode ? 'text-yellow-300' : 'text-yellow-600'}`}>
              {pendientesActivos}
            </p>
          </div>
          <div className={`p-3 md:p-4 rounded-lg ${darkMode ? 'bg-green-900/20 border border-green-700' : 'bg-green-50 border border-green-200'}`}>
            <p className={`text-xs md:text-sm ${darkMode ? 'text-green-400' : 'text-green-700'}`}>Completados</p>
            <p className={`text-xl md:text-2xl font-bold ${darkMode ? 'text-green-300' : 'text-green-600'}`}>
              {completados}
            </p>
          </div>
          <div className={`p-3 md:p-4 rounded-lg ${darkMode ? 'bg-red-900/20 border border-red-700' : 'bg-red-50 border border-red-200'}`}>
            <p className={`text-xs md:text-sm ${darkMode ? 'text-red-400' : 'text-red-700'}`}>Urgentes</p>
            <p className={`text-xl md:text-2xl font-bold ${darkMode ? 'text-red-300' : 'text-red-600'}`}>
              {urgentes}
            </p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-lg p-4`}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <FiFilter className="inline mr-1" size={12} />
              Categoría
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border transition text-sm ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="all">Todas las categorías</option>
              {CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Estado
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border transition text-sm ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="all">Todos</option>
              <option value="pending">Solo pendientes</option>
              <option value="completed">Solo completados</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Pendientes */}
      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-lg p-4 md:p-6`}>
        <div className="space-y-2">
          {filteredPendientes.length > 0 ? (
            filteredPendientes.map((pendiente) => {
              const categoryInfo = CATEGORIES.find(c => c.value === pendiente.category);
              const priorityInfo = PRIORITIES.find(p => p.value === pendiente.priority);

              return (
                <div
                  key={pendiente.id}
                  className={`p-3 md:p-4 rounded-lg border transition ${
                    pendiente.completed
                      ? darkMode
                        ? 'bg-slate-700/50 border-slate-600 opacity-60'
                        : 'bg-gray-50 border-gray-200 opacity-60'
                      : darkMode
                        ? 'bg-slate-700 border-slate-600 hover:bg-slate-650'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <button
                      onClick={() => handleToggle(pendiente.id, pendiente.completed)}
                      className={`flex-shrink-0 mt-1 ${
                        pendiente.completed
                          ? 'text-green-500'
                          : darkMode
                            ? 'text-gray-400 hover:text-teal-400'
                            : 'text-gray-400 hover:text-teal-600'
                      }`}
                    >
                      {pendiente.completed ? <FiCheckSquare size={24} /> : <FiSquare size={24} />}
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className={`font-semibold text-sm md:text-base ${
                          pendiente.completed
                            ? 'line-through'
                            : darkMode
                              ? 'text-white'
                              : 'text-gray-900'
                        }`}>
                          {pendiente.title}
                        </h3>
                        
                        {/* Category badge */}
                        <span className={`text-xs px-2 py-0.5 rounded-full bg-${categoryInfo?.color}-500/20 text-${categoryInfo?.color}-${darkMode ? '300' : '700'}`}>
                          {categoryInfo?.label}
                        </span>

                        {/* Priority badge */}
                        {!pendiente.completed && (
                          <span className={`text-xs px-2 py-0.5 rounded-full bg-${priorityInfo?.color}-500/20 text-${priorityInfo?.color}-${darkMode ? '300' : '700'}`}>
                            {priorityInfo?.label}
                          </span>
                        )}
                      </div>

                      {pendiente.description && (
                        <p className={`text-xs md:text-sm mb-2 ${
                          pendiente.completed
                            ? 'line-through'
                            : darkMode
                              ? 'text-gray-400'
                              : 'text-gray-600'
                        }`}>
                          {pendiente.description}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-3 text-xs">
                        {pendiente.dueDate && (
                          <span className={`flex items-center gap-1 ${
                            darkMode ? 'text-gray-500' : 'text-gray-500'
                          }`}>
                            <FiClock size={12} />
                            {new Date(pendiente.dueDate).toLocaleDateString('es-AR')}
                          </span>
                        )}
                        {pendiente.completed && pendiente.completedAt && (
                          <span className={`flex items-center gap-1 ${
                            darkMode ? 'text-green-400' : 'text-green-600'
                          }`}>
                            ✓ {new Date(pendiente.completedAt).toLocaleDateString('es-AR')}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(pendiente)}
                        className={`p-2 rounded transition ${
                          darkMode
                            ? 'hover:bg-slate-600 text-gray-400'
                            : 'hover:bg-gray-200 text-gray-600'
                        }`}
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(pendiente.id)}
                        className={`p-2 rounded transition ${
                          darkMode
                            ? 'hover:bg-red-600/20 text-red-400'
                            : 'hover:bg-red-100 text-red-600'
                        }`}
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className={`text-center py-12 text-sm md:text-base ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {filterCategory !== 'all' || filterStatus !== 'all'
                ? 'No hay pendientes con los filtros seleccionados'
                : '¡Sin pendientes! Crea uno nuevo para comenzar'}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <PendienteModal
        darkMode={darkMode}
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedPendiente(null);
        }}
        onSave={handleSave}
        pendiente={selectedPendiente}
        categories={CATEGORIES}
        priorities={PRIORITIES}
      />
    </div>
  );
}