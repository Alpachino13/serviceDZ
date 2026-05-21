import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getToken, getStoredUser } from './hooks/useAuth';

import ServiceDZ from './components/ServiceDZ';
import LoginPage from './components/LoginPage';
import ClientDashboard from './pages/ClientDashboard';
import ArtisanDashboard from './pages/ArtisanDashboard';

// Mock component pour éviter les crashs si les fichiers n'existent pas encore
const ArtisanProfile = () => <div className="dash-content">Profil en construction...</div>;
const RoleSelection = () => <div className="dash-content">Veuillez sélectionner un rôle.</div>;

function ProtectedRoute({ children }) {
  const token = getToken();
  const user = getStoredUser();
  if (!token || !user) return <Navigate to="/login" replace />;
  return children;
}

function RoleRoute() {
  const token = getToken();
  const user = getStoredUser();
  if (!token || !user) return <Navigate to="/login" replace />;
  
  const role = user?.role;
  if (!role) return <Navigate to="/role" replace />;
  if (role === "client") return <Navigate to="/dashboard/client" replace />;
  if (role === "artisan" || role === "worker") return <Navigate to="/dashboard/artisan" replace />;
  
  return <Navigate to="/" replace />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ServiceDZ />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/artisan/:id" element={<ArtisanProfile />} />
        <Route path="/role" element={<ProtectedRoute><RoleSelection /></ProtectedRoute>} />
        <Route path="/dashboard" element={<RoleRoute />} />
        <Route path="/dashboard/client" element={<ProtectedRoute><ClientDashboard /></ProtectedRoute>} />
        <Route path="/dashboard/artisan" element={<ProtectedRoute><ArtisanDashboard /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}