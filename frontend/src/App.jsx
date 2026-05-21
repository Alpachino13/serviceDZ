import { useState, useEffect, useRef } from "react";
import { FONTS, GLOBAL_CSS, Nav, NotifPanel, Toast } from "./components/Shared";
import LoginPage        from "./pages/LoginPage";
import HomePage         from "./pages/HomePage";
import ClientDashboard  from "./pages/ClientDashboard";
import ArtisanDashboard from "./pages/ArtisanDashboard";

// ─── Tabler Icons CDN (used across all pages) ─────────────────────────────────
const ICON_LINK = `https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.0.0/dist/tabler-icons.min.css`;

// ─── Seed notifications ────────────────────────────────────────────────────────
const SEED_NOTIFS = [
  { id:1, type:"status",  title:"Intervention terminée",      desc:"Khaled Bouras a marqué votre mission comme complétée.", time:"Il y a 1h",      unread:true  },
  { id:2, type:"review",  title:"Nouvel avis reçu",           desc:"Un client vous a laissé 5 étoiles — Excellent travail !",time:"Il y a 3h",      unread:true  },
  { id:3, type:"message", title:"Message de Amine Ziani",     desc:"Bonjour, je serai disponible demain à partir de 9h.",   time:"Hier",           unread:false },
  { id:4, type:"demande", title:"Demande acceptée",           desc:"Sofiane Hadj a accepté votre demande d'intervention.",  time:"Il y a 2 jours", unread:false },
];

export default function App() {
  // ── Router state ────────────────────────────────────────────────────────────
  // page: 'home' | 'login' | 'register' | 'dashboard'
  const [page,      setPage]      = useState("home");
  const [user,      setUser]      = useState(null);
  const [notifs,    setNotifs]    = useState(SEED_NOTIFS);
  const [showNotif, setShowNotif] = useState(false);
  const [toast,     setToast]     = useState(null);
  const [search,    setSearch]    = useState("");
  const toastRef = useRef(null);

  // ── Restore session on mount ─────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    const saved = localStorage.getItem("user");
    if (token && saved) {
      try { setUser(JSON.parse(saved)); } catch { /* corrupt data */ }
    }
    // Inject Tabler icon stylesheet
    if (!document.getElementById("tabler-icons")) {
      const link = document.createElement("link");
      link.id   = "tabler-icons";
      link.rel  = "stylesheet";
      link.href = ICON_LINK;
      document.head.appendChild(link);
    }
  }, []);

  // ── Toast helper ─────────────────────────────────────────────────────────────
  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(null), 4000);
  };

  // ── Auth handlers ─────────────────────────────────────────────────────────────
  const handleAuth = (userData) => {
    setUser(userData);
    setPage("dashboard");
    showToast(`Bienvenue ${userData.name?.split(" ")[0] || ""} !`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setPage("home");
    showToast("Vous avez été déconnecté.");
  };

  // ── Notification handlers ─────────────────────────────────────────────────────
  const markAllRead = () => setNotifs(n => n.map(x => ({ ...x, unread: false })));
  const markOneRead = (id) => setNotifs(n => n.map(x => x.id === id ? { ...x, unread: false } : x));

  // ── New repair submitted → push notification ──────────────────────────────────
  const handleRepairSubmit = ({ artisan, name, urgency }) => {
    const newNotif = {
      id:     Date.now(),
      type:   "demande",
      title:  `Demande envoyée${urgency === "urgent" ? " 🔴" : ""}`,
      desc:   `Votre demande à ${artisan.name} a bien été transmise.`,
      time:   "À l'instant",
      unread: true,
    };
    setNotifs(prev => [newNotif, ...prev]);
    showToast(`Demande envoyée à ${artisan.name} avec succès !`);
  };

  // ── Which dashboard to show ───────────────────────────────────────────────────
  const isArtisan = user && ["artisan", "worker"].includes(user.role);

  return (
    <>
      {/* Global styles */}
      <style>{FONTS}</style>
      <style>{GLOBAL_CSS}</style>

      {/* Shared nav — shown on every page */}
      <Nav
        page={page}
        setPage={setPage}
        user={user}
        notifs={notifs}
        onBell={() => setShowNotif(s => !s)}
        onLogout={handleLogout}
        search={search}
        setSearch={setSearch}
      />

      {/* ── Page router ── */}
      {page === "home" && (
        <HomePage
          user={user}
          setPage={setPage}
          search={search}
          onRepairSubmit={handleRepairSubmit}
        />
      )}

      {(page === "login" || page === "register") && (
        <LoginPage
          initTab={page === "register" ? "register" : "login"}
          onAuth={handleAuth}
        />
      )}

      {page === "dashboard" && user && (
        isArtisan
          ? <ArtisanDashboard user={user} setPage={setPage} />
          : <ClientDashboard  user={user} setPage={setPage} />
      )}

      {/* Redirect to login if dashboard requested without auth */}
      {page === "dashboard" && !user && (
        <LoginPage initTab="login" onAuth={handleAuth} />
      )}

      {/* Notification panel (slide-in from right) */}
      {showNotif && (
        <NotifPanel
          notifs={notifs}
          onClose={() => setShowNotif(false)}
          onMarkAll={markAllRead}
          onRead={markOneRead}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast} />}
    </>
  );
}
