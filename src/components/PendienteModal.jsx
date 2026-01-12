import { useState, useEffect } from 'react';
import { FiX, FiSave, FiCalendar } from 'react-icons/fi';

export default function PendienteModal({ 
  darkMode, 
  isOpen, 
  onClose, 
  onSave, 
  pendiente,
  categories,
  priorities 
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'otro',
    priority: 'media',
    dueDate: '',
  });

  useEffect(() => {
    if (pendiente) {
      setFormData({
        title: pendiente.title,
        description: pendiente.description || '',
        category: pendiente.category,
        priority: pendiente.priority,
        dueDate: pendiente.dueDate || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: 'otro',
        priority: 'media',
        dueDate: '',
      });
    }
  }, [pendiente, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      alert('Por favor ingresa un título');
      return;
    }

    const dataToSave = {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
    };

    if (pendiente) {
      dataToSave.id = pendiente.id;
      dataToSave.completed = pendiente.completed;
      dataToSave.completedAt = pendiente.completedAt;
      dataToSave.createdAt = pendiente.createdAt;
    } else {
      dataToSave.completed = false;
      dataToSave.completedAt = null;
      dataToSave.createdAt = new Date().toISOString();
    }

    dataToSave.updatedAt = new Date().toISOString();

    onSave(dataToSave);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-2xl w-full max-w-lg`}>
        {/* Header */}
        <div className={`flex justify-between items-center p-6 border-b ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
          <div>
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {pendiente ? 'Editar Pendiente' : 'Nuevo Pendiente'}
            </h2>
            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Agrega tareas y recordatorios
            </p>
          </div>
          <button onClick={onClose} className={`hover:opacity-70 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <FiX size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Título */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Título *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ej: Entregar informe a Juan, Coordinar con escuela..."
              className={`w-full px-3 py-2 rounded-lg border transition ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          {/* Descripción */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Descripción / Detalles
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Agrega más detalles si necesitas..."
              rows={3}
              className={`w-full px-3 py-2 rounded-lg border transition resize-none ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          {/* Categoría y Prioridad */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Categoría *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-lg border transition ${
                  darkMode
                    ? 'bg-slate-700 border-slate-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Prioridad *
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-lg border transition ${
                  darkMode
                    ? 'bg-slate-700 border-slate-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                {priorities.map(pri => (
                  <option key={pri.value} value={pri.value}>
                    {pri.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Fecha límite */}
          <div>
            <label className={`block text-sm font-medium mb-2 flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <FiCalendar size={16} />
              Fecha Límite (opcional)
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-lg border transition ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 py-2 rounded-lg font-medium transition ${
                darkMode
                  ? 'bg-slate-700 hover:bg-slate-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className={`flex-1 py-2 rounded-lg font-medium text-white transition flex items-center justify-center gap-2 ${
                darkMode
                  ? 'bg-teal-600 hover:bg-teal-700'
                  : 'bg-teal-500 hover:bg-teal-600'
              }`}
            >
              <FiSave size={18} />
              {pendiente ? 'Actualizar' : 'Crear Pendiente'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}