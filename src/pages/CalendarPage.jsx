// src/pages/CalendarPage.jsx
import { useState, useEffect } from "react";
import Calendar from "../components/Calendar";
import TurnoModal from "../components/TurnoModal";
import RecurringPatientModal from "../components/RecurringPatientModal";
import { useFirestore } from "../hooks/useFirestore";
import { usePatients } from "../hooks/usePatients";
import {
  FiTrash2,
  FiEdit2,
  FiRepeat,
  FiMessageCircle,
  FiGift,
} from "react-icons/fi";
import { formatDate } from "../utils/dateUtils";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../firebase/config";

export default function CalendarPage({ darkMode }) {
  const [selectedDay, setSelectedDay] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [appointmentsPerDay, setAppointmentsPerDay] = useState({});
  const [birthdaysPerDay, setBirthdaysPerDay] = useState({});
  const [pendientesPerDay, setPendientesPerDay] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showRecurringModal, setShowRecurringModal] = useState(false);
  const [editingTurno, setEditingTurno] = useState(null);
  const [dayAppointments, setDayAppointments] = useState([]);
  const [dayBirthdays, setDayBirthdays] = useState([]);
  const [dayPendientes, setDayPendientes] = useState([]);

  const { addDocument, updateDocument, deleteDocument, getDocuments } =
    useFirestore("appointments");
  const { patients } = usePatients();

  const fetchAndLoadPendientes = async (date) => {
    try {
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      const q = query(collection(db, "pendientes"));
      const snapshot = await getDocs(q);
      const allPendientes = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log("TOTAL PENDIENTES:", allPendientes.length);
      console.log("PRIMER PENDIENTE:", JSON.stringify(allPendientes[0]));

      const highPriority = allPendientes.filter(
        (p) => p.priority === "alta" && !p.completed && p.dueDate
      );

      console.log("HIGH PRIORITY COUNT:", highPriority.length);

      const pendientesByDay = {};

      highPriority.forEach((pendiente) => {
        let pendDay, pendMonth, pendYear;

        try {
          if (pendiente.dueDate.includes("/")) {
            [pendDay, pendMonth, pendYear] = pendiente.dueDate
              .split("/")
              .map(Number);
          } else if (pendiente.dueDate.includes("-")) {
            [pendYear, pendMonth, pendDay] = pendiente.dueDate
              .split("-")
              .map(Number);
          } else {
            return;
          }
        } catch (e) {
          return;
        }

        console.log(`Pendiente: día=${pendDay} mes=${pendMonth} año=${pendYear} | mes actual=${month} año actual=${year}`);

        if (pendYear === year && pendMonth === month) {
          if (!pendientesByDay[pendDay]) {
            pendientesByDay[pendDay] = [];
          }
          pendientesByDay[pendDay].push(pendiente);
        }
      });

      console.log("PENDIENTES POR DÍA:", JSON.stringify(pendientesByDay));
      setPendientesPerDay(pendientesByDay);
    } catch (err) {
      console.error("Error cargando pendientes:", err);
    }
  };

  useEffect(() => {
    loadAppointmentsForMonth(currentMonth);
    loadBirthdaysForMonth(currentMonth);
    fetchAndLoadPendientes(currentMonth);
  }, [currentMonth, patients]);

  const loadAppointmentsForMonth = async (date) => {
    const data = await getDocuments();

    const filteredData = data.filter((apt) => {
      const aptDateStr = apt.date.substring(0, 10);
      const [aptYear, aptMonth] = aptDateStr.split("-").map(Number);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return aptYear === year && aptMonth === month;
    });

    setAppointments(filteredData);
    groupByDay(filteredData);
  };

  const loadBirthdaysForMonth = (date) => {
    const month = date.getMonth() + 1;
    const birthdaysByDay = {};

    patients.forEach((patient) => {
      if (patient.birthDate) {
        const [, birthMonth, birthDay] = patient.birthDate
          .split("-")
          .map(Number);
        if (birthMonth === month) {
          if (!birthdaysByDay[birthDay]) birthdaysByDay[birthDay] = [];
          birthdaysByDay[birthDay].push({
            name: patient.name,
            age: calculateAge(patient.birthDate, date.getFullYear()),
            phone: patient.phone,
            patientId: patient.id,
          });
        }
      }
    });

    setBirthdaysPerDay(birthdaysByDay);
  };

  const calculateAge = (birthDate, currentYear) => {
    const [birthYear] = birthDate.split("-").map(Number);
    return currentYear - birthYear;
  };

  const groupByDay = (data) => {
    const grouped = {};
    data.forEach((apt) => {
      const aptDateStr = apt.date.substring(0, 10);
      const [, , dayStr] = aptDateStr.split("-");
      const day = parseInt(dayStr, 10);
      if (!grouped[day]) grouped[day] = [];
      grouped[day].push(apt);
    });
    setAppointmentsPerDay(grouped);
  };

  const sortAppointmentsByTime = (appointments) => {
    return [...appointments].sort((a, b) => {
      const [hoursA, minutesA] = a.time.split(":").map(Number);
      const [hoursB, minutesB] = b.time.split(":").map(Number);
      return hoursA * 60 + minutesA - (hoursB * 60 + minutesB);
    });
  };

  const handleSelectDay = (date) => {
    setSelectedDay(date);
    const day = date.getDate();
    const unsortedAppointments = appointmentsPerDay[day] || [];
    setDayAppointments(sortAppointmentsByTime(unsortedAppointments));
    setDayBirthdays(birthdaysPerDay[day] || []);
    setDayPendientes(pendientesPerDay[day] || []);
    setEditingTurno(null);
  };

  const handleSaveTurno = async (turnoData) => {
    try {
      if (editingTurno) {
        await updateDocument(editingTurno.id, turnoData);
      } else {
        await addDocument(turnoData);
      }
      await loadAppointmentsForMonth(currentMonth);
      setShowModal(false);
      setEditingTurno(null);
    } catch (err) {
      console.error("Error guardando turno:", err);
    }
  };

  const handleSaveRecurringAppointments = async (appointmentsArray) => {
    try {
      const promises = appointmentsArray.map((apt) => addDocument(apt));
      await Promise.all(promises);
      await loadAppointmentsForMonth(currentMonth);
      setShowRecurringModal(false);
    } catch (err) {
      console.error("Error guardando turnos recurrentes:", err);
      alert("Hubo un error al generar los turnos. Por favor intenta de nuevo.");
    }
  };

  const handleDeleteTurno = async (id) => {
    if (confirm("¿Eliminar este turno?")) {
      try {
        await deleteDocument(id);
        await loadAppointmentsForMonth(currentMonth);
      } catch (err) {
        console.error("Error eliminando turno:", err);
      }
    }
  };

  const handleOpenModal = (turno = null) => {
    setEditingTurno(turno);
    setShowModal(true);
  };

  const handleOpenRecurringModal = () => {
    setShowRecurringModal(true);
  };

  const handleSendWhatsApp = (appointment) => {
    const patient = patients.find((p) => p.id === appointment.patientId);

    if (!patient || !patient.phone) {
      alert("El paciente no tiene un número de teléfono registrado.");
      return;
    }

    const cleanPhone = patient.phone.replace(/\D/g, "");
    const phoneWithCountry = cleanPhone.startsWith("54")
      ? cleanPhone
      : `54${cleanPhone}`;

    const [year, month, day] = appointment.date
      .substring(0, 10)
      .split("-")
      .map(Number);
    const appointmentDate = new Date(year, month - 1, day);

    const dateStr = appointmentDate.toLocaleDateString("es-AR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const message =
      `Hola ${patient.name}! \n\n` +
      `Te recuerdo tu turno de Psicología:\n\n` +
      `📅 Fecha: ${dateStr}\n` +
      `🕐 Hora: ${appointment.time}\n\n` +
      `¡Te espero!\n\n` +
      `Saludos`;

    const encodedMessage = encodeURIComponent(message);
    window.open(
      `https://wa.me/${phoneWithCountry}?text=${encodedMessage}`,
      "_blank"
    );
  };

  const handleSendBirthdayWhatsApp = (birthday) => {
    if (!birthday.phone) {
      alert("Este paciente no tiene un número de teléfono registrado.");
      return;
    }

    const cleanPhone = birthday.phone.replace(/\D/g, "");
    const phoneWithCountry = cleanPhone.startsWith("54")
      ? cleanPhone
      : `54${cleanPhone}`;

    const message =
      `¡Feliz cumpleaños ${birthday.name}! 🎉🎂\n\n` +
      `Te deseamos un día maravilloso lleno de alegría y felicidad.\n\n` +
      `¡Que cumplas muchos más! 🎈\n\n` +
      `Saludos cariñosos 💙`;

    const encodedMessage = encodeURIComponent(message);
    window.open(
      `https://wa.me/${phoneWithCountry}?text=${encodedMessage}`,
      "_blank"
    );
  };

  const handleMonthChange = (newDate) => {
    setCurrentMonth(newDate);
    setSelectedDay(null);
    setDayAppointments([]);
    setDayBirthdays([]);
    setDayPendientes([]);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Calendar
            darkMode={darkMode}
            appointmentsPerDay={appointmentsPerDay}
            birthdaysPerDay={birthdaysPerDay}
            pendientesPerDay={pendientesPerDay}
            onSelectDay={handleSelectDay}
            onMonthChange={handleMonthChange}
          />
        </div>

        <div
          className={`${darkMode ? "bg-slate-800" : "bg-white"} rounded-lg shadow-lg p-6 h-fit`}
        >
          <h3
            className={`text-xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}
          >
            {selectedDay ? formatDate(selectedDay) : "Selecciona un día"}
          </h3>

          <div className="space-y-2 mb-4">
            {selectedDay && (
              <button
                onClick={() => handleOpenModal()}
                className={`w-full py-2 rounded-lg font-medium text-white transition ${
                  darkMode
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                + Nuevo Turno
              </button>
            )}

            <button
              onClick={handleOpenRecurringModal}
              className={`w-full py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                darkMode
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-purple-500 hover:bg-purple-600 text-white"
              }`}
            >
              <FiRepeat size={18} />
              Paciente Recurrente
            </button>
          </div>

          {dayBirthdays.length > 0 && (
            <div className="mb-4">
              <h4
                className={`text-sm font-semibold mb-2 flex items-center gap-2 ${darkMode ? "text-pink-400" : "text-pink-600"}`}
              >
                <FiGift size={16} />
                🎉 Cumpleaños del día
              </h4>
              <div className="space-y-2">
                {dayBirthdays.map((birthday, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border-2 ${
                      darkMode
                        ? "bg-pink-900/20 border-pink-700"
                        : "bg-pink-50 border-pink-200"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p
                          className={`font-semibold ${darkMode ? "text-pink-300" : "text-pink-900"}`}
                        >
                          🎂 {birthday.name}
                        </p>
                        <p
                          className={`text-sm ${darkMode ? "text-pink-400" : "text-pink-700"}`}
                        >
                          Cumple {birthday.age} años
                        </p>
                      </div>
                      {birthday.phone && (
                        <button
                          onClick={() => handleSendBirthdayWhatsApp(birthday)}
                          className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 text-xs font-medium ${
                            darkMode
                              ? "bg-pink-600 hover:bg-pink-700 text-white"
                              : "bg-pink-500 hover:bg-pink-600 text-white"
                          }`}
                        >
                          <FiMessageCircle size={12} />
                          Felicitar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {dayPendientes.length > 0 && (
            <div className="mb-4">
              <h4
                className={`text-sm font-semibold mb-2 flex items-center gap-2 ${darkMode ? "text-red-400" : "text-red-600"}`}
              >
                ⚠️ Pendientes urgentes del día
              </h4>
              <div className="space-y-2">
                {dayPendientes.map((p, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border-2 ${
                      darkMode
                        ? "bg-red-900/20 border-red-700"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <p
                      className={`font-semibold text-sm ${darkMode ? "text-red-300" : "text-red-900"}`}
                    >
                      {p.title || p.description || "Pendiente sin título"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {dayAppointments.length > 0 && (
              <h4
                className={`text-sm font-semibold mb-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                Turnos del día ({dayAppointments.length})
              </h4>
            )}
            {dayAppointments.length > 0 ? (
              dayAppointments.map((apt) => {
                const patient = patients.find((p) => p.id === apt.patientId);
                const hasPhone = patient && patient.phone;

                return (
                  <div
                    key={apt.id}
                    className={`p-3 rounded-lg border transition ${
                      darkMode
                        ? "bg-slate-700 border-slate-600 hover:bg-slate-600"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p
                            className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
                          >
                            🕐 {apt.time}
                          </p>
                          {apt.recurring && (
                            <span className="text-xs bg-purple-500 text-white px-2 py-0.5 rounded-full">
                              <FiRepeat className="inline" size={10} /> Fijo
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                        >
                          {apt.patientName}
                        </p>
                        <p
                          className={`text-sm font-medium ${apt.paid ? "text-green-500" : "text-yellow-500"}`}
                        >
                          {apt.paid ? "💰 Pagado" : "⚠️ Pendiente"}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <p className="font-bold text-lg">
                          ${(Number(apt.amount) || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-1 mt-2">
                      {hasPhone && (
                        <button
                          onClick={() => handleSendWhatsApp(apt)}
                          className={`flex-1 px-2 py-1.5 rounded transition flex items-center justify-center gap-1 text-sm font-medium ${
                            darkMode
                              ? "bg-green-600 hover:bg-green-700 text-white"
                              : "bg-green-500 hover:bg-green-600 text-white"
                          }`}
                        >
                          <FiMessageCircle size={14} />
                          WhatsApp
                        </button>
                      )}
                      <button
                        onClick={() => handleOpenModal(apt)}
                        className={`px-2 py-1.5 rounded transition ${
                          darkMode
                            ? "bg-slate-600 hover:bg-slate-500 text-white"
                            : "bg-gray-200 hover:bg-gray-300"
                        }`}
                      >
                        <FiEdit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteTurno(apt.id)}
                        className={`px-2 py-1.5 rounded transition ${
                          darkMode
                            ? "bg-red-600/20 hover:bg-red-600/30 text-red-400"
                            : "bg-red-100 hover:bg-red-200 text-red-600"
                        }`}
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>

                    {!hasPhone && (
                      <div
                        className={`mt-2 text-xs p-2 rounded ${
                          darkMode
                            ? "bg-yellow-900/20 text-yellow-400"
                            : "bg-yellow-50 text-yellow-700"
                        }`}
                      >
                        ⚠️ Sin teléfono registrado
                      </div>
                    )}
                  </div>
                );
              })
            ) : selectedDay &&
              dayBirthdays.length === 0 &&
              dayPendientes.length === 0 ? (
              <p
                className={`text-center py-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                Sin turnos este día
              </p>
            ) : (
              !selectedDay && (
                <p
                  className={`text-center py-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Selecciona un día para ver los turnos
                </p>
              )
            )}
          </div>
        </div>
      </div>

      <TurnoModal
        darkMode={darkMode}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveTurno}
        turno={editingTurno}
        patients={patients}
        selectedDate={selectedDay}
      />

      <RecurringPatientModal
        darkMode={darkMode}
        isOpen={showRecurringModal}
        onClose={() => setShowRecurringModal(false)}
        onSave={handleSaveRecurringAppointments}
        patients={patients}
        currentMonth={currentMonth}
      />
    </div>
  );
}