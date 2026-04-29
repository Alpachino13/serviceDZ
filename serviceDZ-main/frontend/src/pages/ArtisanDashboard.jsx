// src/pages/ArtisanDashboard.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

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
  new:        { label: "Nouvelle",  color: C.electric, bg: "#3B82F610" },
  accepted:   { label: "Acceptée", color: C.success,  bg: "#10B98110" },
  inprogress: { label: "En cours", color: C.warning,  bg: "#F59E0B10" },
  completed:  { label: "Terminée", color: C.muted,    bg: "#88858010" },
  declined:   { label: "Refusée",  color: C.danger,   bg: "#EF444410" },
};

function Badge({ status }) {
  const s = STATUS_MAP[status] || STATUS_MAP.new;
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

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const NAV = [
  { id: "overview",  icon: "⊞",  label: "Vue d'ensemble" },
  { id: "missions",  icon: "📋", label: "Missions" },
  { id: "history",   icon: "🕐", label: "Historique" },
  { id: "revenue",   icon: "💰", label: "Revenus" },
  { id: "reviews",   icon: "⭐", label: "Avis clients" },
  { id: "profile",   icon: "👤", label: "Mon profil" },
  { id: "settings",  icon: "⚙",  label: "Paramètres" },
];

function Sidebar({ active, setActive, user, logout }) {
  const navigate = useNavigate();
  return (
    <aside style={{ width: 224, background: C.sidebar, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", minHeight: "100vh", flexShrink: 0 }}>
      <div style={{ padding: "20px 16px 16px", borderBottom: `1px solid ${C.border}`, cursor: "pointer" }} onClick={() => navigate("/")}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: C.success, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>🔧</div>
          <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.02em", fontFamily: F }}>Service<span style={{ color: C.success }}>DZ</span></span>
        </div>
        <span style={{ display: "inline-block", marginTop: 5, fontSize: 10, fontWeight: 600, color: C.success, background: `${C.success}18`, border: `1px solid ${C.success}35`, borderRadius: 4, padding: "2px 7px", letterSpacing: "0.06em", fontFamily: F }}>ARTISAN</span>
      </div>

      <nav style={{ flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", gap: 2 }}>
        {NAV.map(item => (
          <button key={item.id} onClick={() => setActive(item.id)}
            style={{ all: "unset", cursor: "pointer", display: "flex", alignItems: "center", gap: 9, padding: "9px 10px", borderRadius: 8, background: active === item.id ? `${C.success}15` : "transparent", color: active === item.id ? C.success : C.muted, fontSize: 13, fontWeight: active === item.id ? 600 : 400, transition: "all 0.15s", fontFamily: F }}
            onMouseEnter={e => { if (active !== item.id) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = C.text; } }}
            onMouseLeave={e => { if (active !== item.id) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.muted; } }}
          >
            <span style={{ width: 18, textAlign: "center", fontSize: 14 }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div style={{ padding: "12px 16px 16px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${C.success}20`, border: `1px solid ${C.success}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: C.success, flexShrink: 0 }}>
            {(user?.name || "A")[0].toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: F }}>{user?.name || "Artisan"}</p>
            <p style={{ margin: 0, fontSize: 11, color: C.success, fontFamily: F }}>✓ Vérifié</p>
          </div>
        </div>
        <button onClick={() => logout({ logoutParams: { returnTo: "/" } })}
          style={{ all: "unset", cursor: "pointer", width: "100%", boxSizing: "border-box", textAlign: "center", padding: "7px", borderRadius: 7, border: `1px solid ${C.border}`, fontSize: 12, color: C.muted, fontFamily: F, transition: "all 0.15s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = `${C.danger}50`; e.currentTarget.style.color = C.danger; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}
        >Déconnexion</button>
      </div>
    </aside>
  );
}

function StatCard({ icon, label, value, sub, color, i }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
      style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px 20px" }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        {sub && <span style={{ fontSize: 10, fontWeight: 600, color: C.success, background: `${C.success}15`, borderRadius: 4, padding: "2px 6px", fontFamily: F }}>{sub}</span>}
      </div>
      <p style={{ margin: "0 0 3px", fontSize: 26, fontWeight: 700, color: C.text, letterSpacing: "-0.03em", fontFamily: F }}>{value}</p>
      <p style={{ margin: 0, fontSize: 12, color: C.muted, fontFamily: F }}>{label}</p>
    </motion.div>
  );
}

function MissionCard({ m, i, onAccept, onDecline }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: hov ? C.surfaceLt : C.surface, border: `1px solid ${hov ? C.success + "35" : C.border}`, borderRadius: 12, padding: "16px 18px", transition: "all 0.15s" }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 8 }}>
        <div>
          <p style={{ margin: "0 0 3px", fontSize: 14, fontWeight: 600, color: C.text, fontFamily: F }}>{m.title}</p>
          <p style={{ margin: 0, fontSize: 12, color: C.muted, fontFamily: F }}>{m.category} · {m.location} · {m.date}</p>
        </div>
        <Badge status={m.status} />
      </div>
      <p style={{ margin: "0 0 12px", fontSize: 12, color: C.mutedLt, lineHeight: 1.55, fontFamily: F }}>{m.description}</p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", gap: 7 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: C.text, background: C.sidebar, borderRadius: 6, padding: "3px 9px", fontFamily: F }}>💰 {m.budget}</span>
          <span style={{ fontSize: 12, color: C.muted, background: C.sidebar, borderRadius: 6, padding: "3px 9px", fontFamily: F }}>📍 {m.distance}</span>
        </div>
        {m.status === "new" && (
          <div style={{ display: "flex", gap: 7 }}>
            <button onClick={() => onDecline(m.id)} style={{ all: "unset", cursor: "pointer", fontSize: 12, color: C.danger, padding: "5px 11px", border: `1px solid ${C.danger}40`, borderRadius: 6, fontFamily: F }}>Refuser</button>
            <button onClick={() => onAccept(m.id)}  style={{ all: "unset", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#fff", padding: "5px 13px", background: C.success, borderRadius: 6, fontFamily: F }}>Accepter</button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function ReviewCard({ r, i }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
      style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 18px" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: C.surfaceLt, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: C.mutedLt, flexShrink: 0 }}>
          {r.client[0]}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: C.text, fontFamily: F }}>{r.client}</p>
          <p style={{ margin: "1px 0 0", fontSize: 11, color: C.muted, fontFamily: F }}>{r.service} · {r.date}</p>
        </div>
        <div style={{ display: "flex", gap: 1 }}>
          {[1,2,3,4,5].map(s => <span key={s} style={{ fontSize: 12, color: s <= r.rating ? C.warning : C.sidebar }}>★</span>)}
        </div>
      </div>
      <p style={{ margin: 0, fontSize: 12, color: C.mutedLt, lineHeight: 1.6, fontStyle: "italic", fontFamily: F }}>"{r.comment}"</p>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ArtisanDashboard() {
  const { user, logout } = useAuth();
  const [active, setActive] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("sdz_token");
        const headers = { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }), "ngrok-skip-browser-warning": "true" };

        // Fetch missions depuis l'API si disponible
        let missions = [];
        let revenue  = { total: "0 DA", months: ["Jan","Fév","Mar","Avr","Mai"], values: [0,0,0,0,0] };
        let reviews  = [];

        try {
          const [missionsRes, revenueRes, reviewsRes] = await Promise.allSettled([
            fetch(`${API}/api/missions`, { headers }),
            fetch(`${API}/api/revenue`,  { headers }),
            fetch(`${API}/api/reviews`,  { headers }),
          ]);
          if (missionsRes.status === "fulfilled" && missionsRes.value.ok) missions = await missionsRes.value.json();
          if (revenueRes.status  === "fulfilled" && revenueRes.value.ok)  revenue  = await revenueRes.value.json();
          if (reviewsRes.status  === "fulfilled" && reviewsRes.value.ok)  reviews  = await reviewsRes.value.json();
        } catch { /* utilise les données mock si l'API échoue */ }

        // Données mock si API vide
        if (!missions.length) missions = [
          { id: 1, title: "Fuite robinet urgente",         category: "Plomberie",    location: "Tlemcen Centre", date: "Aujourd'hui", status: "new",        description: "Fuite importante sous l'évier, intervention urgente.",     budget: "2 500 DA", distance: "1.2 km" },
          { id: 2, title: "Installation prise électrique", category: "Électricité",  location: "Bel Air",        date: "Demain",      status: "accepted",   description: "Ajout de 3 prises dans le salon.",                         budget: "3 000 DA", distance: "2.8 km" },
          { id: 3, title: "Réparation chauffe-eau",        category: "Plomberie",    location: "Mansourah",      date: "12 avr.",     status: "inprogress", description: "Chauffe-eau en panne, diagnostic et réparation.",           budget: "4 000 DA", distance: "5.1 km" },
          { id: 4, title: "Débouchage canalisation",       category: "Plomberie",    location: "Tlemcen",        date: "8 avr.",      status: "completed",  description: "Canalisation bouchée en salle de bain.",                   budget: "1 800 DA", distance: "0.8 km" },
          { id: 5, title: "Remplacement robinet",          category: "Plomberie",    location: "Bel Air",        date: "2 avr.",      status: "completed",  description: "Remplacement robinet mélangeur cuisine.",                  budget: "2 200 DA", distance: "3.5 km" },
        ];
        if (!reviews.length) reviews = [
          { id: 1, client: "Amira B.",  service: "Plomberie",  date: "Hier",     rating: 5, comment: "Intervention rapide et efficace, très professionnel !" },
          { id: 2, client: "Mehdi R.",  service: "Plomberie",  date: "12 avr.",  rating: 5, comment: "Excellent travail, ponctuel et soigné. Prix raisonnable." },
          { id: 3, client: "Fatima K.", service: "Réparation", date: "5 avr.",   rating: 4, comment: "Bon travail dans l'ensemble, très satisfaite." },
        ];
        if (!revenue.values) revenue = { total: "42 500 DA", months: ["Jan","Fév","Mar","Avr","Mai"], values: [8500, 12000, 6500, 9000, 6500] };

        const completed = missions.filter(m => m.status === "completed").length;
        const total     = missions.length;

        setData({
          stats: [
            { icon: "📋", label: "Missions ce mois",   value: String(total),     sub: `+${missions.filter(m=>m.status==="new").length} nouvelles`, color: C.electric },
            { icon: "💰", label: "Revenus ce mois",    value: revenue.total,     sub: "+12%",      color: C.success },
            { icon: "⭐", label: "Note moyenne",        value: "4.8",             sub: "Excellent", color: C.warning  },
            { icon: "✅", label: "Taux de complétion", value: total ? `${Math.round(completed/total*100)}%` : "—", sub: "↑", color: C.success },
          ],
          missions, reviews, revenue,
        });
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const accept  = id => setData(d => ({ ...d, missions: d.missions.map(m => m.id === id ? { ...m, status: "accepted"  } : m) }));
  const decline = id => setData(d => ({ ...d, missions: d.missions.map(m => m.id === id ? { ...m, status: "declined"  } : m) }));

  const renderContent = () => {
    if (loading) return <div style={{ display: "grid", gap: 10 }}>{[0,1,2,3].map(i => <Skeleton key={i} />)}</div>;
    if (!data)   return <p style={{ color: C.muted, fontFamily: F }}>Erreur de chargement.</p>;

    switch (active) {
      case "overview": return (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10, marginBottom: 28 }}>
            {data.stats.map((s, i) => <StatCard key={i} {...s} i={i} />)}
          </div>
          <h2 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 600, color: C.text, fontFamily: F }}>Nouvelles demandes</h2>
          <div style={{ display: "grid", gap: 8 }}>
            {data.missions.filter(m => m.status === "new" || m.status === "accepted").slice(0, 3).map((m, i) => (
              <MissionCard key={m.id} m={m} i={i} onAccept={accept} onDecline={decline} />
            ))}
            {data.missions.filter(m => m.status === "new").length === 0 && (
              <p style={{ color: C.muted, fontSize: 13, fontFamily: F, padding: "20px 0" }}>Aucune nouvelle demande.</p>
            )}
          </div>
        </div>
      );

      case "missions": return (
        <div>
          <h2 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 600, color: C.text, fontFamily: F }}>Toutes mes missions</h2>
          {/* Filtres */}
          <div style={{ display: "flex", gap: 7, marginBottom: 14, flexWrap: "wrap" }}>
            {Object.entries(STATUS_MAP).map(([k, v]) => (
              <span key={k} style={{ fontSize: 11, fontWeight: 600, color: v.color, background: v.bg, border: `1px solid ${v.color}30`, borderRadius: 5, padding: "3px 9px", cursor: "pointer", fontFamily: F }}>
                {v.label} ({data.missions.filter(m => m.status === k).length})
              </span>
            ))}
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            {data.missions.map((m, i) => <MissionCard key={m.id} m={m} i={i} onAccept={accept} onDecline={decline} />)}
          </div>
        </div>
      );

      case "history": return (
        <div>
          <h2 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 600, color: C.text, fontFamily: F }}>Historique des missions</h2>
          <div style={{ display: "grid", gap: 8 }}>
            {data.missions.filter(m => m.status === "completed" || m.status === "declined").map((m, i) => (
              <MissionCard key={m.id} m={m} i={i} onAccept={accept} onDecline={decline} />
            ))}
            {data.missions.filter(m => m.status === "completed").length === 0 && (
              <p style={{ color: C.muted, fontSize: 13, fontFamily: F, textAlign: "center", padding: "40px 0" }}>Aucune mission terminée pour l'instant.</p>
            )}
          </div>
        </div>
      );

      case "revenue": return (
        <div>
          <h2 style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 600, color: C.text, fontFamily: F }}>Revenus</h2>
          {/* Total cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px 20px" }}>
              <p style={{ margin: "0 0 4px", fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: F }}>Ce mois</p>
              <p style={{ margin: 0, fontSize: 26, fontWeight: 700, color: C.success, fontFamily: F }}>{data.revenue.total}</p>
            </div>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px 20px" }}>
              <p style={{ margin: "0 0 4px", fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: F }}>Total 2025</p>
              <p style={{ margin: 0, fontSize: 26, fontWeight: 700, color: C.text, fontFamily: F }}>186 000 DA</p>
            </div>
          </div>
          {/* Graphe barres */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px 22px" }}>
            <p style={{ margin: "0 0 18px", fontSize: 13, fontWeight: 600, color: C.text, fontFamily: F }}>Évolution mensuelle</p>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 110 }}>
              {data.revenue.values.map((val, i) => {
                const max = Math.max(...data.revenue.values, 1);
                const pct = (val / max) * 100;
                const isLast = i === data.revenue.values.length - 1;
                return (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                    <span style={{ fontSize: 10, color: C.muted, fontFamily: F }}>{val > 0 ? `${(val/1000).toFixed(0)}k` : ""}</span>
                    <motion.div initial={{ height: 0 }} animate={{ height: `${pct}%` }} transition={{ delay: i * 0.07, duration: 0.5, ease: "easeOut" }}
                      style={{ width: "100%", background: isLast ? C.success : `${C.success}50`, borderRadius: "5px 5px 0 0", minHeight: 4 }}
                    />
                    <span style={{ fontSize: 10, color: C.muted, fontFamily: F }}>{data.revenue.months[i]}</span>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Détail par mission */}
          <div style={{ marginTop: 20 }}>
            <p style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 600, color: C.text, fontFamily: F }}>Missions terminées</p>
            <div style={{ display: "grid", gap: 7 }}>
              {data.missions.filter(m => m.status === "completed").map((m, i) => (
                <div key={m.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10 }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: C.text, fontFamily: F }}>{m.title}</p>
                    <p style={{ margin: "2px 0 0", fontSize: 11, color: C.muted, fontFamily: F }}>{m.date} · {m.location}</p>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.success, fontFamily: F }}>{m.budget}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

      case "reviews": return (
        <div>
          {/* Résumé */}
          <div style={{ display: "flex", gap: 16, padding: "16px 20px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, marginBottom: 16, alignItems: "center" }}>
            <div style={{ textAlign: "center", flexShrink: 0 }}>
              <p style={{ margin: 0, fontSize: 36, fontWeight: 800, color: C.warning, fontFamily: F }}>4.8</p>
              <div style={{ display: "flex", gap: 2, justifyContent: "center", margin: "4px 0" }}>
                {[1,2,3,4,5].map(s => <span key={s} style={{ fontSize: 13, color: s <= 4 ? C.warning : C.sidebar }}>★</span>)}
              </div>
              <p style={{ margin: 0, fontSize: 11, color: C.muted, fontFamily: F }}>{data.reviews.length} avis</p>
            </div>
            <div style={{ flex: 1 }}>
              {[5,4,3,2,1].map(star => {
                const count = data.reviews.filter(r => r.rating === star).length;
                const pct   = data.reviews.length ? (count / data.reviews.length) * 100 : 0;
                return (
                  <div key={star} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                    <span style={{ fontSize: 11, color: C.muted, width: 8, fontFamily: F }}>{star}</span>
                    <div style={{ flex: 1, height: 5, background: C.surfaceLt, borderRadius: 3, overflow: "hidden" }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: star * 0.05, duration: 0.4 }}
                        style={{ height: "100%", background: C.warning, borderRadius: 3 }} />
                    </div>
                    <span style={{ fontSize: 11, color: C.muted, width: 16, textAlign: "right", fontFamily: F }}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            {data.reviews.map((r, i) => <ReviewCard key={r.id} r={r} i={i} />)}
          </div>
        </div>
      );

      case "profile": return (
        <div style={{ maxWidth: 520 }}>
          <h2 style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 600, color: C.text, fontFamily: F }}>Mon profil public</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 20px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, marginBottom: 20 }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: `${C.success}22`, border: `2px solid ${C.success}45`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800, color: C.success }}>
              {(user?.name || "A")[0]}
            </div>
            <div>
              <p style={{ margin: "0 0 5px", fontSize: 17, fontWeight: 700, color: C.text, fontFamily: F }}>{user?.name}</p>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 11, color: C.success, background: `${C.success}15`, border: `1px solid ${C.success}30`, borderRadius: 5, padding: "2px 7px", fontFamily: F }}>✓ Vérifié</span>
                <span style={{ fontSize: 11, color: C.warning, fontFamily: F }}>★ 4.8</span>
                <span style={{ fontSize: 11, color: C.muted, fontFamily: F }}>{data.missions.filter(m => m.status === "completed").length} missions terminées</span>
              </div>
            </div>
          </div>
          {[
            { label: "Spécialité",         value: "Plomberie",               type: "text"     },
            { label: "Description",        value: "Artisan plombier avec 8 ans d'expérience à Tlemcen.", type: "textarea" },
            { label: "Téléphone",          value: "+213 XXX XXX XXX",        type: "tel"      },
            { label: "Zone d'intervention",value: "Tlemcen et environs 30km", type: "text"    },
            { label: "Tarif horaire",      value: "800 DA/h",                type: "text"     },
          ].map(f => (
            <div key={f.label} style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 5, fontFamily: F }}>{f.label}</label>
              {f.type === "textarea"
                ? <textarea defaultValue={f.value} rows={3} style={{ width: "100%", boxSizing: "border-box", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 9, padding: "11px 13px", fontSize: 13, color: C.text, outline: "none", fontFamily: F, resize: "vertical" }} onFocus={e => e.target.style.borderColor = C.success} onBlur={e => e.target.style.borderColor = C.border} />
                : <input type={f.type} defaultValue={f.value} style={{ width: "100%", boxSizing: "border-box", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 9, padding: "11px 13px", fontSize: 13, color: C.text, outline: "none", fontFamily: F }} onFocus={e => e.target.style.borderColor = C.success} onBlur={e => e.target.style.borderColor = C.border} />
              }
            </div>
          ))}
          <button style={{ all: "unset", cursor: "pointer", marginTop: 6, fontSize: 13, fontWeight: 600, color: "#fff", padding: "11px 24px", background: C.success, borderRadius: 9, fontFamily: F }}>Mettre à jour</button>
        </div>
      );

      case "settings": return (
        <div style={{ maxWidth: 440 }}>
          <h2 style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 600, color: C.text, fontFamily: F }}>Paramètres du compte</h2>
          {[
            { label: "Nom complet", value: user?.name,  type: "text"  },
            { label: "Email",       value: user?.email, type: "email" },
            { label: "Téléphone",   value: "",          type: "tel"   },
          ].map(f => (
            <div key={f.label} style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 5, fontFamily: F }}>{f.label}</label>
              <input type={f.type} defaultValue={f.value} style={{ width: "100%", boxSizing: "border-box", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 9, padding: "11px 13px", fontSize: 13, color: C.text, outline: "none", fontFamily: F }} onFocus={e => e.target.style.borderColor = C.success} onBlur={e => e.target.style.borderColor = C.border} />
            </div>
          ))}
          <button style={{ all: "unset", cursor: "pointer", marginTop: 6, fontSize: 13, fontWeight: 600, color: "#fff", padding: "11px 24px", background: C.success, borderRadius: 9, fontFamily: F }}>Sauvegarder</button>
        </div>
      );

      default: return null;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", fontFamily: F, color: C.text }}>
      <Sidebar active={active} setActive={setActive} user={user} logout={logout} />
      <main style={{ flex: 1, padding: "28px 36px", overflowY: "auto", minWidth: 0 }}>
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
          <h1 style={{ margin: "0 0 3px", fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", fontFamily: F }}>
            Bonjour, {user?.name?.split(" ")[0] || "là"} 🔧
          </h1>
          <p style={{ margin: 0, fontSize: 12, color: C.muted, fontFamily: F }}>
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
