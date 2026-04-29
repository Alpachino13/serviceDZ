// src/pages/ClientDashboard.jsx

import React, { useState, useEffect } from 'react'; // Regroupé ici
import { useAuth0 } from "@auth0/auth0-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom"; // Regroupé ici aussi

const C = {
  walnut:     "#1A1410",
  anthracite: "#2C2C2A",
  anthraLt:   "#3D3D3A",
  muted:      "#888780",
  mutedLt:    "#B4B2A9",
  electric:   "#378ADD",
  electricLt: "#85B7EB",
  electricDim:"#185FA5",
  surface:    "#201B16",
  surfaceLt:  "#261F19",
  border:     "rgba(255,255,255,0.07)",
  text:       "#F1EFE8",
  textMuted:  "#B4B2A9",
  success:    "#1D9E75",
  warning:    "#EF9F27",
  danger:     "#E24B4A",
};

// ─── Status badge ──────────────────────────────────────────────────────────────
const STATUS = {
  pending:    { label: "En attente",  color: C.warning,  bg: "#EF9F2715" },
  active:     { label: "En cours",    color: C.electric, bg: "#378ADD15" },
  completed:  { label: "Terminé",     color: C.success,  bg: "#1D9E7515" },
  cancelled:  { label: "Annulé",      color: C.danger,   bg: "#E24B4A15" },
};

function StatusBadge({ status }) {
  const s = STATUS[status] || STATUS.pending;
  return (
    <span style={{ fontSize: 11, fontWeight: 700, color: s.color, background: s.bg, border: `1px solid ${s.color}30`, borderRadius: 6, padding: "3px 9px" }}>
      {s.label}
    </span>
  );
}

function SkeletonCard() {
  return (
    <motion.div animate={{ opacity: [0.4, 0.7, 0.4] }} transition={{ duration: 1.6, repeat: Infinity }}
      style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px 22px" }}
    >
      <div style={{ height: 14, width: "40%", background: C.anthraLt, borderRadius: 6, marginBottom: 10 }} />
      <div style={{ height: 12, width: "70%", background: C.anthracite, borderRadius: 6, marginBottom: 8 }} />
      <div style={{ height: 12, width: "30%", background: C.anthracite, borderRadius: 6 }} />
    </motion.div>
  );
}

