import { useState, useEffect, useRef } from 'react';
import { FiX, FiSave, FiMic, FiMicOff, FiCalendar, FiTag } from 'react-icons/fi';

export default function TherapyNoteModal({ 
  darkMode, 
  isOpen, 
  onClose, 
  onSave, 
  patients,
  selectedPatient,
  note 
}) {
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    date: new Date().toISOString().split('T')[0],
    content: '',
    tags: [],
    voiceRecorded: false,
  });

  const [isRecording, setIsRecording] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (note) {
      setFormData(note);
      setSearchTerm(note.patientName);
    } else if (selectedPatient) {
      setFormData(prev => ({
        ...prev,
        patientId: selectedPatient.id,
        patientName: selectedPatient.name,
      }));
      setSearchTerm(selectedPatient.name);
    } else {
      setFormData({
        patientId: '',
        patientName: '',
        date: new Date().toISOString().split('T')[0],
        content: '',
        tags: [],
        voiceRecorded: false,
      });
      setSearchTerm('');
    }
  }, [note, selectedPatient, isOpen]);

  // Inicializar Web Speech API
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'es-ES';

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setFormData(prev => ({
            ...prev,
            content: prev.content + finalTranscript,
            voiceRecorded: true,
          }));
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Error de reconocimiento de voz:', event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Tu navegador no soporta reconocimiento de voz. Usa Chrome o Edge.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handlePatientSearch = (value) => {
    setSearchTerm(value);
    if (value.length > 0) {
      setShowPatientDropdown(true);
    } else {
      setShowPatientDropdown(false);
    }
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

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleSubmit = () => {
    if (!formData.patientId || !formData.content.trim()) {
      alert('Por favor selecciona un paciente y escribe el contenido de la nota');
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
        <div className={`flex justify-between items-center p-6 border-b ${darkMode ? 'border-slate-700' : 'border-gray-200'} sticky top-0 bg-inherit z-10`}>
          <div>
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {note ? 'Editar Nota de Terapia' : 'Nueva Nota de Terapia'}
            </h2>
            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Registro de evolución y observaciones
            </p>
          </div>
          <button onClick={onClose} className={`hover:opacity-70 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <FiX size={24} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Paciente */}
          <div className="relative">
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Paciente *
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handlePatientSearch(e.target.value)}
              onFocus={() => searchTerm && setShowPatientDropdown(true)}
              placeholder="Buscar paciente..."
              disabled={!!note}
              className={`w-full px-3 py-2 rounded-lg border transition ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900'
              } ${note ? 'opacity-60 cursor-not-allowed' : ''}`}
            />
            {showPatientDropdown && filteredPatients.length > 0 && !note && (
              <div className={`absolute top-full left-0 right-0 mt-1 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto ${
                darkMode ? 'bg-slate-700' : 'bg-white border border-gray-300'
              }`}>
                {filteredPatients.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => selectPatient(p)}
                    className={`w-full text-left px-3 py-2 transition ${
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
            <label className={`block text-sm font-medium mb-2 flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <FiCalendar size={16} />
              Fecha de la Sesión *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-lg border transition ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          {/* Contenido con dictado */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className={`text-sm font-medium flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Notas de la Sesión *
              </label>
              <button
                type="button"
                onClick={toggleRecording}
                className={`flex items-center gap-2 px-3 py-1 rounded-lg font-medium transition ${
                  isRecording
                    ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                    : darkMode
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'bg-purple-500 hover:bg-purple-600 text-white'
                }`}
              >
                {isRecording ? (
                  <>
                    <FiMicOff size={16} />
                    Detener
                  </>
                ) : (
                  <>
                    <FiMic size={16} />
                    Dictar
                  </>
                )}
              </button>
            </div>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Escribe o dicta las observaciones de la sesión..."
              rows={10}
              className={`w-full px-4 py-3 rounded-lg border transition resize-none ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
            {isRecording && (
              <p className={`text-sm mt-2 flex items-center gap-2 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                Escuchando... Habla claramente
              </p>
            )}
          </div>

          {/* Tags/Etiquetas */}
          <div>
            <label className={`block text-sm font-medium mb-2 flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <FiTag size={16} />
              Etiquetas (opcional)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="Ej: ansiedad, progreso, ejercicios..."
                className={`flex-1 px-3 py-2 rounded-lg border transition ${
                  darkMode
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
              <button
                type="button"
                onClick={handleAddTag}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  darkMode
                    ? 'bg-slate-700 hover:bg-slate-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Agregar
              </button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                      darkMode ? 'bg-slate-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-500"
                    >
                      <FiX size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-slate-700">
            <button
              type="button"
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
              type="button"
              onClick={handleSubmit}
              className={`flex-1 py-3 rounded-lg font-medium text-white transition flex items-center justify-center gap-2 ${
                darkMode
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              <FiSave size={18} />
              {note ? 'Actualizar Nota' : 'Guardar Nota'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}