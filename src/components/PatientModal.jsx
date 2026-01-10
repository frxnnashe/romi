import { useState, useEffect } from 'react';
import { FiX, FiUser, FiCreditCard, FiPhone, FiFileText, FiCalendar, FiBriefcase } from 'react-icons/fi';

export default function PatientModal({ darkMode, isOpen, onClose, onSave, patient }) {
  const [formData, setFormData] = useState({
    name: '',
    dni: '',
    phone: '',
    insurance: '',
    notes: '',
    birthDate: '',
    occupation: '',
  });

  const [calculatedAge, setCalculatedAge] = useState(null);

  useEffect(() => {
    if (patient) {
      setFormData(patient);
      if (patient.birthDate) {
        calculateAge(patient.birthDate);
      }
    } else {
      setFormData({
        name: '',
        dni: '',
        phone: '',
        insurance: '',
        notes: '',
        birthDate: '',
        occupation: '',
      });
      setCalculatedAge(null);
    }
  }, [patient, isOpen]);

  const calculateAge = (birthDate) => {
    if (!birthDate) {
      setCalculatedAge(null);
      return;
    }

    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    setCalculatedAge(age);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Calcular edad automáticamente cuando cambia la fecha de nacimiento
    if (name === 'birthDate') {
      calculateAge(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.dni) {
      alert('Por favor completa al menos el nombre y DNI');
      return;
    }
    
    // Incluir la edad calculada al guardar
    const dataToSave = {
      ...formData,
      age: calculatedAge,
    };
    
    onSave(dataToSave);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto`}>
        <div className={`flex justify-between items-center p-6 border-b ${darkMode ? 'border-slate-700' : 'border-gray-200'} sticky top-0 bg-inherit z-10`}>
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {patient ? 'Editar Paciente' : 'Nuevo Paciente'}
          </h2>
          <button onClick={onClose} className={`hover:opacity-70 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <FiX size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Nombre */}
          <div>
            <label className={`block text-sm font-medium mb-2 flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <FiUser size={16} />
              Nombre Completo *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej: Juan Pérez"
              className={`w-full px-3 py-2 rounded-lg border transition ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              required
            />
          </div>

          {/* DNI */}
          <div>
            <label className={`block text-sm font-medium mb-2 flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <FiCreditCard size={16} />
              DNI *
            </label>
            <input
              type="text"
              name="dni"
              value={formData.dni}
              onChange={handleChange}
              placeholder="Ej: 12345678"
              className={`w-full px-3 py-2 rounded-lg border transition ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              required
            />
          </div>

          {/* Fecha de Nacimiento y Edad */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block text-sm font-medium mb-2 flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <FiCalendar size={16} />
                Fecha de Nacimiento
              </label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-lg border transition ${
                  darkMode
                    ? 'bg-slate-700 border-slate-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Edad
              </label>
              <div className={`px-3 py-2 rounded-lg border flex items-center ${
                darkMode
                  ? 'bg-slate-600 border-slate-500 text-gray-300'
                  : 'bg-gray-100 border-gray-300 text-gray-700'
              }`}>
                {calculatedAge !== null ? (
                  <span className="font-semibold">{calculatedAge} años</span>
                ) : (
                  <span className="text-gray-500 text-sm">No calculada</span>
                )}
              </div>
            </div>
          </div>

          {/* Ocupación */}
          <div>
            <label className={`block text-sm font-medium mb-2 flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <FiBriefcase size={16} />
              Ocupación
            </label>
            <input
              type="text"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              placeholder="Ej: Docente, Ingeniero, Estudiante..."
              className={`w-full px-3 py-2 rounded-lg border transition ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          {/* Teléfono */}
          <div>
            <label className={`block text-sm font-medium mb-2 flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <FiPhone size={16} />
              Teléfono (WhatsApp)
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Ej: 351-1234567 o 3511234567"
              className={`w-full px-3 py-2 rounded-lg border transition ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
            <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              📱 Incluir código de área (Ej: 351 para Córdoba)
            </p>
          </div>

          {/* Obra Social */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Obra Social
            </label>
            <input
              type="text"
              name="insurance"
              value={formData.insurance}
              onChange={handleChange}
              placeholder="Ej: OSDE, APROSS, Particular..."
              className={`w-full px-3 py-2 rounded-lg border transition ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          {/* Notas */}
          <div>
            <label className={`block text-sm font-medium mb-2 flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <FiFileText size={16} />
              Notas / Observaciones
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Ej: Alergias, condiciones especiales..."
              rows={3}
              className={`w-full px-3 py-2 rounded-lg border transition resize-none ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
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
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className={`flex-1 py-2 rounded-lg font-medium text-white transition ${
                darkMode
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {patient ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}