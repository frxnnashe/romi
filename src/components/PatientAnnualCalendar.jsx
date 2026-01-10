import { useState, useEffect } from 'react';
import { FiX, FiSave, FiPlus, FiTrash2 } from 'react-icons/fi';

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const STATUS_OPTIONS = ['S', 'D', '//', 'F'];

const STATUS_COLORS = {
  'S': 'bg-green-500 text-white',
  'D': 'bg-red-500 text-white',
  '//': 'bg-yellow-500 text-white',
  'F': 'bg-gray-500 text-white',
};

export default function PatientAnnualCalendar({ 
  darkMode, 
  isOpen, 
  onClose, 
  patient,
  onSave
}) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [monthlyData, setMonthlyData] = useState({});

  useEffect(() => {
    if (isOpen && patient?.annualCalendar) {
      const yearData = patient.annualCalendar[selectedYear] || {};
      setMonthlyData(yearData);
    } else if (isOpen) {
      // Inicializar estructura vacía
      const initialData = {};
      for (let month = 0; month < 12; month++) {
        initialData[month] = [
          { date: '', status: '' },
          { date: '', status: '' },
          { date: '', status: '' },
          { date: '', status: '' },
        ];
      }
      setMonthlyData(initialData);
    }
  }, [isOpen, patient, selectedYear]);

  const handleDateChange = (monthIndex, slotIndex, value) => {
    setMonthlyData(prev => ({
      ...prev,
      [monthIndex]: prev[monthIndex].map((slot, idx) => 
        idx === slotIndex ? { ...slot, date: value } : slot
      )
    }));
  };

  const handleStatusChange = (monthIndex, slotIndex, status) => {
    setMonthlyData(prev => ({
      ...prev,
      [monthIndex]: prev[monthIndex].map((slot, idx) => 
        idx === slotIndex ? { ...slot, status } : slot
      )
    }));
  };

  const handleAddSlot = (monthIndex) => {
    setMonthlyData(prev => ({
      ...prev,
      [monthIndex]: [...prev[monthIndex], { date: '', status: '' }]
    }));
  };

  const handleRemoveSlot = (monthIndex, slotIndex) => {
    setMonthlyData(prev => ({
      ...prev,
      [monthIndex]: prev[monthIndex].filter((_, idx) => idx !== slotIndex)
    }));
  };

  const handleSave = () => {
    const calendarData = {
      ...patient.annualCalendar,
      [selectedYear]: monthlyData
    };
    onSave(patient.id, calendarData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto`}>
        {/* Header */}
        <div className={`flex justify-between items-center p-6 border-b ${darkMode ? 'border-slate-700' : 'border-gray-200'} sticky top-0 bg-inherit z-10`}>
          <div>
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              📅 Calendario Anual - {patient?.name}
            </h2>
            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Registro de asistencias {selectedYear}
            </p>
          </div>
          <button onClick={onClose} className={`hover:opacity-70 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <FiX size={24} />
          </button>
        </div>

        {/* Selector de año */}
        <div className={`p-4 border-b ${darkMode ? 'border-slate-700' : 'border-gray-200'} flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedYear(selectedYear - 1)}
              className={`px-3 py-1 rounded-lg transition ${
                darkMode ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              ← {selectedYear - 1}
            </button>
            <span className={`text-xl font-bold px-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {selectedYear}
            </span>
            <button
              onClick={() => setSelectedYear(selectedYear + 1)}
              className={`px-3 py-1 rounded-lg transition ${
                darkMode ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {selectedYear + 1} →
            </button>
          </div>
        </div>

        {/* Tabla de meses */}
        <div className="p-6">
          <div className="space-y-3">
            {MONTHS.map((monthName, monthIndex) => (
              <div 
                key={monthIndex}
                className={`p-4 rounded-lg border ${
                  darkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Nombre del mes */}
                  <div className="w-24 pt-2">
                    <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {monthName}
                    </span>
                  </div>

                  {/* Casillas de fechas */}
                  <div className="flex-1 space-y-2">
                    {monthlyData[monthIndex]?.map((slot, slotIndex) => (
                      <div key={slotIndex} className="flex items-center gap-2">
                        {/* Input de fecha */}
                        <input
                          type="number"
                          min="1"
                          max="31"
                          placeholder="Día"
                          value={slot.date}
                          onChange={(e) => handleDateChange(monthIndex, slotIndex, e.target.value)}
                          className={`w-16 px-2 py-1 text-center rounded border text-sm ${
                            darkMode
                              ? 'bg-slate-600 border-slate-500 text-white placeholder-gray-400'
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        />

                        {/* Botones de estado */}
                        <div className="flex gap-1">
                          {STATUS_OPTIONS.map((status) => (
                            <button
                              key={status}
                              onClick={() => handleStatusChange(monthIndex, slotIndex, status)}
                              className={`w-8 h-8 rounded text-xs font-bold transition ${
                                slot.status === status
                                  ? STATUS_COLORS[status]
                                  : darkMode
                                    ? 'bg-slate-600 hover:bg-slate-500 text-gray-400'
                                    : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                              }`}
                            >
                              {status}
                            </button>
                          ))}
                        </div>

                        {/* Botón eliminar */}
                        {monthlyData[monthIndex].length > 4 && (
                          <button
                            onClick={() => handleRemoveSlot(monthIndex, slotIndex)}
                            className={`p-1 rounded transition ${
                              darkMode
                                ? 'hover:bg-red-600/20 text-red-400'
                                : 'hover:bg-red-100 text-red-600'
                            }`}
                          >
                            <FiTrash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))}

                    {/* Botón agregar más fechas */}
                    <button
                      onClick={() => handleAddSlot(monthIndex)}
                      className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition ${
                        darkMode
                          ? 'bg-slate-600 hover:bg-slate-500 text-gray-300'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      }`}
                    >
                      <FiPlus size={12} />
                      Agregar fecha
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer con botones */}
        <div className={`flex gap-3 p-6 border-t ${darkMode ? 'border-slate-700' : 'border-gray-200'} sticky bottom-0 bg-inherit`}>
          <button
            onClick={onClose}
            className={`flex-1 py-3 rounded-lg font-medium transition ${
              darkMode
                ? 'bg-slate-700 hover:bg-slate-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className={`flex-1 py-3 rounded-lg font-medium text-white transition flex items-center justify-center gap-2 ${
              darkMode
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            <FiSave size={18} />
            Guardar Calendario
          </button>
        </div>
      </div>
    </div>
  );
}