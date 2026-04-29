import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

const F = "'Inter', 'Segoe UI', sans-serif";
const API = (process.env.REACT_APP_API_URL || "").replace(/\/$/, "");

const C = {
  bg:       "#111110",
  sidebar:  "#151413",
  surface:  "#1A1918",
  surfaceLt:"#1F1E1D",
  border:   "rgba(255,255,255,0.07)",
  borderLt: "rgba(255,255,255,0.12)",
  text:     "#F0EDE8",
  muted:    "#888580",
  mutedLt:  "#B0ADA8",
  electric: "#3B82F6",
  success:  "#10B981",
  warning:  "#F59E0B",
  danger:   "#EF4444",
};

const STATUS_MAP = {
  active:    { label: "En cours",   color: C.electric, bg: "#3B82F610" },
  pending:   { label: "En attente", color: C.warning,  bg: "#F59E0B10" },
  completed: { label: "Terminé",    color: C.success,  bg: "#10B98110" },
  cancelled: { label: "Annulé",     color: C.danger,   bg: "#EF444410" },
};

function Badge({ status }) {
  const s = STATUS_MAP[status] || STATUS_MAP.pending;
  return <span style={{ fontSize: 11, fontWeight: 600, color: s.color, background: s.bg, border: `1px solid ${s.color}30`, borderRadius: 5, padding: "2px 8px", fontFamily: F }}>{s.label}</span>;
}

function Skeleton() {
  return (
    <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }}
      style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px 20px" }}
    >
      <div style={{ height: 13, width: "45%", background: C.surfaceLt, borderRadius: 5, marginBottom: 10 }} />
      <div style={{ height: 11, width: "70%", background: C.sidebar, borderRadius: 5, marginBottom: 7 }} />
      <div style={{ height: 11, width: "35%", background: C.sidebar, borderRadius: 5 }} />
    </motion.div>
  );
}

