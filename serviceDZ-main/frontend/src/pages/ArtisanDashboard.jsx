// src/pages/ArtisanDashboard.jsx

import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

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

const STATUS = {
  new:        { label: "Nouvelle",    color: C.electric, bg: "#378ADD15" },
  accepted:   { label: "Acceptée",    color: C.success,  bg: "#1D9E7515" },
  inprogress: { label: "En cours",    color: C.warning,  bg: "#EF9F2715" },
  completed:  { label: "Terminée",    color: C.muted,    bg: "#88878015" },
  declined:   { label: "Refusée",     color: C.danger,   bg: "#E24B4A15" },
};

function StatusBadge({ status }) {
  const s = STATUS[status] || STATUS.new;
  return <span style={{ fontSize: 11, fontWeight: 700, color: s.color, background: s.bg, border: `1px solid ${s.color}30`, borderRadius: 6, padding: "3px 9px" }}>{s.label}</span>;
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

function Sidebar({ active, setActive, user, logout }) {
  const navigate = useNavigate();
  const NAV = [
    { id: "overview",  icon: "▦",  label: "Vue d'ensemble" },
    { id: "missions",  icon: "📋", label: "Mes missions" },
    { id: "profile",   icon: "👤", label: "Mon profil" },
    { id: "reviews",   icon: "⭐", label: "Avis clients" },
    { id: "revenue",   icon: "💰", label: "Revenus" },
    { id: "settings",  icon: "⚙",  label: "Paramètres" },
  ];

  return (
    <motion.aside initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.4 }}
      style={{ width: 240, background: C.surface, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", padding: "24px 0", flexShrink: 0, minHeight: "100vh" }}
    >
      <div style={{ padding: "0 20px 24px", borderBottom: `1px solid ${C.border}`, marginBottom: 16, cursor: "pointer" }} onClick={() => navigate("/")}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: C.success, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🔧</div>
          <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-0.02em" }}>Service<span style={{ color: C.success }}>DZ</span></span>
        </div>
        <span style={{ display: "inline-block", marginTop: 6, fontSize: 10, fontWeight: 700, color: C.success, background: `${C.success}20`, border: `1px solid ${C.success}40`, borderRadius: 4, padding: "2px 7px", letterSpacing: "0.06em" }}>ARTISAN</span>
      </div>

      <nav style={{ flex: 1, padding: "0 12px", display: "flex", flexDirection: "column", gap: 4 }}>
        {NAV.map(item => (
          <button key={item.id} onClick={() => setActive(item.id)}
            style={{ all: "unset", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, background: active === item.id ? `${C.success}18` : "transparent", color: active === item.id ? C.success : C.muted, fontSize: 13, fontWeight: active === item.id ? 600 : 400, transition: "all 0.18s" }}
            onMouseEnter={e => { if (active !== item.id) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
            onMouseLeave={e => { if (active !== item.id) e.currentTarget.style.background = "transparent"; }}
          >
            <span style={{ fontSize: 15, width: 20, textAlign: "center" }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div style={{ padding: "16px 20px", borderTop: `1px solid ${C.border}`, marginTop: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          {user?.picture ? (
            <img src={user.picture} alt={user.name} style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} />
          ) : (
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.success, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff" }}>
              {(user?.name || "A")[0].toUpperCase()}
            </div>
          )}
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.name}</p>
            <p style={{ margin: "2px 0 0", fontSize: 11, color: C.success }}>✓ Artisan vérifié</p>
          </div>
        </div>
        <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
          style={{ all: "unset", cursor: "pointer", width: "100%", boxSizing: "border-box", textAlign: "center", padding: "8px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 12, color: C.muted, transition: "all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#E24B4A50"; e.currentTarget.style.color = C.danger; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}
        >Déconnexion</button>
      </div>
    </motion.aside>
  );
}

function StatCard({ icon, label, value, sub, color, index }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * index }}
      style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px 22px" }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        {sub && <span style={{ fontSize: 11, color: C.success, background: `${C.success}15`, borderRadius: 6, padding: "2px 7px" }}>{sub}</span>}
      </div>
      <p style={{ margin: "0 0 4px", fontSize: 28, fontWeight: 800, color: color || C.text, letterSpacing: "-0.03em" }}>{value}</p>
      <p style={{ margin: 0, fontSize: 12, color: C.muted }}>{label}</p>
    </motion.div>
  );
}

function MissionCard({ mission, index, onAccept, onDecline }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 * index }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background: hovered ? C.surfaceLt : C.surface, border: `1px solid ${hovered ? C.success + "30" : C.border}`, borderRadius: 14, padding: "18px 20px", transition: "all 0.2s" }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
        <div>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: C.text }}>{mission.title}</p>
          <p style={{ margin: "3px 0 0", fontSize: 12, color: C.muted }}>{mission.category} · {mission.location} · {mission.date}</p>
        </div>
        <StatusBadge status={mission.status} />
      </div>
      <p style={{ margin: "0 0 12px", fontSize: 13, color: C.mutedLt, lineHeight: 1.5 }}>{mission.description}</p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 8 }}>
          <span style={{ fontSize: 12, color: C.text, fontWeight: 700, background: C.anthracite, borderRadius: 7, padding: "4px 10px" }}>
            💰 {mission.budget}
          </span>
          <span style={{ fontSize: 12, color: C.muted, background: C.anthracite, borderRadius: 7, padding: "4px 10px" }}>
            📍 {mission.distance}
          </span>
        </div>
        {mission.status === "new" && (
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => onDecline(mission.id)}
              style={{ all: "unset", cursor: "pointer", fontSize: 12, color: C.danger, padding: "6px 12px", border: `1px solid ${C.danger}40`, borderRadius: 7 }}
            >Refuser</button>
            <button onClick={() => onAccept(mission.id)}
              style={{ all: "unset", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#fff", padding: "6px 14px", background: C.success, borderRadius: 7 }}
            >Accepter</button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function ReviewCard({ review, index }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 * index }}
      style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 20px" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.anthraLt, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: C.mutedLt }}>
          {review.client[0]}
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: C.text }}>{review.client}</p>
          <p style={{ margin: "2px 0 0", fontSize: 11, color: C.muted }}>{review.service} · {review.date}</p>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 2 }}>
          {[1,2,3,4,5].map(s => (
            <span key={s} style={{ fontSize: 13, color: s <= review.rating ? C.warning : C.anthraLt }}>★</span>
          ))}
        </div>
      </div>
      <p style={{ margin: 0, fontSize: 13, color: C.mutedLt, lineHeight: 1.6, fontStyle: "italic" }}>"{review.comment}"</p>
    </motion.div>
  );
}

