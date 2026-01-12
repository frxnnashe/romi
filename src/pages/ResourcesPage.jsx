import { useState } from 'react';
import { FiFolder, FiFileText, FiPlus, FiEdit2, FiTrash2, FiSearch, FiBookOpen, FiFolderPlus } from 'react-icons/fi';
import FolderModal from '../components/FolderModal';
import DocumentModal from '../components/DocumentModal';
import DocumentViewModal from '../components/DocumentViewModal';
import { useResources } from '../hooks/useResources';
import toast from 'react-hot-toast';

export default function ResourcesPage({ darkMode }) {
  const { 
    folders, 
    documents, 
    saveFolder, 
    deleteFolder,
    saveDocument,
    deleteDocument 
  } = useResources();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [viewDocument, setViewDocument] = useState(null);
  
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Filtrar carpetas y documentos
  const filteredFolders = folders.filter(folder =>
    folder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    folder.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDocumentsByFolder = (folderId) => {
    return documents.filter(doc => doc.folderId === folderId);
  };

  const filteredDocuments = searchTerm 
    ? documents.filter(doc =>
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Handlers de carpetas
  const handleCreateFolder = () => {
    setSelectedFolder(null);
    setIsFolderModalOpen(true);
  };

  const handleEditFolder = (folder) => {
    setSelectedFolder(folder);
    setIsFolderModalOpen(true);
  };

  const handleSaveFolder = async (folderData) => {
    try {
      await saveFolder(folderData);
      toast.success(selectedFolder ? 'Carpeta actualizada' : 'Carpeta creada');
      setIsFolderModalOpen(false);
      setSelectedFolder(null);
    } catch (error) {
      toast.error('Error al guardar carpeta');
    }
  };

  const handleDeleteFolder = async (folderId) => {
    const docsInFolder = getDocumentsByFolder(folderId);
    if (docsInFolder.length > 0) {
      if (!window.confirm(`Esta carpeta tiene ${docsInFolder.length} documento(s). ¿Eliminar todo?`)) {
        return;
      }
    } else if (!window.confirm('¿Estás seguro de eliminar esta carpeta?')) {
      return;
    }

    try {
      // Eliminar documentos primero
      for (const doc of docsInFolder) {
        await deleteDocument(doc.id);
      }
      await deleteFolder(folderId);
      toast.success('Carpeta eliminada');
    } catch (error) {
      toast.error('Error al eliminar carpeta');
    }
  };

  // Handlers de documentos
  const handleCreateDocument = (folder) => {
    setSelectedFolder(folder);
    setSelectedDocument(null);
    setIsDocumentModalOpen(true);
  };

  const handleEditDocument = (document) => {
    setSelectedDocument(document);
    setIsDocumentModalOpen(true);
  };

  const handleViewDocument = (document) => {
    setViewDocument(document);
    setIsViewModalOpen(true);
  };

  const handleSaveDocument = async (documentData) => {
    try {
      await saveDocument(documentData);
      toast.success(selectedDocument ? 'Documento actualizado' : 'Documento creado');
      setIsDocumentModalOpen(false);
      setSelectedDocument(null);
      setSelectedFolder(null);
    } catch (error) {
      toast.error('Error al guardar documento');
    }
  };

  const handleDeleteDocument = async (documentId) => {
    if (window.confirm('¿Estás seguro de eliminar este documento?')) {
      try {
        await deleteDocument(documentId);
        toast.success('Documento eliminado');
      } catch (error) {
        toast.error('Error al eliminar documento');
      }
    }
  };

  // Estadísticas
  const totalFolders = folders.length;
  const totalDocuments = documents.length;
  const recentDocuments = documents
    .sort((a, b) => new Date(b.lastUpdate) - new Date(a.lastUpdate))
    .slice(0, 5);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-lg p-4 md:p-6`}>
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-3`}>
              <FiBookOpen className="text-indigo-500" size={28} />
              Recursos de Conocimiento
            </h1>
            <p className={`mt-2 text-sm md:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Gestiona cursos, métodos, prácticas y aprendizajes
            </p>
          </div>
          <button
            onClick={handleCreateFolder}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-white transition text-sm md:text-base ${
              darkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'
            }`}
          >
            <FiFolderPlus size={18} />
            Nueva Carpeta
          </button>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-6">
          <div className={`p-3 md:p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
            <p className={`text-xs md:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Carpetas</p>
            <p className={`text-xl md:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {totalFolders}
            </p>
          </div>
          <div className={`p-3 md:p-4 rounded-lg ${darkMode ? 'bg-indigo-900/20 border border-indigo-700' : 'bg-indigo-50 border border-indigo-200'}`}>
            <p className={`text-xs md:text-sm ${darkMode ? 'text-indigo-400' : 'text-indigo-700'}`}>Total Documentos</p>
            <p className={`text-xl md:text-2xl font-bold ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>
              {totalDocuments}
            </p>
          </div>
          <div className={`p-3 md:p-4 rounded-lg col-span-2 ${darkMode ? 'bg-purple-900/20 border border-purple-700' : 'bg-purple-50 border border-purple-200'}`}>
            <p className={`text-xs md:text-sm ${darkMode ? 'text-purple-400' : 'text-purple-700'}`}>Última actualización</p>
            <p className={`text-sm md:text-base font-semibold truncate ${darkMode ? 'text-purple-300' : 'text-purple-600'}`}>
              {recentDocuments[0] 
                ? `${recentDocuments[0].title} - ${new Date(recentDocuments[0].lastUpdate).toLocaleDateString('es-AR')}`
                : 'Sin documentos'}
            </p>
          </div>
        </div>
      </div>

      {/* Búsqueda */}
      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-lg p-4`}>
        <div className="relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Buscar en carpetas y documentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border transition text-sm md:text-base ${
              darkMode
                ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          />
        </div>

        {/* Resultados de búsqueda de documentos */}
        {searchTerm && filteredDocuments.length > 0 && (
          <div className="mt-4">
            <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Documentos encontrados ({filteredDocuments.length})
            </p>
            <div className="space-y-2">
              {filteredDocuments.slice(0, 5).map(doc => {
                const folder = folders.find(f => f.id === doc.folderId);
                return (
                  <button
                    key={doc.id}
                    onClick={() => handleViewDocument(doc)}
                    className={`w-full text-left p-3 rounded-lg transition ${
                      darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FiFileText size={16} className="text-indigo-500" />
                      <span className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {doc.title}
                      </span>
                      {folder && (
                        <span className={`text-xs px-2 py-1 rounded ${
                          darkMode ? 'bg-slate-600 text-gray-300' : 'bg-gray-200 text-gray-700'
                        }`}>
                          {folder.name}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Grid de Carpetas */}
      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-lg p-4 md:p-6`}>
        <h2 className={`text-lg md:text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Mis Carpetas de Recursos
        </h2>

        {filteredFolders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFolders.map((folder) => {
              const folderDocs = getDocumentsByFolder(folder.id);
              return (
                <div
                  key={folder.id}
                  className={`p-4 rounded-lg border-2 transition ${
                    darkMode
                      ? 'bg-slate-700 border-slate-600 hover:border-indigo-500'
                      : 'bg-gray-50 border-gray-200 hover:border-indigo-400'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <FiFolder size={24} className="text-indigo-500 flex-shrink-0" />
                      <h3 className={`font-semibold text-base truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {folder.name}
                      </h3>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEditFolder(folder)}
                        className={`p-1.5 rounded transition ${
                          darkMode ? 'hover:bg-slate-600' : 'hover:bg-gray-200'
                        }`}
                      >
                        <FiEdit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteFolder(folder.id)}
                        className={`p-1.5 rounded transition ${
                          darkMode ? 'hover:bg-red-600/20 text-red-400' : 'hover:bg-red-100 text-red-600'
                        }`}
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {folder.description && (
                    <p className={`text-xs md:text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {folder.description}
                    </p>
                  )}

                  <div className={`text-xs md:text-sm mb-3 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    📄 {folderDocs.length} documento{folderDocs.length !== 1 ? 's' : ''}
                  </div>

                  {/* Documentos dentro de la carpeta */}
                  {folderDocs.length > 0 && (
                    <div className="space-y-1 mb-3 max-h-32 overflow-y-auto">
                      {folderDocs.map(doc => (
                        <button
                          key={doc.id}
                          onClick={() => handleViewDocument(doc)}
                          className={`w-full text-left p-2 rounded text-xs flex items-center justify-between transition ${
                            darkMode ? 'bg-slate-600 hover:bg-slate-500 text-gray-300' : 'bg-white hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          <span className="truncate flex-1">{doc.title}</span>
                          <FiFileText size={12} className="flex-shrink-0 ml-2" />
                        </button>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => handleCreateDocument(folder)}
                    className={`w-full py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 ${
                      darkMode
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                    }`}
                  >
                    <FiPlus size={14} />
                    Nuevo Documento
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={`text-center py-12 text-sm md:text-base ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {searchTerm ? 'No se encontraron carpetas' : 'No hay carpetas creadas. ¡Crea tu primera carpeta!'}
          </div>
        )}
      </div>

      {/* Modales */}
      <FolderModal
        darkMode={darkMode}
        isOpen={isFolderModalOpen}
        onClose={() => {
          setIsFolderModalOpen(false);
          setSelectedFolder(null);
        }}
        onSave={handleSaveFolder}
        folder={selectedFolder}
      />

      <DocumentModal
        darkMode={darkMode}
        isOpen={isDocumentModalOpen}
        onClose={() => {
          setIsDocumentModalOpen(false);
          setSelectedDocument(null);
          setSelectedFolder(null);
        }}
        onSave={handleSaveDocument}
        document={selectedDocument}
        folder={selectedFolder}
        folders={folders}
      />

      <DocumentViewModal
        darkMode={darkMode}
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setViewDocument(null);
        }}
        document={viewDocument}
        folder={folders.find(f => f.id === viewDocument?.folderId)}
        onEdit={handleEditDocument}
        onDelete={handleDeleteDocument}
      />
    </div>
  );
}