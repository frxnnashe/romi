// src/components/Calendar.jsx
import { useCalendar } from '../hooks/useCalendar';
import { formatMonth, isToday } from '../utils/dateUtils';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useEffect } from 'react';

const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export default function Calendar({ darkMode, appointmentsPerDay, birthdaysPerDay, onSelectDay, onMonthChange }) {
  const { currentDate, days, goToNextMonth, goToPreviousMonth, goToToday, getDateForDay } = useCalendar();

  useEffect(() => {
    if (onMonthChange) {
      onMonthChange(currentDate);
    }
  }, [currentDate]);

  return (
    <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {formatMonth(currentDate)}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={goToPreviousMonth}
            className={`p-2 rounded-lg transition ${
              darkMode ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            <FiChevronLeft size={20} />
          </button>
          <button
            onClick={goToToday}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              darkMode
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            Hoy
          </button>
          <button
            onClick={goToNextMonth}
            className={`p-2 rounded-lg transition ${
              darkMode ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            <FiChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Week Days */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className={`text-center font-semibold py-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const isCurrentDay = day && isToday(getDateForDay(day));
          const hasAppointments = day && (appointmentsPerDay[day]?.length || 0) > 0;
          const hasBirthdays = day && (birthdaysPerDay[day]?.length || 0) > 0;
          const appointmentCount = day ? (appointmentsPerDay[day]?.length || 0) : 0;
          const birthdayCount = day ? (birthdaysPerDay[day]?.length || 0) : 0;

          return (
            <div
              key={index}
              onClick={() => day && onSelectDay(getDateForDay(day))}
              className={`p-3 rounded-lg min-h-20 cursor-pointer transition relative ${
                !day
                  ? ''
                  : isCurrentDay
                    ? darkMode
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-500 text-white'
                    : darkMode
                      ? 'bg-slate-700 hover:bg-slate-600'
                      : 'bg-gray-100 hover:bg-gray-200'
              } ${hasAppointments ? (darkMode ? 'ring-2 ring-green-500' : 'ring-2 ring-green-400') : ''} ${hasBirthdays && !hasAppointments ? (darkMode ? 'ring-2 ring-pink-500' : 'ring-2 ring-pink-400') : ''}`}
            >
              <div className={`font-semibold text-sm ${isCurrentDay ? 'text-white' : darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {day}
              </div>
              
              {/* Indicador de turnos */}
              {hasAppointments && (
                <div className={`text-xs mt-1 ${isCurrentDay ? 'text-green-100' : darkMode ? 'text-green-400' : 'text-green-600'}`}>
                  📅 {appointmentCount} cita{appointmentCount > 1 ? 's' : ''}
                </div>
              )}
              
              {/* Indicador de cumpleaños */}
              {hasBirthdays && (
                <div className={`text-xs mt-1 ${isCurrentDay ? 'text-pink-100' : darkMode ? 'text-pink-400' : 'text-pink-600'}`}>
                  🎂 {birthdayCount} cumple{birthdayCount > 1 ? 's' : ''}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Leyenda */}
      <div className="mt-4 flex flex-wrap gap-3 text-xs">
        <div className="flex items-center gap-1">
          <div className={`w-3 h-3 rounded ${darkMode ? 'bg-green-500' : 'bg-green-400'}`}></div>
          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Turnos</span>
        </div>
        <div className="flex items-center gap-1">
          <div className={`w-3 h-3 rounded ${darkMode ? 'bg-pink-500' : 'bg-pink-400'}`}></div>
          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Cumpleaños</span>
        </div>
        <div className="flex items-center gap-1">
          <div className={`w-3 h-3 rounded ${darkMode ? 'bg-blue-600' : 'bg-blue-500'}`}></div>
          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Hoy</span>
        </div>
      </div>
    </div>
  );
}