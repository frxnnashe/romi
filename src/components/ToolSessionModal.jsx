import { useState, useEffect } from 'react';
import { FiX, FiSave, FiCalendar, FiTool, FiFileText } from 'react-icons/fi';

export default function ToolSessionModal({ 
  darkMode, 
  isOpen, 
  onClose, 
  onSave, 
  patients,
  availableTools,
  session 
}) {
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    date: new Date().toISOString().split('T')[0],
    tools: [],
    notes: '',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);

  useEffect(() => {
    if (session) {
      setFormData(session);
      setSearchTerm(session.patientName);
    } else {
      setFormData({
        patientId: '',
        patientName: '',
        date: new Date().toISOString().split('T')[0],
        tools: [],
        notes: '',
      });
      setSearchTerm('');
    }
  }, [session, isOpen]);

  const handlePatientSearch = (value) => {
    setSearchTerm(value);
    setShowPatientDropdown(value.length > 0);
  };

  const selectPatient = (patient) => {
    setFormData(prev => ({
      ...prev,
      patientId: patient.id,
      patientName: patient.name,
    }));
    setSearchTerm(patient.name);
    setShowPatientDropdown(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleTool = (toolName) => {
    setFormData(prev => ({
      ...prev,
      tools: prev.tools.includes(toolName)
        ? prev.tools.filter(t => t !== toolName)
        : [...prev.tools, toolName]
    }));
  };

  const handleSubmit = () => {
    if (!formData.patientId || formData.tools.length === 0) {
      alert('Por favor selecciona un paciente y al menos una herramienta');
      return;
    }

    const dataToSave = {
      ...formData,
      lastUpdate: new Date().toISOString(),
    };

    onSave(dataToSave);
  };

  if (!isOpen) return null;

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto`}>
        {/* Header */}
        <div className={`flex justify-between items-center p-4 md:p-6 border-b ${darkMode ? 'border-slate-700' : 'border-gray-200'} sticky top-0 bg-inherit z-10`}>
          <div>
            <h2 className={`text-xl md:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {session ? 'Editar Sesión' : 'Nueva Sesión con Herramientas'}
            </h2>
            <p className={`text-xs md:text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Registra las herramientas utilizadas
            </p>
          </div>
          <button onClick={onClose} className={`hover:opacity-70 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <FiX size={24} />
          </button>
        </div>

        <div className="p-4 md:p-6 space-y-5">
          {/* Paciente */}
          <div className="relative">
            <label className={`block text-xs md:text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Paciente *
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handlePatientSearch(e.target.value)}
              onFocus={() => searchTerm && setShowPatientDropdown(true)}
              placeholder="Buscar paciente..."
              disabled={!!session}
              className={`w-full px-3 py-2 rounded-lg border transition text-sm md:text-base ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900'
              } ${session ? 'opacity-60 cursor-not-allowed' : ''}`}
            />
            {showPatientDropdown && filteredPatients.length > 0 && !session && (
              <div className={`absolute top-full left-0 right-0 mt-1 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto ${
                darkMode ? 'bg-slate-700' : 'bg-white border border-gray-300'
              }`}>
                {filteredPatients.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => selectPatient(p)}
                    className={`w-full text-left px-3 py-2 transition text-sm md:text-base ${
                      darkMode ? 'hover:bg-slate-600 text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Fecha */}
          <div>
            <label className={`block text-xs md:text-sm font-medium mb-2 flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <FiCalendar size={16} />
              Fecha de la Sesión *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-lg border transition text-sm md:text-base ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          {/* Herramientas */}
          <div>
            <label className={`block text-xs md:text-sm font-medium mb-3 flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <FiTool size={16} />
              Herramientas Utilizadas *
            </label>
            {availableTools.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {availableTools.map((tool) => (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => toggleTool(tool.name)}
                    className={`p-3 rounded-lg border-2 transition text-left ${
                      formData.tools.includes(tool.name)
                        ? 'border-transparent shadow-lg'
                        : darkMode
                          ? 'border-slate-600 hover:border-slate-500'
                          : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{
                      backgroundColor: formData.tools.includes(tool.name) ? tool.color : 'transparent',
                      color: formData.tools.includes(tool.name) ? '#ffffff' : darkMode ? '#e5e7eb' : '#374151'
                    }}
                  >
                    <div className="font-semibold text-sm md:text-base">{tool.name}</div>
                    {tool.description && (
                      <div className={`text-xs mt-1 ${formData.tools.includes(tool.name) ? 'text-white/80' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {tool.description}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className={`text-center p-6 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <p className={`text-sm md:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  No hay herramientas disponibles.
                </p>
                <p className={`text-xs md:text-sm mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  Usa el botón "Gestionar Herramientas" para agregar.
                </p>
              </div>
            )}
          </div>

          {/* Notas */}
          <div>
            <label className={`block text-xs md:text-sm font-medium mb-2 flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <FiFileText size={16} />
              Notas / Observaciones
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Ej: Respuesta positiva, mejoría en movilidad..."
              rows={4}
              className={`w-full px-4 py-3 rounded-lg border transition resize-none text-sm md:text-base ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          {/* Resumen */}
          {formData.tools.length > 0 && (
            <div className={`p-4 rounded-lg ${
              darkMode ? 'bg-blue-900/20 border border-blue-700' : 'bg-blue-50 border border-blue-200'
            }`}>
              <p className={`text-xs md:text-sm font-medium ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                ✓ {formData.tools.length} herramienta{formData.tools.length !== 1 ? 's' : ''} seleccionada{formData.tools.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className={`w-full sm:flex-1 py-3 rounded-lg font-medium transition text-sm md:text-base ${
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
              className={`w-full sm:flex-1 py-3 rounded-lg font-medium text-white transition flex items-center justify-center gap-2 text-sm md:text-base ${
                darkMode
                  ? 'bg-orange-600 hover:bg-orange-700'
                  : 'bg-orange-500 hover:bg-orange-600'
              }`}
            >
              <FiSave size={18} />
              {session ? 'Actualizar Sesión' : 'Guardar Sesión'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}