import { useState, useEffect } from "react";
import {
  FiX,
  FiSave,
  FiFileText,
  FiClipboard,
  FiAlertCircle,
  FiEdit,
  FiActivity,
} from "react-icons/fi";

export default function ClinicalHistoryModal({
  darkMode,
  isOpen,
  onClose,
  onSave,
  patient,
  clinicalHistory,
}) {
  const [formData, setFormData] = useState({
    medication: "",
    previousTreatments: "",
    consultationReason: "",
    dsmDiagnosis: "",
    anamnesis: "",
    lastUpdate: new Date().toISOString(),
  });

  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    if (clinicalHistory) {
      setFormData(clinicalHistory);
    } else {
      setFormData({
        medication: "",
        previousTreatments: "",
        consultationReason: "",
        dsmDiagnosis: "",
        anamnesis: "",
        lastUpdate: new Date().toISOString(),
      });
    }
    setIsModified(false);
  }, [clinicalHistory, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIsModified(true);
  };

  const handleSubmit = () => {
    const dataToSave = {
      ...formData,
      patientId: patient.id,
      patientName: patient.name,
      lastUpdate: new Date().toISOString(),
    };
    onSave(dataToSave);
    setIsModified(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div
        className={`${
          darkMode ? "bg-slate-800" : "bg-white"
        } rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto`}
      >
        {/* Header */}
        <div
          className={`flex justify-between items-center p-6 border-b ${
            darkMode ? "border-slate-700" : "border-gray-200"
          } sticky top-0 bg-inherit z-10`}
        >
          <div>
            <h2
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              📋 Historia Clínica
            </h2>
            <p
              className={`text-sm mt-1 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Paciente: <span className="font-semibold">{patient?.name}</span>
            </p>
            {clinicalHistory?.lastUpdate && (
              <p className="text-xs mt-1 text-gray-500">
                Última actualización:{" "}
                {new Date(clinicalHistory.lastUpdate).toLocaleString("es-AR")}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className={`hover:opacity-70 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Medicación */}
          <div>
            <label
              className={`block text-sm font-semibold mb-2 flex items-center gap-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              <FiActivity size={18} className="text-purple-500" />
              1. Medicación Actual
            </label>
            <textarea
              name="medication"
              value={formData.medication}
              onChange={handleChange}
              rows={4}
              className={`w-full px-4 py-3 rounded-lg border resize-none ${
                darkMode
                  ? "bg-slate-700 border-slate-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          </div>

          {/* Tratamientos */}
          <div>
            <label
              className={`block text-sm font-semibold mb-2 flex items-center gap-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              <FiClipboard size={18} className="text-blue-500" />
              2. Tratamientos Anteriores
            </label>
            <textarea
              name="previousTreatments"
              value={formData.previousTreatments}
              onChange={handleChange}
              rows={4}
              className={`w-full px-4 py-3 rounded-lg border resize-none ${
                darkMode
                  ? "bg-slate-700 border-slate-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          </div>

          {/* Motivo */}
          <div>
            <label
              className={`block text-sm font-semibold mb-2 flex items-center gap-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              <FiAlertCircle size={18} className="text-orange-500" />
              3. Motivo de Consulta
            </label>
            <textarea
              name="consultationReason"
              value={formData.consultationReason}
              onChange={handleChange}
              rows={4}
              className={`w-full px-4 py-3 rounded-lg border resize-none ${
                darkMode
                  ? "bg-slate-700 border-slate-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          </div>

          {/* Diagnóstico */}
          <div>
            <label
              className={`block text-sm font-semibold mb-2 flex items-center gap-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              <FiFileText size={18} className="text-red-500" />
              4. Diagnóstico DSM4
            </label>
            <textarea
              name="dsmDiagnosis"
              value={formData.dsmDiagnosis}
              onChange={handleChange}
              rows={3}
              className={`w-full px-4 py-3 rounded-lg border resize-none ${
                darkMode
                  ? "bg-slate-700 border-slate-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          </div>

          {/* Anamnesis */}
          <div>
            <label
              className={`block text-sm font-semibold mb-2 flex items-center gap-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              <FiEdit size={18} className="text-green-500" />
              5. Anamnesis
            </label>
            <textarea
              name="anamnesis"
              value={formData.anamnesis}
              onChange={handleChange}
              rows={6}
              className={`w-full px-4 py-3 rounded-lg border resize-none ${
                darkMode
                  ? "bg-slate-700 border-slate-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          </div>

          {/* Cambios */}
          {isModified && (
            <div className="p-3 rounded-lg flex items-center gap-2 bg-yellow-50 border border-yellow-200">
              <FiAlertCircle className="text-yellow-600" />
              <span className="text-sm text-yellow-700">
                Hay cambios sin guardar
              </span>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3 pt-4 border-t">
            <button onClick={onClose} className="flex-1 py-3 bg-gray-200 rounded-lg">
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 py-3 bg-green-500 text-white rounded-lg flex items-center justify-center gap-2"
            >
              <FiSave />
              Guardar Historia
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