// ─── Sidebar Nav ───────────────────────────────────────────────────────────────
function Sidebar({ active, setActive, user, logout }) {
  const navigate = useNavigate();
  const NAV = [
    { id: "overview",   icon: "▦",  label: "Vue d'ensemble" },
    { id: "repairs",    icon: "🔧", label: "Mes demandes" },
    { id: "favorites",  icon: "♥",  label: "Favoris" },
    { id: "history",    icon: "📋", label: "Historique" },
    { id: "settings",   icon: "⚙",  label: "Paramètres" },
  ];

  return (
    <motion.aside initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.4 }}
      style={{ width: 240, background: C.surface, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", padding: "24px 0", flexShrink: 0, minHeight: "100vh" }}
    >
      {/* Logo */}
      <div style={{ padding: "0 20px 24px", borderBottom: `1px solid ${C.border}`, marginBottom: 16, cursor: "pointer" }} onClick={() => navigate("/")}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: C.electric, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>⚙</div>
          <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-0.02em" }}>Service<span style={{ color: C.electric }}>DZ</span></span>
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: "0 12px", display: "flex", flexDirection: "column", gap: 4 }}>
        {NAV.map(item => (
          <button key={item.id} onClick={() => setActive(item.id)}
            style={{ all: "unset", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, background: active === item.id ? `${C.electric}18` : "transparent", color: active === item.id ? C.electric : C.muted, fontSize: 13, fontWeight: active === item.id ? 600 : 400, transition: "all 0.18s" }}
            onMouseEnter={e => { if (active !== item.id) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
            onMouseLeave={e => { if (active !== item.id) e.currentTarget.style.background = "transparent"; }}
          >
            <span style={{ fontSize: 15, width: 20, textAlign: "center" }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* User info */}
      <div style={{ padding: "16px 20px", borderTop: `1px solid ${C.border}`, marginTop: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          {user?.picture ? (
            <img src={user.picture} alt={user.name} style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} />
          ) : (
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.electric, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff" }}>
              {(user?.name || "U")[0].toUpperCase()}
            </div>
          )}
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.name}</p>
            <p style={{ margin: "2px 0 0", fontSize: 11, color: C.muted }}>Client</p>
          </div>
        </div>
        <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
          style={{ all: "unset", cursor: "pointer", width: "100%", boxSizing: "border-box", textAlign: "center", padding: "8px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 12, color: C.muted, transition: "all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#E24B4A50"; e.currentTarget.style.color = C.danger; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}
        >
          Déconnexion
        </button>
      </div>
    </motion.aside>
  );
}

// ─── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, color, index }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * index }}
      style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px 22px" }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <span style={{ fontSize: 11, color: C.muted, background: C.anthracite, borderRadius: 6, padding: "3px 8px" }}>Ce mois</span>
      </div>
      <p style={{ margin: "0 0 4px", fontSize: 28, fontWeight: 800, color: color || C.text, letterSpacing: "-0.03em" }}>{value}</p>
      <p style={{ margin: 0, fontSize: 12, color: C.muted }}>{label}</p>
    </motion.div>
  );
}

// ─── Repair Card ───────────────────────────────────────────────────────────────
function RepairCard({ repair, index }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 * index }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background: hovered ? C.surfaceLt : C.surface, border: `1px solid ${hovered ? C.electric + "30" : C.border}`, borderRadius: 14, padding: "18px 20px", cursor: "pointer", transition: "all 0.2s" }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
        <div>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: C.text }}>{repair.title}</p>
          <p style={{ margin: "3px 0 0", fontSize: 12, color: C.muted }}>{repair.category} · {repair.date}</p>
        </div>
        <StatusBadge status={repair.status} />
      </div>
      {repair.artisan && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", background: C.anthracite, borderRadius: 9 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.electric + "30", border: `1px solid ${C.electric}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: C.electric }}>
            {repair.artisan.initials}
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: C.text }}>{repair.artisan.name}</p>
            <p style={{ margin: 0, fontSize: 11, color: C.muted }}>{repair.artisan.specialty}</p>
          </div>
          {repair.artisan.rating && (
            <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, color: C.warning }}>★ {repair.artisan.rating}</span>
          )}
        </div>
      )}
    </motion.div>
  );
}

// ─── Favorite Card ─────────────────────────────────────────────────────────────
function FavoriteCard({ artisan, index }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 * index }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background: hovered ? C.surfaceLt : C.surface, border: `1px solid ${hovered ? artisan.color + "44" : C.border}`, borderRadius: 14, padding: "18px 20px", cursor: "pointer", transition: "all 0.2s", display: "flex", gap: 14, alignItems: "center" }}
    >
      <div style={{ width: 48, height: 48, borderRadius: "50%", background: artisan.color + "25", border: `1.5px solid ${artisan.color}50`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: artisan.color, flexShrink: 0 }}>
        {artisan.initials}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: C.text }}>{artisan.name}</p>
        <p style={{ margin: "2px 0 4px", fontSize: 12, color: C.muted }}>{artisan.specialty}</p>
        <div style={{ display: "flex", gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.warning }}>★ {artisan.rating}</span>
          <span style={{ fontSize: 11, color: C.mutedLt }}>{artisan.jobs} missions</span>
        </div>
      </div>
      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        style={{ all: "unset", cursor: "pointer", fontSize: 12, fontWeight: 600, color: C.electric, padding: "7px 14px", border: `1px solid ${C.electric}40`, borderRadius: 8 }}
      >
        Contacter
      </motion.button>
    </motion.div>
  );
}

