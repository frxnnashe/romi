import { useState } from 'react';
import { FiX, FiPlus, FiEdit2, FiTrash2, FiPackage } from 'react-icons/fi';

const PRESET_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e', '#64748b', '#78716c', '#a8a29e'
];

export default function ToolManagementModal({ 
  darkMode, 
  isOpen, 
  onClose, 
  availableTools,
  onSaveTool,
  onDeleteTool 
}) {
  const [editingTool, setEditingTool] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: PRESET_COLORS[0],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = (tool) => {
    setEditingTool(tool);
    setFormData({
      name: tool.name,
      description: tool.description || '',
      color: tool.color,
    });
  };

  const handleCancel = () => {
    setEditingTool(null);
    setFormData({
      name: '',
      description: '',
      color: PRESET_COLORS[0],
    });
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      alert('Por favor ingresa el nombre de la herramienta');
      return;
    }

    const toolData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      color: formData.color,
    };

    // Si está editando, incluir el ID
    if (editingTool) {
      toolData.id = editingTool.id;
    }

    await onSaveTool(toolData);
    handleCancel();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto`}>
        {/* Header */}
        <div className={`flex justify-between items-center p-4 md:p-6 border-b ${darkMode ? 'border-slate-700' : 'border-gray-200'} sticky top-0 bg-inherit z-10`}>
          <div>
            <h2 className={`text-xl md:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
              <FiPackage className="text-purple-500" size={24} />
              Gestión de Herramientas
            </h2>
            <p className={`text-xs md:text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Crea y administra las herramientas terapéuticas
            </p>
          </div>
          <button onClick={onClose} className={`hover:opacity-70 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <FiX size={24} />
          </button>
        </div>

        <div className="p-4 md:p-6">
          {/* Formulario de nueva/editar herramienta */}
          <div className={`p-4 rounded-lg mb-6 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
            <h3 className={`font-semibold mb-4 text-sm md:text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {editingTool ? 'Editar Herramienta' : 'Agregar Nueva Herramienta'}
            </h3>
            
            <div className="space-y-3">
              {/* Nombre */}
              <div>
                <label className={`block text-xs md:text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Nombre *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ej: Juegos de Mesa"
                  className={`w-full px-3 py-2 rounded-lg border transition text-sm md:text-base ${
                    darkMode
                      ? 'bg-slate-600 border-slate-500 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              {/* Descripción */}
              <div>
                <label className={`block text-xs md:text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Descripción
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Ej: Para observar reacciones..."
                  className={`w-full px-3 py-2 rounded-lg border transition text-sm md:text-base ${
                    darkMode
                      ? 'bg-slate-600 border-slate-500 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              {/* Color */}
              <div>
                <label className={`block text-xs md:text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Color
                </label>
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, color }))}
                      className={`w-full aspect-square rounded-lg transition ${
                        formData.color === color ? 'ring-4 ring-offset-2 ring-blue-500' : ''
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              {/* Botones */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                {editingTool && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className={`w-full sm:w-auto px-4 py-2 rounded-lg font-medium transition text-sm md:text-base ${
                      darkMode
                        ? 'bg-slate-600 hover:bg-slate-500 text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    Cancelar
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleSubmit}
                  className={`w-full sm:flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-white transition text-sm md:text-base ${
                    darkMode
                      ? 'bg-purple-600 hover:bg-purple-700'
                      : 'bg-purple-500 hover:bg-purple-600'
                  }`}
                >
                  <FiPlus size={18} />
                  {editingTool ? 'Actualizar' : 'Agregar Herramienta'}
                </button>
              </div>
            </div>
          </div>

          {/* Lista de herramientas */}
          <div>
            <h3 className={`font-semibold mb-3 text-sm md:text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Herramientas Registradas ({availableTools.length})
            </h3>
            
            {availableTools.length > 0 ? (
              <div className="space-y-2">
                {availableTools.map((tool) => (
                  <div
                    key={tool.id}
                    className={`p-3 rounded-lg border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                      darkMode ? 'border-slate-600' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 w-full">
                      <div
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex-shrink-0"
                        style={{ backgroundColor: tool.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-semibold text-sm md:text-base truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {tool.name}
                        </h4>
                        {tool.description && (
                          <p className={`text-xs md:text-sm truncate ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {tool.description}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => handleEdit(tool)}
                        className={`flex-1 sm:flex-none p-2 rounded-lg transition ${
                          darkMode
                            ? 'bg-slate-600 hover:bg-slate-500 text-white'
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        <FiEdit2 size={18} />
                      </button>
                      <button
                        onClick={() => onDeleteTool(tool.id)}
                        className={`flex-1 sm:flex-none p-2 rounded-lg transition ${
                          darkMode
                            ? 'bg-red-600/20 hover:bg-red-600/30 text-red-400'
                            : 'bg-red-100 hover:bg-red-200 text-red-600'
                        }`}
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`text-center py-8 text-sm md:text-base ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No hay herramientas registradas
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className={`p-4 border-t ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
          <button
            onClick={onClose}
            className={`w-full py-2 rounded-lg font-medium transition text-sm md:text-base ${
              darkMode
                ? 'bg-slate-700 hover:bg-slate-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}