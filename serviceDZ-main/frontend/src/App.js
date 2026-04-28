import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
// On remonte au bon dossier 'components'
import ServiceDZHome from './components/ServiceDZHome.jsx';
import LoginPage from "./pages/LoginPage";
import RoleSelection from "./pages/RoleSelection";
import ClientDashboard from "./pages/ClientDashboard";
import ArtisanDashboard from "./pages/ArtisanDashboard";

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
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) { loginWithRedirect(); return null; }
  return children;
}

// ─── Redirection selon rôle en DB ─────────────────────────────────────────────
function RoleRoute() {
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [checking, setChecking] = React.useState(true);
  const [role, setRole]         = React.useState(null);

  React.useEffect(() => {
    if (!isAuthenticated || isLoading) return;
    const apiUrl = (process.env.REACT_APP_API_URL || "").replace(/\/$/, "");
    (async () => {
      try {
        const token = await getAccessTokenSilently();
        const res   = await fetch(`${apiUrl}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.ok ? await res.json() : {};
        setRole(data.role || null);
      } catch { setRole(null); }
      finally  { setChecking(false); }
    })();
  }, [isAuthenticated, isLoading]);

  if (isLoading || checking) return <LoadingScreen />;
  if (!isAuthenticated)      return <Navigate to="/login" replace />;
  if (!role)                 return <RoleSelection />;
  if (role === "client")     return <Navigate to="/dashboard/client"  replace />;
  if (role === "artisan")    return <Navigate to="/dashboard/artisan" replace />;
  return <Navigate to="/" replace />;
}

function App() {
  return (
    <Router>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <Routes>
        {/* Publiques */}
        <Route path="/"      element={<ServiceDZHome />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Sélection de rôle */}
        <Route path="/role" element={<ProtectedRoute><RoleSelection /></ProtectedRoute>} />

        {/* Auto-redirect selon rôle */}
        <Route path="/dashboard" element={<RoleRoute />} />

        {/* Dashboards */}
        <Route path="/dashboard/client"  element={<ProtectedRoute><ClientDashboard /></ProtectedRoute>} />
        <Route path="/dashboard/artisan" element={<ProtectedRoute><ArtisanDashboard /></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
