// src/hooks/useTherapeuticTools.js
import { useState, useEffect } from 'react';
import { useFirestore } from './useFirestore';
import { where } from 'firebase/firestore';

export const useTherapeuticTools = () => {
  const sessionsFirestore = useFirestore('toolSessions');
  const toolsFirestore = useFirestore('availableTools');
  
  const [toolSessions, setToolSessions] = useState([]);
  const [availableTools, setAvailableTools] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchToolSessions = async () => {
    setLoading(true);
    try {
      const data = await sessionsFirestore.getDocuments();
      setToolSessions(data);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableTools = async () => {
    setLoading(true);
    try {
      const data = await toolsFirestore.getDocuments();
      setAvailableTools(data);
    } finally {
      setLoading(false);
    }
  };

  const getSessionsByPatient = async (patientId) => {
    return await sessionsFirestore.getDocuments([where('patientId', '==', patientId)]);
  };

  const saveToolSession = async (sessionData) => {
    if (sessionData.id) {
      const { id, ...dataWithoutId } = sessionData;
      await sessionsFirestore.updateDocument(id, dataWithoutId);
      await fetchToolSessions();
      return id;
    } else {
      const id = await sessionsFirestore.addDocument(sessionData);
      await fetchToolSessions();
      return id;
    }
  };

  const deleteToolSession = async (id) => {
    await sessionsFirestore.deleteDocument(id);
    await fetchToolSessions();
  };

  const saveAvailableTool = async (toolData) => {
    if (toolData.id) {
      const { id, ...dataWithoutId } = toolData;
      await toolsFirestore.updateDocument(id, dataWithoutId);
      await fetchAvailableTools();
      return id;
    } else {
      const id = await toolsFirestore.addDocument(toolData);
      await fetchAvailableTools();
      return id;
    }
  };

  const deleteAvailableTool = async (id) => {
    await toolsFirestore.deleteDocument(id);
    await fetchAvailableTools();
  };

  useEffect(() => {
    fetchToolSessions();
    fetchAvailableTools();
  }, []);

  return {
    toolSessions,
    availableTools,
    getSessionsByPatient,
    saveToolSession,
    deleteToolSession,
    saveAvailableTool,
    deleteAvailableTool,
    loading,
    fetchToolSessions,
    fetchAvailableTools,
  };
};