export default function ArtisanDashboard() {
  const { user, logout } = useAuth0();
  const [active, setActive]   = useState("overview");
  const [loading, setLoading] = useState(true);
  const [data, setData]       = useState(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setData({
        stats: [
          { icon: "📋", label: "Missions ce mois",  value: "18",      sub: "+3",    color: C.electric },
          { icon: "💰", label: "Revenus ce mois",   value: "42 500 DA", sub: "+12%", color: C.success  },
          { icon: "⭐", label: "Note moyenne",       value: "4.8",     sub: "→",     color: C.warning   },
          { icon: "✅", label: "Taux de complétion", value: "96%",     sub: "Excellent", color: C.success },
        ],
        missions: [
          { id: 1, title: "Fuite robinet urgente",       category: "Plomberie",    location: "Tlemcen Centre", date: "Aujourd'hui", status: "new",        description: "Fuite importante sous l'évier de la cuisine, intervention urgente requise.", budget: "2 500 DA", distance: "1.2 km" },
          { id: 2, title: "Installation prise électrique", category: "Électricité", location: "Bel Air",       date: "Demain",      status: "accepted",   description: "Ajout de 3 prises électriques dans le salon.", budget: "3 000 DA", distance: "2.8 km" },
          { id: 3, title: "Réparation chauffe-eau",      category: "Plomberie",    location: "Mansourah",      date: "12 avril",    status: "inprogress", description: "Chauffe-eau en panne, diagnostic et réparation.", budget: "4 000 DA", distance: "5.1 km" },
          { id: 4, title: "Débouchage canalisation",     category: "Plomberie",    location: "Tlemcen",        date: "8 avril",     status: "completed",  description: "Canalisation bouchée dans la salle de bain.", budget: "1 800 DA", distance: "0.8 km" },
        ],
        reviews: [
          { id: 1, client: "Amira B.", service: "Plomberie",    date: "Hier",      rating: 5, comment: "Intervention rapide et efficace, très professionnel. Je recommande vivement !" },
          { id: 2, client: "Mehdi R.", service: "Plomberie",    date: "12 avril",  rating: 5, comment: "Excellent travail, ponctuel et soigné. Le prix était très raisonnable." },
          { id: 3, client: "Fatima K.", service: "Réparation",  date: "5 avril",   rating: 4, comment: "Bon travail dans l'ensemble, très satisfaite du résultat." },
        ],
        revenue: {
          total: "42 500 DA",
          thisMonth: [8500, 12000, 6500, 9000, 6500],
          months: ["Jan", "Fév", "Mar", "Avr", "Mai"],
        },
      });
      setLoading(false);
    }, 1200);
    return () => clearTimeout(t);
  }, []);

  const handleAccept  = (id) => setData(d => ({ ...d, missions: d.missions.map(m => m.id === id ? { ...m, status: "accepted" } : m) }));
  const handleDecline = (id) => setData(d => ({ ...d, missions: d.missions.map(m => m.id === id ? { ...m, status: "declined" } : m) }));

  const renderContent = () => {
    if (loading) return <div style={{ display: "grid", gap: 12 }}>{[0,1,2,3].map(i => <SkeletonCard key={i} />)}</div>;

    switch (active) {
      case "overview":
        return (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12, marginBottom: 32 }}>
              {data.stats.map((s, i) => <StatCard key={i} {...s} index={i} />)}
            </div>
            <h2 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: C.text }}>Nouvelles demandes</h2>
            <div style={{ display: "grid", gap: 10 }}>
              {data.missions.filter(m => m.status === "new" || m.status === "accepted").map((m, i) => (
                <MissionCard key={m.id} mission={m} index={i} onAccept={handleAccept} onDecline={handleDecline} />
              ))}
            </div>
          </div>
        );

      case "missions":
        return (
          <div>
            <h2 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 700, color: C.text }}>Toutes mes missions</h2>
            <div style={{ display: "grid", gap: 10 }}>
              {data.missions.map((m, i) => (
                <MissionCard key={m.id} mission={m} index={i} onAccept={handleAccept} onDecline={handleDecline} />
              ))}
            </div>
          </div>
        );

      case "profile":
        return (
          <div style={{ maxWidth: 560 }}>
            <h2 style={{ margin: "0 0 24px", fontSize: 16, fontWeight: 700, color: C.text }}>Mon profil public</h2>
            {/* Avatar */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, marginBottom: 20 }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: C.success + "30", border: `2px solid ${C.success}50`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800, color: C.success }}>
                {(user?.name || "A")[0]}
              </div>
              <div>
                <p style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 700, color: C.text }}>{user?.name}</p>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: C.success, background: `${C.success}15`, border: `1px solid ${C.success}30`, borderRadius: 6, padding: "2px 8px" }}>✓ Vérifié</span>
                  <span style={{ fontSize: 12, color: C.warning }}>★ 4.8</span>
                  <span style={{ fontSize: 12, color: C.muted }}>18 missions</span>
                </div>
              </div>
            </div>
            {[
              { label: "Spécialité principale", value: "Plomberie", type: "text" },
              { label: "Description",           value: "Artisan plombier avec 8 ans d'expérience à Tlemcen.", type: "textarea" },
              { label: "Téléphone",             value: "+213 XXX XXX XXX", type: "tel" },
              { label: "Zone d'intervention",   value: "Tlemcen et environs (30km)", type: "text" },
              { label: "Tarif horaire",         value: "800 DA/h", type: "text" },
            ].map(field => (
              <div key={field.label} style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.mutedLt, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>{field.label}</label>
                {field.type === "textarea" ? (
                  <textarea defaultValue={field.value} rows={3}
                    style={{ width: "100%", boxSizing: "border-box", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px", fontSize: 14, color: C.text, outline: "none", fontFamily: "inherit", resize: "vertical" }}
                    onFocus={e => e.target.style.borderColor = C.success}
                    onBlur={e => e.target.style.borderColor = C.border}
                  />
                ) : (
                  <input type={field.type} defaultValue={field.value}
                    style={{ width: "100%", boxSizing: "border-box", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px", fontSize: 14, color: C.text, outline: "none", fontFamily: "inherit" }}
                    onFocus={e => e.target.style.borderColor = C.success}
                    onBlur={e => e.target.style.borderColor = C.border}
                  />
                )}
              </div>
            ))}
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              style={{ all: "unset", cursor: "pointer", marginTop: 8, fontSize: 14, fontWeight: 600, color: "#fff", padding: "12px 28px", background: C.success, borderRadius: 10 }}
            >Mettre à jour le profil</motion.button>
          </div>
        );

      case "reviews":
        return (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, marginBottom: 20 }}>
              <div style={{ textAlign: "center" }}>
                <p style={{ margin: 0, fontSize: 40, fontWeight: 800, color: C.warning }}>4.8</p>
                <div style={{ display: "flex", gap: 2, justifyContent: "center", margin: "4px 0" }}>
                  {[1,2,3,4,5].map(s => <span key={s} style={{ fontSize: 14, color: s <= 4 ? C.warning : C.anthraLt }}>★</span>)}
                </div>
                <p style={{ margin: 0, fontSize: 11, color: C.muted }}>3 avis</p>
              </div>
              <div style={{ flex: 1 }}>
                {[5,4,3,2,1].map(star => (
                  <div key={star} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: C.muted, width: 8 }}>{star}</span>
                    <div style={{ flex: 1, height: 6, background: C.anthracite, borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: star === 5 ? "67%" : star === 4 ? "33%" : "0%", background: C.warning, borderRadius: 3 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              {data.reviews.map((r, i) => <ReviewCard key={r.id} review={r} index={i} />)}
            </div>
          </div>
        );

      case "revenue":
        return (
          <div>
            <h2 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 700, color: C.text }}>Revenus</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px 22px" }}>
                <p style={{ margin: "0 0 4px", fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em" }}>Ce mois</p>
                <p style={{ margin: 0, fontSize: 28, fontWeight: 800, color: C.success }}>42 500 DA</p>
              </div>
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px 22px" }}>
                <p style={{ margin: "0 0 4px", fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em" }}>Total 2025</p>
                <p style={{ margin: 0, fontSize: 28, fontWeight: 800, color: C.text }}>186 000 DA</p>
              </div>
            </div>
            {/* Bar chart simple */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "24px" }}>
              <p style={{ margin: "0 0 20px", fontSize: 14, fontWeight: 600, color: C.text }}>Revenus par mois</p>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 120 }}>
                {data.revenue.thisMonth.map((val, i) => {
                  const max = Math.max(...data.revenue.thisMonth);
                  const h = (val / max) * 100;
                  return (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 10, color: C.muted }}>{(val/1000).toFixed(0)}k</span>
                      <motion.div initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: i * 0.08, duration: 0.5, ease: "easeOut" }}
                        style={{ width: "100%", background: i === data.revenue.thisMonth.length - 1 ? C.success : `${C.success}50`, borderRadius: "6px 6px 0 0", minHeight: 4 }}
                      />
                      <span style={{ fontSize: 10, color: C.muted }}>{data.revenue.months[i]}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case "settings":
        return (
          <div style={{ maxWidth: 480 }}>
            <h2 style={{ margin: "0 0 24px", fontSize: 16, fontWeight: 700, color: C.text }}>Paramètres du compte</h2>
            {[
              { label: "Nom complet", value: user?.name,  type: "text" },
              { label: "Email",       value: user?.email, type: "email" },
              { label: "Téléphone",   value: "",          type: "tel" },
            ].map(field => (
              <div key={field.label} style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.mutedLt, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>{field.label}</label>
                <input type={field.type} defaultValue={field.value}
                  style={{ width: "100%", boxSizing: "border-box", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px", fontSize: 14, color: C.text, outline: "none", fontFamily: "inherit" }}
                  onFocus={e => e.target.style.borderColor = C.success}
                  onBlur={e => e.target.style.borderColor = C.border}
                />
              </div>
            ))}
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              style={{ all: "unset", cursor: "pointer", marginTop: 8, fontSize: 14, fontWeight: 600, color: "#fff", padding: "12px 28px", background: C.success, borderRadius: 10 }}
            >Sauvegarder</motion.button>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: C.walnut, display: "flex", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: C.text }}>
      <Sidebar active={active} setActive={setActive} user={user} logout={logout} />

      <main style={{ flex: 1, padding: "32px 40px", overflowY: "auto" }}>
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ marginBottom: 32 }}>
          <h1 style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em" }}>
            Bonjour, {user?.name?.split(" ")[0]} 🔧
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: C.muted }}>
            {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.22 }}>
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
