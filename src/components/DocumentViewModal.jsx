import { FiX, FiEdit2, FiTrash2, FiFolder, FiCalendar, FiClock } from 'react-icons/fi';

export default function DocumentViewModal({ 
  darkMode, 
  isOpen, 
  onClose, 
  document,
  folder,
  onEdit,
  onDelete 
}) {
  if (!isOpen || !document) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto`}>
        {/* Header */}
        <div className={`flex justify-between items-start p-4 md:p-6 border-b ${darkMode ? 'border-slate-700' : 'border-gray-200'} sticky top-0 bg-inherit z-10`}>
          <div className="flex-1 min-w-0 mr-4">
            <h2 className={`text-xl md:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {document.title}
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {folder && (
                <span className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${
                  darkMode ? 'bg-slate-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                }`}>
                  <FiFolder size={12} style={{ color: folder.color }} />
                  {folder.name}
                </span>
              )}
              {document.createdAt && (
                <span className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${
                  darkMode ? 'bg-slate-700 text-gray-400' : 'bg-gray-100 text-gray-600'
                }`}>
                  <FiCalendar size={12} />
                  {formatDate(document.createdAt)}
                </span>
              )}
              {document.lastUpdate && (
                <span className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${
                  darkMode ? 'bg-blue-900/20 text-blue-300' : 'bg-blue-50 text-blue-700'
                }`}>
                  <FiClock size={12} />
                  Actualizado: {formatDate(document.lastUpdate)}
                </span>
              )}
            </div>
          </div>
          <button onClick={onClose} className={`hover:opacity-70 flex-shrink-0 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <FiX size={24} />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-4 md:p-6">
          {/* Tags */}
          {document.tags && document.tags.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {document.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className={`px-3 py-1 rounded-full text-xs ${
                      darkMode ? 'bg-indigo-900/30 text-indigo-300' : 'bg-indigo-100 text-indigo-700'
                    }`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Contenido del documento */}
          <div className={`prose max-w-none ${darkMode ? 'prose-invert' : ''}`}>
            <div className={`p-4 rounded-lg whitespace-pre-wrap font-mono text-sm leading-relaxed ${
              darkMode ? 'bg-slate-900 text-gray-300' : 'bg-gray-50 text-gray-800'
            }`}>
              {document.content}
            </div>
          </div>

          {/* Estadísticas */}
          <div className={`mt-4 p-3 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
            <div className="flex flex-wrap gap-4 text-xs">
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                📝 {document.content.length} caracteres
              </span>
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                📄 {document.content.split('\n').length} líneas
              </span>
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                💬 ~{document.content.split(' ').length} palabras
              </span>
            </div>
          </div>
        </div>

        {/* Footer con acciones */}
        <div className={`flex flex-col sm:flex-row gap-3 p-4 md:p-6 border-t ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
          <button
            type="button"
            onClick={onClose}
            className={`flex-1 py-2 rounded-lg font-medium transition ${
              darkMode
                ? 'bg-slate-700 hover:bg-slate-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            Cerrar
          </button>
          <button
            type="button"
            onClick={() => {
              onEdit(document);
              onClose();
            }}
            className={`flex-1 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
              darkMode
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                : 'bg-indigo-500 hover:bg-indigo-600 text-white'
            }`}
          >
            <FiEdit2 size={16} />
            Editar
          </button>
          <button
            type="button"
            onClick={() => {
              onDelete(document.id);
              onClose();
            }}
            className={`py-2 px-4 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
              darkMode
                ? 'bg-red-600/20 hover:bg-red-600/30 text-red-400'
                : 'bg-red-100 hover:bg-red-200 text-red-600'
            }`}
          >
            <FiTrash2 size={16} />
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}