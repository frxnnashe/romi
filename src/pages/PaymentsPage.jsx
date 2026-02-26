// src/pages/PaymentsPage.jsx
import { useState, useEffect } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { formatDate } from '../utils/dateUtils';
import { FiFilter, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import TurnoModal from '../components/TurnoModal';
import { usePatients } from '../hooks/usePatients';

// Función helper para comparar fechas como strings
const compareDateStrings = (dateStr1, dateStr2) => {
  const d1 = dateStr1.substring(0, 10); // YYYY-MM-DD
  const d2 = dateStr2.substring(0, 10);
  return d2.localeCompare(d1); // orden descendente
};

export default function PaymentsPage({ darkMode }) {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [filterStatus, setFilterStatus] = useState('todos');
  const [filterPaymentMethod, setFilterPaymentMethod] = useState('todos');
  const [filterPatient, setFilterPatient] = useState('todos');
  const [patientSearch, setPatientSearch] = useState('');
  const [filterMonth, setFilterMonth] = useState(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  });
  const [showModal, setShowModal] = useState(false);
  const [editingTurno, setEditingTurno] = useState(null);

  const { getDocuments, updateDocument, deleteDocument } = useFirestore('appointments');
  const { patients } = usePatients();

  useEffect(() => {
    loadAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [appointments, filterStatus, filterMonth, filterPaymentMethod, filterPatient, patientSearch]);

  const loadAppointments = async () => {
    const data = await getDocuments();
    // Ordenar por fecha (string) en orden descendente
    const sorted = data.sort((a, b) => compareDateStrings(a.date, b.date));
    setAppointments(sorted);
  };

  const filterAppointments = () => {
    let filtered = appointments;

    if (filterMonth) {
      filtered = filtered.filter((apt) => apt.date.startsWith(filterMonth));
    }

    if (filterStatus !== 'todos') {
      if (filterStatus === 'particulares') {
        // Filtrar solo pacientes particulares (que tienen 'particular', 'part', etc. en obra social)
        filtered = filtered.filter((apt) => {
          if (!apt.insurance) return false;
          const insuranceLower = apt.insurance.toLowerCase();
          return insuranceLower.includes('part');
        });
      } else {
        const isPaid = filterStatus === 'pagados';
        filtered = filtered.filter((apt) => apt.paid === isPaid);
      }
    }

    if (filterPaymentMethod !== 'todos') {
      filtered = filtered.filter((apt) => apt.paymentMethod === filterPaymentMethod);
    }

    if (filterPatient !== 'todos') {
      filtered = filtered.filter((apt) => apt.patientId === filterPatient);
    }

    // Filtro por búsqueda de nombre
    if (patientSearch.trim()) {
      filtered = filtered.filter((apt) => 
        apt.patientName.toLowerCase().includes(patientSearch.toLowerCase())
      );
    }

    setFilteredAppointments(filtered);
  };

  const handleSave = async (turnoData) => {
    try {
      if (editingTurno) {
        await updateDocument(editingTurno.id, turnoData);
      }
      await loadAppointments();
      setShowModal(false);
      setEditingTurno(null);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('¿Eliminar este turno?')) {
      try {
        await deleteDocument(id);
        await loadAppointments();
      } catch (err) {
        console.error('Error:', err);
      }
    }
  };

  const stats = {
    total: filteredAppointments.reduce((sum, a) => sum + (Number(a.amount) || 0), 0),
    paid: filteredAppointments
      .filter((a) => a.paid)
      .reduce((sum, a) => sum + (Number(a.amount) || 0), 0),
    pending: filteredAppointments
      .filter((a) => !a.paid)
      .reduce((sum, a) => sum + (Number(a.amount) || 0), 0),
    efectivo: filteredAppointments
      .filter((a) => a.paid && a.paymentMethod === 'efectivo')
      .reduce((sum, a) => sum + (Number(a.amount) || 0), 0),
    transferencia: filteredAppointments
      .filter((a) => a.paid && a.paymentMethod === 'transferencia')
      .reduce((sum, a) => sum + (Number(a.amount) || 0), 0),
  };

  return (
    <div className="space-y-6">
      {/* Tarjetas de Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div
          className={`p-6 rounded-lg shadow-lg ${
            darkMode ? 'bg-slate-800' : 'bg-white'
          }`}
        >
          <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Total Facturado
          </p>
          <p className={`text-3xl font-bold mt-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            ${stats.total.toFixed(2)}
          </p>
        </div>

        <div
          className={`p-6 rounded-lg shadow-lg ${
            darkMode ? 'bg-slate-800' : 'bg-white'
          }`}
        >
          <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Cobrado
          </p>
          <p className={`text-3xl font-bold mt-2 text-green-500`}>
            ${stats.paid.toFixed(2)}
          </p>
        </div>

        <div
          className={`p-6 rounded-lg shadow-lg ${
            darkMode ? 'bg-slate-800' : 'bg-white'
          }`}
        >
          <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Pendiente
          </p>
          <p className={`text-3xl font-bold mt-2 text-yellow-500`}>
            ${stats.pending.toFixed(2)}
          </p>
        </div>

        <div
          className={`p-6 rounded-lg shadow-lg ${
            darkMode ? 'bg-slate-800' : 'bg-white'
          }`}
        >
          <p className={`text-sm font-medium flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            💵 Efectivo
          </p>
          <p className={`text-3xl font-bold mt-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
            ${stats.efectivo.toFixed(2)}
          </p>
        </div>

        <div
          className={`p-6 rounded-lg shadow-lg ${
            darkMode ? 'bg-slate-800' : 'bg-white'
          }`}
        >
          <p className={`text-sm font-medium flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            🏦 Transferencia
          </p>
          <p className={`text-3xl font-bold mt-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            ${stats.transferencia.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div
        className={`p-4 rounded-lg shadow-lg ${
          darkMode ? 'bg-slate-800' : 'bg-white'
        }`}
      >
        <div className="flex items-center gap-2 mb-4">
          <FiFilter size={20} className={darkMode ? 'text-white' : 'text-gray-900'} />
          <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Filtros
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Estado
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border transition ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="todos">Todos</option>
              <option value="pagados">Pagados</option>
              <option value="pendientes">Pendientes</option>
              <option value="particulares">👤 Particulares</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Método de Pago
            </label>
            <select
              value={filterPaymentMethod}
              onChange={(e) => setFilterPaymentMethod(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border transition ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="todos">Todos</option>
              <option value="efectivo">💵 Efectivo</option>
              <option value="transferencia">🏦 Transferencia</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Buscar Paciente
            </label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-gray-400" size={16} />
              <input
                type="text"
                value={patientSearch}
                onChange={(e) => {
                  setPatientSearch(e.target.value);
                  setFilterPatient('todos'); // Resetear filtro de select al buscar
                }}
                placeholder="Buscar por nombre..."
                className={`w-full pl-10 pr-4 py-2 rounded-lg border transition ${
                  darkMode
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Mes
            </label>
            <input
              type="month"
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border transition ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Lista de Turnos */}
      <div
        className={`p-6 rounded-lg shadow-lg ${
          darkMode ? 'bg-slate-800' : 'bg-white'
        }`}
      >
        <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Movimientos de Pago
        </h2>

        <div className="space-y-2">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((apt) => {
              // Crear fecha desde el string sin conversión de zona horaria
              const [year, month, day] = apt.date.substring(0, 10).split('-').map(Number);
              const appointmentDate = new Date(year, month - 1, day);
              
              return (
                <div
                  key={apt.id}
                  className={`p-4 rounded-lg border flex justify-between items-center transition ${
                    darkMode
                      ? 'bg-slate-700 border-slate-600 hover:bg-slate-600'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className={`text-2xl`}>{apt.paid ? '💰' : '⚠️'}</span>
                      <div>
                        <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {apt.patientName}
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {formatDate(appointmentDate)} - {apt.time}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          {apt.insurance && (
                            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              🏥 {apt.insurance}
                            </span>
                          )}
                          {apt.paymentMethod && (
                            <span className={`text-sm font-medium ${
                              apt.paymentMethod === 'efectivo' 
                                ? 'text-green-500' 
                                : 'text-blue-500'
                            }`}>
                              {apt.paymentMethod === 'efectivo' ? '💵 Efectivo' : '🏦 Transferencia'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-lg">${(Number(apt.amount) || 0).toFixed(2)}</p>
                      <p
                        className={`text-sm font-medium ${
                          apt.paid ? 'text-green-500' : 'text-yellow-500'
                        }`}
                      >
                        {apt.paid ? '✓ Pagado' : '✗ Pendiente'}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingTurno(apt);
                          setShowModal(true);
                        }}
                        className={`p-2 rounded transition ${
                          darkMode
                            ? 'bg-slate-600 hover:bg-slate-500 text-white'
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                        title="Editar turno"
                      >
                        <FiEdit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(apt.id)}
                        className={`p-2 rounded transition ${
                          darkMode
                            ? 'bg-red-600/20 hover:bg-red-600/30 text-red-400'
                            : 'bg-red-100 hover:bg-red-200 text-red-600'
                        }`}
                        title="Eliminar turno"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div
              className={`text-center py-12 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              No hay turnos para mostrar
            </div>
          )}
        </div>
      </div>

      <TurnoModal
        darkMode={darkMode}
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingTurno(null);
        }}
        onSave={handleSave}
        turno={editingTurno}
        patients={patients}
      />
    </div>
  );
}