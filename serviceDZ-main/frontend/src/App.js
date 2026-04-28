import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import ServiceDZHome from './components/ServiceDZHome';
import LoginPage from './components/LoginPage';

// ─── Protection de route (optionnel) ─────────────────────────────────────────
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  if (isLoading) return (
    <div style={{ minHeight: "100vh", background: "#1A1410", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "sans-serif" }}>
      Chargement…
    </div>
  );

  if (!isAuthenticated) {
    loginWithRedirect();
    return null;
  }

  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"      element={<ServiceDZHome />} />
        <Route path="/login" element={<LoginPage />} />
        {/* Exemple route protégée :
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> */}
      </Routes>
    </Router>
  );
}

export default App;
