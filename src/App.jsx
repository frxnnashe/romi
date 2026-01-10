// src/App.jsx
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CalendarPage from './pages/CalendarPage';
import PatientsPage from './pages/PatientsPage';
import ClinicalHistoryPage from './pages/ClinicalHistoryPage';
import TherapyNotesPage from './pages/TherapyNotesPage';
import TherapeuticToolsPage from './pages/TherapeuticToolsPage';
import PaymentsPage from './pages/PaymentsPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Router>
      <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-slate-900 text-white' : 'bg-gray-50'}`}>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Navigate to="/calendario" replace />} />
            <Route path="/calendario" element={<CalendarPage darkMode={darkMode} />} />
            <Route path="/pacientes" element={<PatientsPage darkMode={darkMode} />} />
            <Route path="/historias-clinicas" element={<ClinicalHistoryPage darkMode={darkMode} />} />
            <Route path="/notas-terapia" element={<TherapyNotesPage darkMode={darkMode} />} />
            <Route path="/herramientas" element={<TherapeuticToolsPage darkMode={darkMode} />} />
            <Route path="/pagos" element={<PaymentsPage darkMode={darkMode} />} />
            <Route path="/dashboard" element={<DashboardPage darkMode={darkMode} />} />
          </Routes>
        </main>

        <Footer darkMode={darkMode} />
        <Toaster position="bottom-right" />
      </div>
    </Router>
  );
}

export default App;