function Sidebar({ active, setActive, user, logout }) {
  const navigate = useNavigate();
  return (
    <aside style={{ width: 224, background: C.sidebar, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", minHeight: "100vh", flexShrink: 0 }}>
      <div style={{ padding: "20px 16px 16px", borderBottom: `1px solid ${C.border}`, cursor: "pointer" }} onClick={() => navigate("/")}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: C.electric, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>⚙</div>
          <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.02em", fontFamily: F }}>Service<span style={{ color: C.electric }}>DZ</span></span>
        </div>
      </div>
      <nav style={{ flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", gap: 2 }}>
        {[
          { id: "overview",  icon: "⊞", label: "Vue d'ensemble" },
          { id: "repairs",   icon: "🔧", label: "Mes demandes" },
          { id: "history",   icon: "📋", label: "Historique" },
          { id: "favorites", icon: "♥",  label: "Artisans disponibles" },
          { id: "settings",  icon: "⚙",  label: "Paramètres" }
        ].map(item => (
          <button key={item.id} onClick={() => setActive(item.id)}
            style={{ all: "unset", cursor: "pointer", display: "flex", alignItems: "center", gap: 9, padding: "9px 10px", borderRadius: 8, background: active === item.id ? `${C.electric}15` : "transparent", color: active === item.id ? C.electric : C.muted, fontSize: 13, fontWeight: active === item.id ? 600 : 400, transition: "all 0.15s", fontFamily: F }}
            onMouseEnter={e => { if (active !== item.id) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = C.text; }}
            onMouseLeave={e => { if (active !== item.id) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.muted; } }}
          >
            <span style={{ width: 18, textAlign: "center", fontSize: 14 }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      <div style={{ padding: "12px 16px 16px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${C.electric}25`, border: `1px solid ${C.electric}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: C.electric, flexShrink: 0 }}>
            {(user?.name || "U")[0].toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: F }}>{user?.name || "Utilisateur"}</p>
            <p style={{ margin: 0, fontSize: 11, color: C.muted, fontFamily: F }}>Client</p>
          </div>
        </div>
        <button onClick={() => logout({ logoutParams: { returnTo: "/" } })}
          style={{ all: "unset", cursor: "pointer", width: "100%", boxSizing: "border-box", textAlign: "center", padding: "7px", borderRadius: 7, border: `1px solid ${C.border}`, fontSize: 12, color: C.muted, fontFamily: F, transition: "all 0.15s" }}
        >Déconnexion</button>
      </div>
    </aside>
  );
}

function StatCard({ icon, label, value, color, i }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
      style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px 20px" }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, display: "block" }} />
      </div>
      <p style={{ margin: "0 0 3px", fontSize: 26, fontWeight: 700, color: C.text, letterSpacing: "-0.03em", fontFamily: F }}>{value}</p>
      <p style={{ margin: 0, fontSize: 12, color: C.muted, fontFamily: F }}>{label}</p>
    </motion.div>
  );
}

function RepairCard({ r, i }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: hov ? C.surfaceLt : C.surface, border: `1px solid ${hov ? C.borderLt : C.border}`, borderRadius: 12, padding: "16px 18px", transition: "all 0.15s", cursor: "pointer" }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: r.artisan ? 10 : 0 }}>
        <div>
          <p style={{ margin: "0 0 3px", fontSize: 14, fontWeight: 600, color: C.text, fontFamily: F }}>{r.title}</p>
          <p style={{ margin: 0, fontSize: 12, color: C.muted, fontFamily: F }}>{r.category} · {r.date}</p>
        </div>
        <Badge status={r.status} />
      </div>
      {r.artisan && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 11px", background: C.sidebar, borderRadius: 8, marginTop: 8 }}>
          <div style={{ width: 26, height: 26, borderRadius: "50%", background: r.artisan.color + "25", border: `1px solid ${r.artisan.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: r.artisan.color }}>
            {r.artisan.initials}
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: C.text, fontFamily: F }}>{r.artisan.name}</p>
            <p style={{ margin: 0, fontSize: 11, color: C.muted, fontFamily: F }}>{r.artisan.specialty}</p>
          </div>
          {r.artisan.rating && <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, color: C.warning, fontFamily: F }}>
            {r.artisan.rating === "Nouveau" ? "Nouveau" : `★ ${r.artisan.rating}`}
          </span>}
        </div>
      )}
    </motion.div>
  );
}

function ArtisanCard({ a, i }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: hov ? C.surfaceLt : C.surface, border: `1px solid ${hov ? a.color + "40" : C.border}`, borderRadius: 12, padding: "14px 16px", display: "flex", gap: 12, alignItems: "center", transition: "all 0.15s" }}
    >
      <div style={{ width: 42, height: 42, borderRadius: "50%", background: a.color + "20", border: `1.5px solid ${a.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: a.color, flexShrink: 0 }}>
        {a.initials}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 600, color: C.text, fontFamily: F }}>{a.name}</p>
        <p style={{ margin: "0 0 6px", fontSize: 11, color: C.muted, fontFamily: F }}>{a.specialty}</p>
        <div style={{ display: "flex", gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: C.warning, fontFamily: F }}>
            {a.rating === "Nouveau" ? "Nouveau" : `★ ${a.rating}`}
          </span>
          <span style={{ fontSize: 11, color: C.muted, fontFamily: F }}>{a.jobs} missions</span>
        </div>
      </div>
      <button style={{ all: "unset", cursor: "pointer", fontSize: 12, fontWeight: 600, color: C.electric, padding: "6px 12px", border: `1px solid ${C.electric}40`, borderRadius: 7, fontFamily: F }}>
        Contacter
      </button>
    </motion.div>
  );
}

export default function ClientDashboard() {
  const { user, logout }  = useAuth();
  const location          = useLocation();
  const [active, setActive] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [data, setData]   = useState({ stats: [], repairs: [], favorites: [] });
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (location.state?.search) triggerSearch(location.state.search);
  }, [location.state]);

  const triggerSearch = async (q) => {
    setSearching(true);
    try {
      const res = await fetch(`${API}/api/users/workers`, { headers: { "ngrok-skip-browser-warning": "true" } });
      const dbWorkers = await res.json();
      
      const keyword = q.toLowerCase();
      const filtered = dbWorkers.filter(w => 
        (w.specialty && w.specialty.toLowerCase().includes(keyword)) ||
        (w.city && w.city.toLowerCase().includes(keyword)) ||
        (w.name && w.name.toLowerCase().includes(keyword))
      );

      const COLORS = ["#185FA5", "#0F6E56", "#993C1D", "#7C3AED", "#B45309"];
      const formatted = filtered.map((w, idx) => ({
        id: w._id || idx, 
        name: w.name,
        initials: w.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "??",
        specialty: `${w.specialty || "Artisan"} · ${w.city || "Tlemcen"}`,
        rating: w.rating ? w.rating : "Nouveau",
        jobs: w.jobs || 0,
        color: COLORS[idx % COLORS.length],
      }));
      setSearchResults(formatted);
    } catch { setSearchResults([]); }
    finally { setSearching(false); }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("sdz_token");
        const headers = { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }), "ngrok-skip-browser-warning": "true" };

        const workersRes = await fetch(`${API}/api/users/workers`, { headers });
        const workers = workersRes.ok ? await workersRes.json() : [];
        const COLORS = ["#185FA5", "#0F6E56", "#993C1D", "#7C3AED", "#B45309"];

        const favorites = workers.map((w, idx) => ({
          id: w._id || idx, 
          name: w.name,
          initials: w.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "??",
          specialty: `${w.specialty || "Artisan"} · ${w.city || "Tlemcen"}`,
          rating: w.rating ? w.rating : "Nouveau", // Commence à zéro
          jobs: w.jobs || 0,                       // Commence à zéro
          color: COLORS[idx % COLORS.length],
        }));

        setData({
          stats: [
            { icon: "🔧", label: "Demandes totales", value: "12", color: C.electric },
            { icon: "⏳", label: "En cours",          value: "3",  color: C.warning  },
            { icon: "✅", label: "Terminées",         value: "8",  color: C.success  },
            { icon: "⭐", label: "Note moyenne",      value: "4.7", color: C.warning  },
          ],
          repairs: [
            { id: 1, title: "Fuite robinet cuisine",    category: "Plomberie",   date: "Aujourd'hui", status: "active",    artisan: { name: "Karim Bensalem", initials: "KB", specialty: "Plombier",  rating: 4.9, color: "#185FA5" } },
            { id: 2, title: "Panne tableau électrique", category: "Électricité", date: "Hier",        status: "pending",   artisan: null },
          ],
          favorites,
        });
      } catch (e) { console.error(e); } 
      finally { setLoading(false); }
    };
    load();
  }, []);

  const renderContent = () => {
    if (loading) return <div style={{ display: "grid", gap: 10 }}>{[0,1,2,3].map(i => <Skeleton key={i} />)}</div>;

    switch (active) {
      case "overview": return (
        <div>
          {searchResults.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: C.text, fontFamily: F }}>Résultats de recherche</h2>
                <button onClick={() => setSearchResults([])} style={{ all: "unset", cursor: "pointer", fontSize: 11, color: C.muted, fontFamily: F }}>Effacer</button>
              </div>
              <div style={{ display: "grid", gap: 8 }}>
                {searchResults.map((a, i) => <ArtisanCard key={i} a={a} i={i} />)}
              </div>
              <hr style={{ border: "none", borderTop: `1px solid ${C.border}`, margin: "24px 0" }} />
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10, marginBottom: 28 }}>
            {data.stats.map((s, i) => <StatCard key={i} {...s} i={i} />)}
          </div>
          <h2 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 600, color: C.text, fontFamily: F }}>Demandes récentes</h2>
          <div style={{ display: "grid", gap: 8 }}>
            {data.repairs.slice(0, 3).map((r, i) => <RepairCard key={r.id} r={r} i={i} />)}
          </div>
        </div>
      );
      case "repairs": return (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: C.text, fontFamily: F }}>Toutes mes demandes</h2>
            <button style={{ all: "unset", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#fff", padding: "8px 16px", background: C.electric, borderRadius: 8, fontFamily: F }}>+ Nouvelle demande</button>
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            {data.repairs.map((r, i) => <RepairCard key={r.id} r={r} i={i} />)}
          </div>
        </div>
      );
      case "history": return (
        <div>
          <h2 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 600, color: C.text, fontFamily: F }}>Historique des réparations</h2>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {["Tout", "Terminé", "Annulé"].map(f => <button key={f} style={{ all: "unset", cursor: "pointer", fontSize: 12, padding: "6px 12px", borderRadius: 7, border: `1px solid ${C.border}`, color: C.muted, fontFamily: F }}>{f}</button>)}
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            {data.repairs.filter(r => r.status === "completed" || r.status === "cancelled").map((r, i) => <RepairCard key={r.id} r={r} i={i} />)}
          </div>
        </div>
      );
      case "favorites": return (
        <div>
          <h2 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 600, color: C.text, fontFamily: F }}>Artisans disponibles</h2>
          {searching && <p style={{ color: C.muted, fontSize: 13, fontFamily: F }}>Recherche en cours…</p>}
          <div style={{ display: "grid", gap: 8 }}>
            {data.favorites.length > 0
              ? data.favorites.map((a, i) => <ArtisanCard key={a.id} a={a} i={i} />)
              : <p style={{ color: C.muted, fontSize: 13, fontFamily: F, textAlign: "center", padding: "40px 0" }}>Aucun artisan trouvé.</p>
            }
          </div>
        </div>
      );
      case "settings": return (
        <div style={{ maxWidth: 440 }}>
          <h2 style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 600, color: C.text, fontFamily: F }}>Paramètres du compte</h2>
          {[
            { label: "Nom complet", value: user?.name,  type: "text"  },
            { label: "Email",       value: user?.email, type: "email" },
            { label: "Téléphone",   value: "",          type: "tel"   },
            { label: "Ville",       value: "Tlemcen",   type: "text"  },
          ].map(f => (
            <div key={f.label} style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 5, fontFamily: F }}>{f.label}</label>
              <input type={f.type} defaultValue={f.value}
                style={{ width: "100%", boxSizing: "border-box", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 9, padding: "11px 13px", fontSize: 13, color: C.text, outline: "none", fontFamily: F }}
                onFocus={e => e.target.style.borderColor = C.electric}
                onBlur={e => e.target.style.borderColor = C.border}
              />
            </div>
          ))}
          <button style={{ all: "unset", cursor: "pointer", marginTop: 6, fontSize: 13, fontWeight: 600, color: "#fff", padding: "11px 24px", background: C.electric, borderRadius: 9, fontFamily: F }}>Sauvegarder</button>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", fontFamily: F, color: C.text }}>
      <Sidebar active={active} setActive={setActive} user={user} logout={logout} />
      <main style={{ flex: 1, padding: "clamp(16px, 4vw, 36px)", overflowY: "auto", minWidth: 0, boxSizing: "border-box" }}>
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
          <h1 style={{ margin: "0 0 3px", fontSize: "clamp(18px, 5vw, 22px)", fontWeight: 700, letterSpacing: "-0.02em", fontFamily: F }}>
            Bonjour, {user?.name?.split(" ")[0] || "là"} 👋
          </h1>
          <p style={{ margin: 0, fontSize: "clamp(11px, 3vw, 12px)", color: C.muted, fontFamily: F }}>
            {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}