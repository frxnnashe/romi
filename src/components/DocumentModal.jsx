import { useState, useEffect } from 'react';
import { FiX, FiSave, FiFileText, FiTag } from 'react-icons/fi';

export default function DocumentModal({ 
  darkMode, 
  isOpen, 
  onClose, 
  onSave, 
  document, 
  folder,
  folders 
}) {
  const [formData, setFormData] = useState({
    folderId: '',
    folderName: '',
    title: '',
    content: '',
    tags: [],
  });

  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (document) {
      setFormData(document);
    } else if (folder) {
      setFormData({
        folderId: folder.id,
        folderName: folder.name,
        title: '',
        content: '',
        tags: [],
      });
    } else {
      setFormData({
        folderId: '',
        folderName: '',
        title: '',
        content: '',
        tags: [],
      });
    }
  }, [document, folder, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFolderChange = (e) => {
    const selectedFolder = folders.find(f => f.id === e.target.value);
    setFormData(prev => ({
      ...prev,
      folderId: e.target.value,
      folderName: selectedFolder?.name || '',
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
    if (!formData.title.trim() || !formData.content.trim() || !formData.folderId) {
      alert('Por favor completa el título, contenido y selecciona una carpeta');
      return;
    }

    const dataToSave = {
      ...formData,
      title: formData.title.trim(),
      content: formData.content.trim(),
      lastUpdate: new Date().toISOString(),
    };

    if (document) {
      dataToSave.id = document.id;
    } else {
      dataToSave.createdAt = new Date().toISOString();
    }

    onSave(dataToSave);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto`}>
        {/* Header */}
        <div className={`flex justify-between items-center p-4 md:p-6 border-b ${darkMode ? 'border-slate-700' : 'border-gray-200'} sticky top-0 bg-inherit z-10`}>
          <div>
            <h2 className={`text-xl md:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {document ? 'Editar Documento' : 'Nuevo Documento'}
            </h2>
            <p className={`text-xs md:text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Registra tu conocimiento y aprendizaje
            </p>
          </div>
          <button onClick={onClose} className={`hover:opacity-70 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <FiX size={24} />
          </button>
        </div>

        <div className="p-4 md:p-6 space-y-4">
          {/* Carpeta */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Carpeta *
            </label>
            <select
              value={formData.folderId}
              onChange={handleFolderChange}
              disabled={!!folder && !document}
              className={`w-full px-3 py-2 rounded-lg border transition ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } ${(folder && !document) ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <option value="">Seleccionar carpeta...</option>
              {folders.map(f => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          {/* Título */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Título del Documento *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ej: Curso de Técnicas Manuales - Módulo 1"
              className={`w-full px-3 py-2 rounded-lg border transition ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          {/* Contenido */}
          <div>
            <label className={`block text-sm font-medium mb-2 flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <FiFileText size={16} />
              Contenido *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Escribe aquí todo el contenido del documento: conceptos, técnicas, métodos, prácticas, etc..."
              rows={15}
              className={`w-full px-4 py-3 rounded-lg border transition resize-none font-mono text-sm ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
            <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              {formData.content.length} caracteres
            </p>
          </div>

          {/* Tags */}
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
                placeholder="Ej: curso, técnica, método..."
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
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className={`w-full sm:flex-1 py-3 rounded-lg font-medium transition ${
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
              className={`w-full sm:flex-1 py-3 rounded-lg font-medium text-white transition flex items-center justify-center gap-2 ${
                darkMode
                  ? 'bg-indigo-600 hover:bg-indigo-700'
                  : 'bg-indigo-500 hover:bg-indigo-600'
              }`}
            >
              <FiSave size={18} />
              {document ? 'Actualizar Documento' : 'Guardar Documento'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}