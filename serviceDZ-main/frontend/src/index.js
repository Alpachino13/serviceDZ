// ─── index.js ─────────────────────────────────────────────────────────────────
// Remplace ton index.js existant par ce contenu

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Auth0Provider
    domain={process.env.REACT_APP_AUTH0_DOMAIN}
    clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: process.env.REACT_APP_AUTH0_AUDIENCE,
      scope: "openid profile email",
    }}
  >
    <App />
  </Auth0Provider>
);


// ─── App.js ───────────────────────────────────────────────────────────────────
// Remplace ton App.js existant par ce contenu
/*
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import ServiceDZHome from './components/ServiceDZHome';
import LoginPage from './components/LoginPage';

// Composant pour protéger les routes
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  if (isLoading) return (
    <div style={{ minHeight: "100vh", background: "#1A1410", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
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
        // Pour protéger une route ex: dashboard:
        // <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
*/
