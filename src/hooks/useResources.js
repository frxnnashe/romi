// src/hooks/useResources.js
import { useState, useEffect } from 'react';
import { useFirestore } from './useFirestore';
import { where } from 'firebase/firestore';

export const useResources = () => {
  const foldersFirestore = useFirestore('resourceFolders');
  const documentsFirestore = useFirestore('resourceDocuments');
  
  const [folders, setFolders] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFolders = async () => {
    setLoading(true);
    try {
      const data = await foldersFirestore.getDocuments();
      setFolders(data);
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const data = await documentsFirestore.getDocuments();
      setDocuments(data);
    } finally {
      setLoading(false);
    }
  };

  const getDocumentsByFolder = async (folderId) => {
    return await documentsFirestore.getDocuments([where('folderId', '==', folderId)]);
  };

  const saveFolder = async (folderData) => {
    if (folderData.id) {
      const { id, ...dataWithoutId } = folderData;
      await foldersFirestore.updateDocument(id, dataWithoutId);
      await fetchFolders();
      return id;
    } else {
      const id = await foldersFirestore.addDocument(folderData);
      await fetchFolders();
      return id;
    }
  };

  const deleteFolder = async (id) => {
    await foldersFirestore.deleteDocument(id);
    await fetchFolders();
  };

  const saveDocument = async (documentData) => {
    if (documentData.id) {
      const { id, ...dataWithoutId } = documentData;
      await documentsFirestore.updateDocument(id, dataWithoutId);
      await fetchDocuments();
      return id;
    } else {
      const id = await documentsFirestore.addDocument(documentData);
      await fetchDocuments();
      return id;
    }
  };

  const deleteDocument = async (id) => {
    await documentsFirestore.deleteDocument(id);
    await fetchDocuments();
  };

  useEffect(() => {
    fetchFolders();
    fetchDocuments();
  }, []);

  return {
    folders,
    documents,
    getDocumentsByFolder,
    saveFolder,
    deleteFolder,
    saveDocument,
    deleteDocument,
    loading,
    fetchFolders,
    fetchDocuments,
  };
};