import { useState, useEffect } from 'react';
import { FiX, FiSave, FiFolder } from 'react-icons/fi';

export default function FolderModal({ darkMode, isOpen, onClose, onSave, folder }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#6366f1',
  });

  const FOLDER_COLORS = [
    { value: '#6366f1', label: 'Índigo' },
    { value: '#8b5cf6', label: 'Púrpura' },
    { value: '#ec4899', label: 'Rosa' },
    { value: '#ef4444', label: 'Rojo' },
    { value: '#f97316', label: 'Naranja' },
    { value: '#eab308', label: 'Amarillo' },
    { value: '#22c55e', label: 'Verde' },
    { value: '#14b8a6', label: 'Turquesa' },
    { value: '#3b82f6', label: 'Azul' },
    { value: '#64748b', label: 'Gris' },
  ];

  useEffect(() => {
    if (folder) {
      setFormData(folder);
    } else {
      setFormData({
        name: '',
        description: '',
        color: '#6366f1',
      });
    }
  }, [folder, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      alert('Por favor ingresa el nombre de la carpeta');
      return;
    }

    const dataToSave = {
      ...formData,
      name: formData.name.trim(),
      description: formData.description.trim(),
      lastUpdate: new Date().toISOString(),
    };

    if (folder) {
      dataToSave.id = folder.id;
    }

    onSave(dataToSave);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-2xl w-full max-w-md`}>
        {/* Header */}
        <div className={`flex justify-between items-center p-6 border-b ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
          <div>
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {folder ? 'Editar Carpeta' : 'Nueva Carpeta'}
            </h2>
            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Organiza tu conocimiento
            </p>
          </div>
          <button onClick={onClose} className={`hover:opacity-70 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <FiX size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Nombre */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Nombre de la Carpeta *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej: Cursos 2025, Técnicas Avanzadas..."
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
              Descripción
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Ej: Material de cursos y formaciones realizadas..."
              rows={3}
              className={`w-full px-3 py-2 rounded-lg border transition resize-none ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          {/* Color */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Color de la Carpeta
            </label>
            <div className="grid grid-cols-5 gap-2">
              {FOLDER_COLORS.map((colorOption) => (
                <button
                  key={colorOption.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, color: colorOption.value }))}
                  className={`w-full aspect-square rounded-lg transition flex items-center justify-center ${
                    formData.color === colorOption.value ? 'ring-4 ring-offset-2 ring-blue-500' : ''
                  }`}
                  style={{ backgroundColor: colorOption.value }}
                  title={colorOption.label}
                >
                  {formData.color === colorOption.value && (
                    <FiFolder size={20} className="text-white" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className={`p-4 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'}`}>
            <p className={`text-xs mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Vista previa:</p>
            <div className="flex items-center gap-2">
              <FiFolder size={24} style={{ color: formData.color }} />
              <div className="flex-1 min-w-0">
                <p className={`font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {formData.name || 'Nombre de carpeta'}
                </p>
                {formData.description && (
                  <p className={`text-xs truncate ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {formData.description}
                  </p>
                )}
              </div>
            </div>
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
                  ? 'bg-indigo-600 hover:bg-indigo-700'
                  : 'bg-indigo-500 hover:bg-indigo-600'
              }`}
            >
              <FiSave size={18} />
              {folder ? 'Actualizar' : 'Crear Carpeta'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}