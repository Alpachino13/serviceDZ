import { useState, useEffect, useRef, useCallback } from "react";
import { FONTS, GLOBAL_CSS, Nav, NotifPanel, Toast } from "./components/Shared";
import LoginPage        from "./pages/LoginPage";
import HomePage         from "./pages/HomePage";
import ClientDashboard  from "./pages/ClientDashboard";
import ArtisanDashboard from "./pages/ArtisanDashboard";

const ICON_LINK = `https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.0.0/dist/tabler-icons.min.css`;
const BASE      = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// ── Fetch helper (no auth needed for polling) ────────────────────────────────
const apiFetch = async (url, token) => {
  const res = await fetch(`${BASE}${url}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error(res.status);
  return res.json();
};

// ── Convert a repair into a notification object ───────────────────────────────
const repairToNotif = (repair, userRole) => {
  const isArtisan = userRole === 'artisan' || userRole === 'worker';
  const typeMap = {
    pending:     { type:'demande', title: isArtisan ? 'Nouvelle demande reçue'    : 'Demande envoyée',      icon:'ti-tool' },
    accepted:    { type:'status',  title: isArtisan ? 'Vous avez accepté'         : 'Demande acceptée ✓',   icon:'ti-circle-check' },
    in_progress: { type:'status',  title: isArtisan ? 'Mission en cours'          : 'Intervention démarrée',icon:'ti-refresh' },
    done:        { type:'status',  title: isArtisan ? 'Mission terminée'          : 'Intervention terminée',icon:'ti-circle-check' },
    cancelled:   { type:'status',  title:'Demande annulée',                                                  icon:'ti-x' },
  };
  const info = typeMap[repair.status] || { type:'demande', title:'Mise à jour', icon:'ti-bell' };
  const who  = isArtisan ? repair.clientName  : repair.artisanName;
  const cat  = repair.category || '';
  const desc = `${who ? who + ' · ' : ''}${cat} — ${repair.description?.slice(0,60) || ''}`;
  const createdMs = new Date(repair.updatedAt || repair.createdAt).getTime();

  return {
    id:     `${repair._id}-${repair.status}`,
    type:   info.type,
    title:  info.title,
    desc,
    time:   timeAgo(createdMs),
    unread: (Date.now() - createdMs) < 60 * 60 * 1000, // unread if < 1h old
    _ts:    createdMs,
  };
};

const timeAgo = (ms) => {
  const s = Math.floor((Date.now() - ms) / 1000);
  if (s < 60)   return "À l'instant";
  if (s < 3600) return `Il y a ${Math.floor(s/60)} min`;
  if (s < 86400)return `Il y a ${Math.floor(s/3600)}h`;
  return `Il y a ${Math.floor(s/86400)} jours`;
};

// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [page,      setPage]      = useState("home");
  const [user,      setUser]      = useState(null);
  const [notifs,    setNotifs]    = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const [toast,     setToast]     = useState(null);
  const [search,    setSearch]    = useState("");
  const toastRef   = useRef(null);
  const pollRef    = useRef(null);
  const prevIds    = useRef(new Set());

  // ── Inject icons ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!document.getElementById("tabler-icons")) {
      const link = document.createElement("link");
      link.id = "tabler-icons"; link.rel = "stylesheet"; link.href = ICON_LINK;
      document.head.appendChild(link);
    }
  }, []);

  // ── Restore session ─────────────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    const saved = localStorage.getItem("user");
    if (token && saved) {
      try { setUser(JSON.parse(saved)); } catch {}
    }
  }, []);

  // ── Real notification polling — hits /api/repairs every 30s ─────────────────
  const pollNotifs = useCallback(async () => {
    const token = localStorage.getItem('token');
    const saved = localStorage.getItem('user');
    if (!token || !saved) return;
    let role = 'client';
    try { role = JSON.parse(saved).role; } catch {}

    try {
      const isArtisan = role === 'artisan' || role === 'worker';
      const endpoint  = isArtisan ? '/api/repairs/artisan' : '/api/repairs/mine';
      const data      = await apiFetch(endpoint, token);
      const repairs   = Array.isArray(data) ? data : [];

      const newNotifs = repairs
        .map(r => repairToNotif(r, role))
        .sort((a, b) => b._ts - a._ts)
        .slice(0, 20); // keep latest 20

      // Detect truly new items → show toast
      newNotifs.forEach(n => {
        if (!prevIds.current.has(n.id)) {
          if (prevIds.current.size > 0) {           // skip on first load
            showToast(n.title);
          }
          prevIds.current.add(n.id);
        }
      });

      setNotifs(newNotifs);
    } catch {
      // Backend unreachable — keep existing notifs silently
    }
  }, []);

  // Start polling when user logs in, stop on logout
  useEffect(() => {
    if (user) {
      pollNotifs();                          // immediate first fetch
      pollRef.current = setInterval(pollNotifs, 30_000);
    } else {
      clearInterval(pollRef.current);
      setNotifs([]);
      prevIds.current.clear();
    }
    return () => clearInterval(pollRef.current);
  }, [user, pollNotifs]);

  // ── Toast ────────────────────────────────────────────────────────────────────
  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(null), 4000);
  };

  // ── Auth ─────────────────────────────────────────────────────────────────────
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

  // ── Notification actions ──────────────────────────────────────────────────────
  const markAllRead = () => setNotifs(n => n.map(x => ({ ...x, unread:false })));
  const markOneRead = (id) => setNotifs(n => n.map(x => x.id===id ? {...x,unread:false} : x));

  // ── On new repair submitted → optimistic notif ────────────────────────────────
  const handleRepairSubmit = ({ artisan, urgency }) => {
    const n = {
      id:    `opt-${Date.now()}`,
      type:  'demande',
      title: `Demande envoyée${urgency==='urgent'?' 🔴':''}`,
      desc:  `Votre demande à ${artisan.name} a bien été transmise.`,
      time:  "À l'instant",
      unread:true,
      _ts:   Date.now(),
    };
    setNotifs(prev => [n, ...prev]);
    showToast(`Demande envoyée à ${artisan.name} !`);
    // Re-poll after 3s to get the server version
    setTimeout(pollNotifs, 3000);
  };

  const isArtisan = user && ["artisan","worker"].includes(user.role);

  return (
    <>
      <style>{FONTS}</style>
      <style>{GLOBAL_CSS}</style>

      <Nav
        page={page} setPage={setPage}
        user={user}
        notifs={notifs}
        onBell={() => setShowNotif(s => !s)}
        onLogout={handleLogout}
        search={search} setSearch={setSearch}
      />

      {/* HOME — single render, no duplicate */}
      {page === "home" && (
        <HomePage
          user={user} setPage={setPage}
          search={search}
          onRepairSubmit={handleRepairSubmit}
        />
      )}

      {/* AUTH */}
      {(page === "login" || page === "register") && (
        <LoginPage
          initTab={page === "register" ? "register" : "login"}
          onAuth={handleAuth}
          onGoHome={() => setPage("home")}
        />
      )}

      {/* DASHBOARD */}
      {page === "dashboard" && user && (
        isArtisan
          ? <ArtisanDashboard user={user} setPage={setPage} />
          : <ClientDashboard  user={user} setPage={setPage} />
      )}
      {page === "dashboard" && !user && (
        <LoginPage initTab="login" onAuth={handleAuth} onGoHome={() => setPage("home")} />
      )}

      {/* NOTIFICATIONS PANEL */}
      {showNotif && (
        <NotifPanel
          notifs={notifs}
          onClose={() => setShowNotif(false)}
          onMarkAll={markAllRead}
          onRead={markOneRead}
        />
      )}

      {toast && <Toast message={toast} />}
    </>
  );
}
