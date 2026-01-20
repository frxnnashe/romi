import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import CalendarPage from './pages/CalendarPage';
import PatientsPage from './pages/PatientsPage';
import ClinicalHistoryPage from './pages/ClinicalHistoryPage';
import TherapyNotesPage from './pages/TherapyNotesPage';
import TherapeuticToolsPage from './pages/TherapeuticToolsPage';
import PaymentsPage from './pages/PaymentsPage';
import ResourcesPage from './pages/ResourcesPage';
import PendientesPage from './pages/PendientesPage';
import ExpensesPage from './pages/ExpensesPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Router>
      <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-slate-900 text-white' : 'bg-gray-50'}`}>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/login" element={<LoginPage darkMode={darkMode} />} />
            <Route path="/register" element={<RegisterPage darkMode={darkMode} />} />
            
            <Route path="/" element={<Navigate to="/calendario" replace />} />
            
            <Route 
              path="/calendario" 
              element={
                <ProtectedRoute>
                  <CalendarPage darkMode={darkMode} />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/pacientes" 
              element={
                <ProtectedRoute>
                  <PatientsPage darkMode={darkMode} />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/historias-clinicas" 
              element={
                <ProtectedRoute>
                  <ClinicalHistoryPage darkMode={darkMode} />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/notas-terapia" 
              element={
                <ProtectedRoute>
                  <TherapyNotesPage darkMode={darkMode} />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/herramientas" 
              element={
                <ProtectedRoute>
                  <TherapeuticToolsPage darkMode={darkMode} />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/recursos" 
              element={
                <ProtectedRoute>
                  <ResourcesPage darkMode={darkMode} />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/pendientes" 
              element={
                <ProtectedRoute>
                  <PendientesPage darkMode={darkMode} />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/pagos" 
              element={
                <ProtectedRoute>
                  <PaymentsPage darkMode={darkMode} />
                </ProtectedRoute>
              } 
            />
             <Route 
              path="/gastos" 
              element={
                <ProtectedRoute>
                  <ExpensesPage darkMode={darkMode} />
                </ProtectedRoute>
              } 
            />
             <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage darkMode={darkMode} />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>

        <Footer darkMode={darkMode} />
        <Toaster position="bottom-right" />
      </div>
    </Router>
  );
}

export default App;