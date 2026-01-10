import {
    FiX,
    FiPrinter,
    FiClipboard,
    FiAlertCircle,
    FiFileText,
    FiEdit3,
    FiActivity,
  } from "react-icons/fi";
  
  export default function ClinicalHistoryViewModal({
    darkMode,
    isOpen,
    onClose,
    patient,
    clinicalHistory,
  }) {
    const handlePrint = () => {
      window.print();
    };
  
    if (!isOpen) return null;
  
    const SectionView = ({ icon: Icon, title, content, color }) => (
      <div
        className={`mb-6 p-4 rounded-lg border ${
          darkMode
            ? "bg-slate-700 border-slate-600"
            : "bg-gray-50 border-gray-200"
        }`}
      >
        <div className="flex items-center gap-2 mb-3">
          <Icon size={20} className={color} />
          <h3
            className={`font-semibold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {title}
          </h3>
        </div>
        <div
          className={`${
            darkMode ? "text-gray-300" : "text-gray-700"
          } whitespace-pre-wrap`}
        >
          {content || (
            <span
              className={
                darkMode
                  ? "text-gray-500 italic"
                  : "text-gray-400 italic"
              }
            >
              No registrado
            </span>
          )}
        </div>
      </div>
    );
  
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
                📋 Historia Clínica - Vista Completa
              </h2>
              <p
                className={`text-sm mt-1 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Paciente:{" "}
                <span className="font-semibold">{patient?.name}</span>
              </p>
              <p className="text-sm text-gray-500">
                DNI: {patient?.dni}
              </p>
              {clinicalHistory?.lastUpdate && (
                <p className="text-xs mt-1 text-gray-500">
                  Última actualización:{" "}
                  {new Date(
                    clinicalHistory.lastUpdate
                  ).toLocaleString("es-AR")}
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
  
          <div className="p-6">
            {/* Datos del Paciente */}
            <div
              className={`mb-6 p-4 rounded-lg ${
                darkMode
                  ? "bg-blue-900/20 border border-blue-700"
                  : "bg-blue-50 border border-blue-200"
              }`}
            >
              <h3
                className={`font-semibold mb-2 ${
                  darkMode ? "text-blue-300" : "text-blue-900"
                }`}
              >
                Datos del Paciente
              </h3>
              <div
                className={`grid grid-cols-2 gap-3 text-sm ${
                  darkMode ? "text-blue-200" : "text-blue-800"
                }`}
              >
                <div>
                  <span className="font-medium">Nombre:</span>{" "}
                  {patient?.name}
                </div>
                <div>
                  <span className="font-medium">DNI:</span>{" "}
                  {patient?.dni}
                </div>
                <div>
                  <span className="font-medium">Teléfono:</span>{" "}
                  {patient?.phone || "No registrado"}
                </div>
                <div>
                  <span className="font-medium">Obra Social:</span>{" "}
                  {patient?.insurance || "Particular"}
                </div>
              </div>
            </div>
  
            {/* Secciones */}
            <SectionView
              icon={FiActivity}
              title="1. Medicación Actual"
              content={clinicalHistory?.medication}
              color="text-purple-500"
            />
  
            <SectionView
              icon={FiClipboard}
              title="2. Tratamientos Anteriores"
              content={clinicalHistory?.previousTreatments}
              color="text-blue-500"
            />
  
            <SectionView
              icon={FiAlertCircle}
              title="3. Motivo de Consulta"
              content={clinicalHistory?.consultationReason}
              color="text-orange-500"
            />
  
            <SectionView
              icon={FiFileText}
              title="4. Diagnóstico DSM-IV / CIE-10"
              content={clinicalHistory?.dsmDiagnosis}
              color="text-red-500"
            />
  
            <SectionView
              icon={FiEdit3}
              title="5. Anamnesis / Historia Clínica Completa"
              content={clinicalHistory?.anamnesis}
              color="text-green-500"
            />
  
            {/* Botones */}
            <div className="flex gap-3 pt-6 border-t">
              <button
                onClick={handlePrint}
                className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 ${
                  darkMode
                    ? "bg-slate-700 hover:bg-slate-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
              >
                <FiPrinter size={18} />
                Imprimir
              </button>
              <button
                onClick={onClose}
                className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 text-white ${
                  darkMode
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  