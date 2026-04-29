// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getToken, getStoredUser } from './hooks/useAuth';
import ServiceDZHome    from './components/ServiceDZHome';
import LoginPage        from './components/LoginPage';
import RoleSelection    from './pages/RoleSelection';
import ClientDashboard  from './pages/ClientDashboard';
import ArtisanDashboard from './pages/ArtisanDashboard';

// ─── Loading screen ────────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div style={{ minHeight: "100vh", background: "#1A1410", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 32, height: 32, border: "3px solid rgba(55,138,221,0.2)", borderTop: "3px solid #378ADD", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
        <p style={{ color: "#888780", fontSize: 13, fontFamily: "sans-serif" }}>Chargement…</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── Route protégée ────────────────────────────────────────────────────────────
// Vérifie simplement si un token JWT existe dans localStorage
function ProtectedRoute({ children }) {
  const token = getToken();
  const user  = getStoredUser();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// ─── Redirection selon rôle ────────────────────────────────────────────────────
// Lit le rôle depuis le user stocké en localStorage (mis à jour au login)
function RoleRoute() {
  const token = getToken();
  const user  = getStoredUser();

  if (!token || !user) return <Navigate to="/login" replace />;

  const role = user?.role;

  if (!role)              return <Navigate to="/role"              replace />;
  if (role === "client")  return <Navigate to="/dashboard/client"  replace />;
  if (role === "artisan" || role === "worker")
                          return <Navigate to="/dashboard/artisan" replace />;

  return <Navigate to="/" replace />;
}

function App() {
  return (
    <Router>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <Routes>

        {/* ── Pages publiques ── */}
        <Route path="/"      element={<ServiceDZHome />} />
        <Route path="/login" element={<LoginPage />} />

        {/* ── Sélection de rôle (après inscription) ── */}
        <Route path="/role" element={
          <ProtectedRoute><RoleSelection /></ProtectedRoute>
        } />

        {/* ── Auto-redirect selon rôle ── */}
        <Route path="/dashboard" element={<RoleRoute />} />

        {/* ── Dashboards protégés ── */}
        <Route path="/dashboard/client" element={
          <ProtectedRoute><ClientDashboard /></ProtectedRoute>
        } />
        <Route path="/dashboard/artisan" element={
          <ProtectedRoute><ArtisanDashboard /></ProtectedRoute>
        } />

        {/* ── 404 ── */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;