// ─── Main Dashboard ────────────────────────────────────────────────────────────
export default function ClientDashboard() {
const { user, logout } = useAuth0();
  const [active, setActive] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ stats: [], repairs: [], favorites: [] });
  
  const location = useLocation();
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);

  // --- LOGIQUE DE RECHERCHE ---
  const triggerSearch = async (query) => {
    setIsSearching(true);
    try {
      const apiUrl = (process.env.REACT_APP_API_URL || "").replace(/\/$/, "");
      const res = await fetch(`${apiUrl}/api/recherche?q=${encodeURIComponent(query)}`, {
        headers: { "ngrok-skip-browser-warning": "true" }
      });
      const data = await res.json();
      setResults(Array.isArray(data) ? data : (data.results ?? []));
    } catch (err) {
      console.error("Erreur recherche:", err);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (location.state?.search) {
      triggerSearch(location.state.search);
    }
  }, [location.state]);

  // --- CHARGEMENT DES DONNÉES (MONGODB) ---
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const apiUrl = (process.env.REACT_APP_API_URL || "").replace(/\/$/, "");

        const response = await fetch(`${apiUrl}/api/users/workers`, {
            headers: { "ngrok-skip-browser-warning": "true" }
        });
        const dbWorkers = await response.json();

        const formattedWorkers = dbWorkers.map(w => ({
          id: w._id,
          name: w.name,
          initials: w.name.split(' ').map(n => n[0]).join('').toUpperCase(),
          specialty: `${w.specialty} · ${w.city}`,
          rating: w.rating || 5.0,
          jobs: Math.floor(Math.random() * 50) + 10,
          color: w.specialty === "Plomberie" ? "#185FA5" : w.specialty === "Électricité" ? "#0F6E56" : "#993C1D"
        }));

        setData({
          stats: [
            { icon: "🔧", label: "Demandes totales", value: "12", color: "#3B82F6" },
            { icon: "⏳", label: "En cours", value: "3", color: "#F59E0B" },
            { icon: "✅", label: "Terminées", value: "8", color: "#10B981" },
            { icon: "⭐", label: "Note moyenne", value: "4.7", color: "#EF9F27" },
          ],
          repairs: [
            { id: 1, title: "Fuite robinet cuisine", category: "Plomberie", date: "Aujourd'hui", status: "active", artisan: { name: "Karim Bensalem", initials: "KB", specialty: "Plombier", rating: 4.9, color: "#185FA5" } },
            { id: 3, title: "Peinture salon", category: "Peinture", date: "12 avril", status: "completed", artisan: { name: "Salim Ouahabi", initials: "SO", specialty: "Peintre", rating: 4.7, color: "#D4537E" } },
          ],
          favorites: formattedWorkers 
        });
      } catch (error) {
        console.error("Erreur synchronisation:", error);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  // --- LA FONCTION RENDERCONTENT (DÉFINIE À L'INTÉRIEUR) ---
  const renderContent = () => {
    if (loading) return (
      <div style={{ display: "grid", gap: 12 }}>
        {[0, 1, 2].map(i => <SkeletonCard key={i} />)}
      </div>
    );

    switch (active) {
      case "overview":
        return (
          <div>
            {/* Grille de Stats avec StatCard */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12, marginBottom: 32 }}>
              {data.stats.map((s, i) => (
                <StatCard key={i} {...s} index={i} />
              ))}
            </div>
            
            <h2 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: C.text }}>
              Demandes récentes
            </h2>
            
            <div style={{ display: "grid", gap: 10 }}>
              {data.repairs.slice(0, 3).map((r, i) => (
                <RepairCard key={r.id} repair={r} index={i} />
              ))}
            </div>
          </div>
        );

      case "favorites":
        return (
          <div>
            <h2 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 700, color: C.text }}>
              Mes artisans favoris
            </h2>
            <div style={{ display: "grid", gap: 10 }}>
              {data.favorites.map((a, i) => (
                <FavoriteCard key={a.id} artisan={a} index={i} />
              ))}
            </div>
          </div>
        );

      case "repairs":
        return (
          <div style={{ display: "grid", gap: 10 }}>
            <h2 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 700, color: C.text }}>
              Toutes mes demandes
            </h2>
            {data.repairs.map((r, i) => (
              <RepairCard key={r.id} repair={r} index={i} />
            ))}
          </div>
        );

      default:
        return <div style={{ color: C.muted }}>Section {active} en cours de développement...</div>;
    }
  };

  // --- LE RETOUR JSX ---
  return (
    <div style={{ minHeight: "100vh", background: "#1A1A1A", display: "flex", color: "#FFF" }}>
      {/* <Sidebar active={active} setActive={setActive} user={user} logout={logout} /> */}
      
      <main style={{ flex: 1, padding: "32px 40px" }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: 32 }}>
          <h1>Bonjour, {user?.name?.split(" ")[0]} 👋</h1>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={active} 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}