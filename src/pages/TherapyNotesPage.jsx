import { useState } from 'react';
import { FiFileText, FiSearch, FiPlus, FiEdit2, FiTrash2, FiMic } from 'react-icons/fi';
import TherapyNoteModal from '../components/TherapyNoteModal';
import { usePatients } from '../hooks/usePatients';
import { useTherapyNotes } from '../hooks/useTherapyNotes';
import toast from 'react-hot-toast';

export default function TherapyNotesPage({ darkMode }) {
  const { patients } = usePatients();
  const { therapyNotes, saveTherapyNote, deleteTherapyNote } = useTherapyNotes();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [filterPatientId, setFilterPatientId] = useState('all');

  const filteredNotes = therapyNotes.filter(note => {
    const matchesSearch = note.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPatient = filterPatientId === 'all' || note.patientId === filterPatientId;
    return matchesSearch && matchesPatient;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleCreateNote = (patient = null) => {
    setSelectedPatient(patient);
    setSelectedNote(null);
    setIsNoteModalOpen(true);
  };

  const handleEditNote = (note) => {
    const patient = patients.find(p => p.id === note.patientId);
    setSelectedPatient(patient);
    setSelectedNote(note);
    setIsNoteModalOpen(true);
  };

  const handleSaveNote = async (noteData) => {
    try {
      await saveTherapyNote(noteData);
      toast.success(selectedNote ? 'Nota actualizada' : 'Nota guardada');
      setIsNoteModalOpen(false);
      setSelectedPatient(null);
      setSelectedNote(null);
    } catch (error) {
      toast.error('Error al guardar nota');
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (window.confirm('¿Estás seguro de eliminar esta nota de terapia?')) {
      try {
        await deleteTherapyNote(noteId);
        toast.success('Nota eliminada');
      } catch (error) {
        toast.error('Error al eliminar nota');
      }
    }
  };

  const groupedByPatient = patients.map(patient => {
    const patientNotes = therapyNotes.filter(note => note.patientId === patient.id);
    return {
      ...patient,
      notesCount: patientNotes.length,
      lastNote: patientNotes.sort((a, b) => new Date(b.date) - new Date(a.date))[0]
    };
  }).filter(p => p.notesCount > 0);

  return (
    <div className="space-y-6">
      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-3`}>
              <FiFileText className="text-blue-500" size={32} />
              Notas de Terapia
            </h1>
            <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Registro de evolución y observaciones de sesiones
            </p>
          </div>
          <button
            onClick={() => handleCreateNote()}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white transition ${
              darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            <FiPlus size={20} />
            Nueva Nota
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Notas</p>
            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {therapyNotes.length}
            </p>
          </div>
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-blue-900/20 border border-blue-700' : 'bg-blue-50 border border-blue-200'}`}>
            <p className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>Pacientes con Notas</p>
            <p className={`text-2xl font-bold ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
              {groupedByPatient.length}
            </p>
          </div>
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-green-900/20 border border-green-700' : 'bg-green-50 border border-green-200'}`}>
            <p className={`text-sm ${darkMode ? 'text-green-400' : 'text-green-700'}`}>Este Mes</p>
            <p className={`text-2xl font-bold ${darkMode ? 'text-green-300' : 'text-green-600'}`}>
              {therapyNotes.filter(n => {
                const noteDate = new Date(n.date);
                const now = new Date();
                return noteDate.getMonth() === now.getMonth() && noteDate.getFullYear() === now.getFullYear();
              }).length}
            </p>
          </div>
        </div>
      </div>

      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-lg p-4`}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre de paciente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border transition ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
          <select
            value={filterPatientId}
            onChange={(e) => setFilterPatientId(e.target.value)}
            className={`px-4 py-2 rounded-lg border transition ${
              darkMode
                ? 'bg-slate-700 border-slate-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="all">Todos los pacientes</option>
            {patients.map(patient => (
              <option key={patient.id} value={patient.id}>
                {patient.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
        <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Notas Registradas
        </h2>

        <div className="space-y-3">
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <div
                key={note.id}
                className={`p-4 rounded-lg border transition ${
                  darkMode
                    ? 'bg-slate-700 border-slate-600 hover:bg-slate-650'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {note.patientName}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded ${
                        darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {new Date(note.date + 'T00:00:00').toLocaleDateString('es-AR')}
                      </span>
                      {note.voiceRecorded && (
                        <span className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${
                          darkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-700'
                        }`}>
                          <FiMic size={12} />
                          Voz
                        </span>
                      )}
                    </div>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {note.content}
                    </p>
                    {note.tags && note.tags.length > 0 && (
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {note.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className={`text-xs px-2 py-1 rounded ${
                              darkMode ? 'bg-slate-600 text-gray-300' : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEditNote(note)}
                      className={`p-2 rounded-lg transition ${
                        darkMode
                          ? 'bg-slate-600 hover:bg-slate-500 text-white'
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                      title="Editar"
                    >
                      <FiEdit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className={`p-2 rounded-lg transition ${
                        darkMode
                          ? 'bg-red-600/20 hover:bg-red-600/30 text-red-400'
                          : 'bg-red-100 hover:bg-red-200 text-red-600'
                      }`}
                      title="Eliminar"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {searchTerm || filterPatientId !== 'all' 
                ? 'No se encontraron notas con los filtros aplicados'
                : 'No hay notas de terapia registradas'}
            </div>
          )}
        </div>
      </div>

      <TherapyNoteModal
        darkMode={darkMode}
        isOpen={isNoteModalOpen}
        onClose={() => {
          setIsNoteModalOpen(false);
          setSelectedPatient(null);
          setSelectedNote(null);
        }}
        onSave={handleSaveNote}
        patients={patients}
        selectedPatient={selectedPatient}
        note={selectedNote}
      />
    </div>
  );
}
