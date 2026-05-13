// src/pages/ArtisanProfile.jsx
// Route : /artisan/:id
// Accessible depuis HomePage et ClientDashboard

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getToken, getStoredUser } from "../hooks/useAuth";

const F   = "'Inter', 'Segoe UI', sans-serif";
const API = (process.env.REACT_APP_API_URL || "").replace(/\/$/, "");

const C = {
  bg:       "#111110",
  sidebar:  "#151413",
  surface:  "#1A1918",
  surfaceLt:"#1F1E1D",
  border:   "rgba(255,255,255,0.07)",
  borderLt: "rgba(255,255,255,0.13)",
  text:     "#F0EDE8",
  muted:    "#888580",
  mutedLt:  "#B0ADA8",
  electric: "#3B82F6",
  success:  "#10B981",
  warning:  "#F59E0B",
  danger:   "#EF4444",
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton({ w = "100%", h = 14, r = 6, mb = 0 }) {
  return (
    <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }}
      style={{ width: w, height: h, borderRadius: r, background: C.surface, marginBottom: mb }} />
  );
}

// ─── Star Rating ──────────────────────────────────────────────────────────────
function Stars({ rating, size = 14 }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1,2,3,4,5].map(s => (
        <span key={s} style={{ fontSize: size, color: s <= Math.round(rating) ? C.warning : C.surfaceLt }}>★</span>
      ))}
    </div>
  );
}

// ─── Review Card ─────────────────────────────────────────────────────────────
function ReviewCard({ r, i }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
      style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 18px" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.surfaceLt, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: C.mutedLt, flexShrink: 0 }}>
          {r.client?.[0] || "?"}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: C.text, fontFamily: F }}>{r.client}</p>
          <p style={{ margin: "2px 0 0", fontSize: 11, color: C.muted, fontFamily: F }}>{r.service} · {r.date}</p>
        </div>
        <Stars rating={r.rating} size={12} />
      </div>
      <p style={{ margin: 0, fontSize: 13, color: C.mutedLt, lineHeight: 1.6, fontStyle: "italic", fontFamily: F }}>"{r.comment}"</p>
    </motion.div>
  );
}

// ─── Availability Grid ────────────────────────────────────────────────────────
const DAYS  = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const SLOTS = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"];

function AvailabilityGrid({ available }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: F }}>
        <thead>
          <tr>
            <th style={{ width: 60, padding: "6px 0", fontSize: 11, color: C.muted, textAlign: "left" }}></th>
            {DAYS.map(d => (
              <th key={d} style={{ padding: "6px 4px", fontSize: 11, fontWeight: 600, color: C.muted, textAlign: "center" }}>{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SLOTS.map(slot => (
            <tr key={slot}>
              <td style={{ padding: "4px 0", fontSize: 11, color: C.muted }}>{slot}</td>
              {DAYS.map((d, di) => {
                const key = `${d}-${slot}`;
                const isAvail = available?.[key] !== false && !(di === 6); // dim = off par défaut
                return (
                  <td key={d} style={{ padding: "3px 4px", textAlign: "center" }}>
                    <div style={{
                      width: "100%", height: 22, borderRadius: 5,
                      background: isAvail ? `${C.success}20` : C.sidebar,
                      border: `1px solid ${isAvail ? C.success + "40" : C.border}`,
                    }} />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: 3, background: `${C.success}20`, border: `1px solid ${C.success}40` }} />
          <span style={{ fontSize: 11, color: C.muted, fontFamily: F }}>Disponible</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: 3, background: C.sidebar, border: `1px solid ${C.border}` }} />
          <span style={{ fontSize: 11, color: C.muted, fontFamily: F }}>Indisponible</span>
        </div>
      </div>
    </div>
  );
}

// ─── Gallery ──────────────────────────────────────────────────────────────────
function Gallery({ photos }) {
  const [selected, setSelected] = useState(null);
  if (!photos?.length) return (
    <p style={{ color: C.muted, fontSize: 13, fontFamily: F, padding: "20px 0" }}>Aucune réalisation ajoutée.</p>
  );
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 8 }}>
        {photos.map((url, i) => (
          <motion.div key={i} whileHover={{ scale: 1.03 }} onClick={() => setSelected(url)}
            style={{ aspectRatio: "1", borderRadius: 10, overflow: "hidden", cursor: "pointer", background: C.surfaceLt, border: `1px solid ${C.border}` }}
          >
            <img src={url} alt={`Réalisation ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </motion.div>
        ))}
      </div>
      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
          >
            <motion.img src={selected} initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              style={{ maxWidth: "90vw", maxHeight: "85vh", borderRadius: 12, objectFit: "contain" }}
            />
            <button onClick={() => setSelected(null)} style={{ all: "unset", position: "absolute", top: 20, right: 20, cursor: "pointer", color: "#fff", fontSize: 24, lineHeight: 1 }}>✕</button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Request Modal ────────────────────────────────────────────────────────────
function RequestModal({ artisan, onClose, onSuccess }) {
  const navigate = useNavigate();
  const user     = getStoredUser();
  const token    = getToken();

  const [form, setForm]     = useState({ title: "", description: "", address: "", urgency: "normal", date: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr]       = useState("");

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    if (!form.title || !form.description || !form.address) { setErr("Remplissez tous les champs requis."); return; }
    if (!token) { navigate("/login"); return; }
    setLoading(true); setErr("");
    try {
      const res  = await fetch(`${API}/api/repairs`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, artisanId: artisan._id, artisanName: artisan.name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Erreur ${res.status}`);
      onSuccess(data);
    } catch (e) { setErr(e.message); }
    finally     { setLoading(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
        style={{ background: C.sidebar, border: `1px solid ${C.border}`, borderRadius: 16, padding: "28px", width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto" }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: C.text, fontFamily: F }}>Demander une intervention</h2>
          <button onClick={onClose} style={{ all: "unset", cursor: "pointer", color: C.muted, fontSize: 20, lineHeight: 1 }}>✕</button>
        </div>

        {/* Artisan résumé */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: C.surface, borderRadius: 10, marginBottom: 20 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${C.electric}20`, border: `1px solid ${C.electric}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: C.electric }}>
            {artisan.name?.[0]}
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: C.text, fontFamily: F }}>{artisan.name}</p>
            <p style={{ margin: 0, fontSize: 11, color: C.muted, fontFamily: F }}>{artisan.specialty} · {artisan.city}</p>
          </div>
        </div>

        {err && <p style={{ margin: "0 0 14px", padding: "9px 12px", background: "rgba(239,68,68,0.08)", border: `1px solid ${C.danger}40`, borderRadius: 8, fontSize: 12, color: C.danger, fontFamily: F }}>⚠ {err}</p>}

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Titre */}
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 5, fontFamily: F }}>Titre de la demande *</label>
            <input value={form.title} onChange={set("title")} placeholder="Ex: Fuite robinet cuisine"
              style={{ width: "100%", boxSizing: "border-box", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 9, padding: "11px 13px", fontSize: 13, color: C.text, outline: "none", fontFamily: F }}
              onFocus={e => e.target.style.borderColor = C.electric} onBlur={e => e.target.style.borderColor = C.border}
            />
          </div>

          {/* Description */}
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 5, fontFamily: F }}>Description *</label>
            <textarea value={form.description} onChange={set("description")} rows={3}
              placeholder="Décrivez le problème en détail..."
              style={{ width: "100%", boxSizing: "border-box", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 9, padding: "11px 13px", fontSize: 13, color: C.text, outline: "none", fontFamily: F, resize: "vertical" }}
              onFocus={e => e.target.style.borderColor = C.electric} onBlur={e => e.target.style.borderColor = C.border}
            />
          </div>

          {/* Adresse */}
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 5, fontFamily: F }}>Adresse *</label>
            <input value={form.address} onChange={set("address")} placeholder="Rue, quartier, ville"
              style={{ width: "100%", boxSizing: "border-box", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 9, padding: "11px 13px", fontSize: 13, color: C.text, outline: "none", fontFamily: F }}
              onFocus={e => e.target.style.borderColor = C.electric} onBlur={e => e.target.style.borderColor = C.border}
            />
          </div>

          {/* Date souhaitée + Urgence */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 5, fontFamily: F }}>Date souhaitée</label>
              <input type="date" value={form.date} onChange={set("date")}
                style={{ width: "100%", boxSizing: "border-box", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 9, padding: "11px 13px", fontSize: 13, color: C.text, outline: "none", fontFamily: F, colorScheme: "dark" }}
                onFocus={e => e.target.style.borderColor = C.electric} onBlur={e => e.target.style.borderColor = C.border}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 5, fontFamily: F }}>Urgence</label>
              <select value={form.urgency} onChange={set("urgency")}
                style={{ width: "100%", boxSizing: "border-box", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 9, padding: "11px 13px", fontSize: 13, color: C.text, outline: "none", fontFamily: F }}
                onFocus={e => e.target.style.borderColor = C.electric} onBlur={e => e.target.style.borderColor = C.border}
              >
                <option value="low">Faible</option>
                <option value="normal">Normale</option>
                <option value="high">Urgente</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <motion.button whileHover={{ opacity: 0.9 }} whileTap={{ scale: 0.98 }} onClick={submit} disabled={loading}
            style={{ all: "unset", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: C.electric, color: "#fff", padding: "13px", borderRadius: 10, fontSize: 14, fontWeight: 600, fontFamily: F, opacity: loading ? 0.7 : 1, marginTop: 4 }}
          >
            {loading ? "Envoi en cours…" : "📤 Envoyer la demande"}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ArtisanProfile() {
  const { id }        = useParams();
  const navigate      = useNavigate();
  const currentUser   = getStoredUser();
  const isClient      = currentUser?.role === "client";

  const [artisan, setArtisan]     = useState(null);
  const [loading, setLoading]     = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showModal, setShowModal] = useState(false);
  const [success, setSuccess]     = useState("");
  const [notFound, setNotFound]   = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res  = await fetch(`${API}/api/users/workers/${id}`, {
          headers: { "ngrok-skip-browser-warning": "true" },
        });
        if (res.status === 404) { setNotFound(true); return; }
        if (!res.ok) throw new Error();
        const data = await res.json();

        // Enrichit avec données mock si manquantes
        setArtisan({
          _id:         data._id,
          name:        data.name        || "Artisan",
          specialty:   data.specialty   || "Artisan",
          city:        data.city        || "Tlemcen",
          bio:         data.bio         || `Artisan spécialisé en ${data.specialty || "réparation"} avec plusieurs années d'expérience en Algérie.`,
          rating:      data.rating      || 4.8,
          reviewCount: data.reviewCount || 0,
          jobsDone:    data.jobsDone    || 0,
          hourlyRate:  data.hourlyRate  || "800 DA/h",
          phone:       data.phone       || null,
          verified:    data.verified    !== false,
          responseTime:data.responseTime|| "< 1h",
          photos:      data.photos      || [],
          reviews:     data.reviews     || [
            { client: "Amira B.",  service: data.specialty, date: "Hier",    rating: 5, comment: "Intervention rapide et efficace, très professionnel !" },
            { client: "Mehdi R.",  service: data.specialty, date: "12 avr.", rating: 5, comment: "Excellent travail, ponctuel et soigné." },
            { client: "Fatima K.", service: data.specialty, date: "5 avr.",  rating: 4, comment: "Bon travail, très satisfaite." },
          ],
          availability: data.availability || {},
          skills:      data.skills      || [data.specialty, "Devis gratuit", "Intervention rapide", "Garantie travaux"],
        });
      } catch {
        setNotFound(true);
      } finally { setLoading(false); }
    };
    load();
  }, [id]);

  const handleRequestSuccess = (data) => {
    setShowModal(false);
    setSuccess("Demande envoyée avec succès ! L'artisan vous contactera bientôt.");
    setTimeout(() => setSuccess(""), 5000);
  };

  const TABS = [
    { id: "overview",      label: "Présentation" },
    { id: "gallery",       label: "Réalisations" },
    { id: "availability",  label: "Disponibilités" },
    { id: "reviews",       label: `Avis (${artisan?.reviews?.length || 0})` },
  ];

  // ── 404 ──
  if (notFound) return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: F, color: C.text }}>
      <p style={{ fontSize: 48, margin: "0 0 16px" }}>🔍</p>
      <h1 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 700 }}>Artisan introuvable</h1>
      <p style={{ margin: "0 0 24px", color: C.muted, fontSize: 14 }}>Ce profil n'existe pas ou a été supprimé.</p>
      <button onClick={() => navigate(-1)} style={{ all: "unset", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#fff", padding: "10px 22px", background: C.electric, borderRadius: 9, fontFamily: F }}>← Retour</button>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: F, color: C.text }}>

      {/* Déco */}
      <div aria-hidden="true" style={{ position: "fixed", inset: 0, backgroundImage: `radial-gradient(circle at 70% 10%, ${C.electric}08 0%, transparent 50%)`, pointerEvents: "none", zIndex: 0 }} />

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 10, background: C.bg + "ee", backdropFilter: "blur(12px)", borderBottom: `1px solid ${C.border}`, padding: "14px 40px", display: "flex", alignItems: "center", gap: 16 }}>
        <button onClick={() => navigate(-1)} style={{ all: "unset", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: C.muted, fontFamily: F }}
          onMouseEnter={e => e.currentTarget.style.color = C.text} onMouseLeave={e => e.currentTarget.style.color = C.muted}
        >← Retour</button>
        <div style={{ flex: 1 }} />
        <div onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
          <div style={{ width: 24, height: 24, borderRadius: 6, background: C.electric, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>⚙</div>
          <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.02em" }}>Service<span style={{ color: C.electric }}>DZ</span></span>
        </div>
      </nav>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto", padding: "32px 24px 80px" }}>

        {/* Success banner */}
        <AnimatePresence>
          {success && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ background: `${C.success}15`, border: `1px solid ${C.success}40`, borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: C.success, fontFamily: F }}
            >✓ {success}</motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          /* ── Skeleton loading ── */
          <div>
            <div style={{ display: "flex", gap: 20, marginBottom: 32 }}>
              <Skeleton w={90} h={90} r={50} />
              <div style={{ flex: 1 }}>
                <Skeleton w="50%" h={22} mb={10} />
                <Skeleton w="35%" h={14} mb={8} />
                <Skeleton w="60%" h={14} />
              </div>
            </div>
            <Skeleton h={120} mb={16} />
            <Skeleton h={14} w="80%" mb={8} />
            <Skeleton h={14} w="65%" />
          </div>
        ) : artisan && (
          <>
            {/* ── Hero Card ── */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
              style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "24px", marginBottom: 20 }}
            >
              <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                {/* Avatar */}
                <div style={{ width: 80, height: 80, borderRadius: "50%", background: `${C.electric}20`, border: `2px solid ${C.electric}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800, color: C.electric, flexShrink: 0 }}>
                  {artisan.name[0]}
                </div>

                {/* Infos */}
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
                    <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em" }}>{artisan.name}</h1>
                    {artisan.verified && (
                      <span style={{ fontSize: 11, fontWeight: 600, color: C.success, background: `${C.success}15`, border: `1px solid ${C.success}35`, borderRadius: 5, padding: "2px 8px", fontFamily: F }}>✓ Vérifié</span>
                    )}
                  </div>
                  <p style={{ margin: "0 0 10px", fontSize: 14, color: C.mutedLt, fontFamily: F }}>
                    {artisan.specialty} · 📍 {artisan.city}
                  </p>

                  {/* Rating + stats */}
                  <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Stars rating={artisan.rating} size={14} />
                      <span style={{ fontSize: 13, fontWeight: 700, color: C.warning, fontFamily: F }}>{artisan.rating.toFixed(1)}</span>
                      <span style={{ fontSize: 12, color: C.muted, fontFamily: F }}>({artisan.reviews.length} avis)</span>
                    </div>
                    <span style={{ fontSize: 12, color: C.muted, fontFamily: F }}>· {artisan.jobsDone || artisan.reviews.length * 8} missions</span>
                    <span style={{ fontSize: 12, color: C.muted, fontFamily: F }}>· Répond en {artisan.responseTime}</span>
                  </div>
                </div>

                {/* CTA */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end", flexShrink: 0 }}>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ margin: "0 0 2px", fontSize: 20, fontWeight: 800, color: C.text, fontFamily: F }}>{artisan.hourlyRate}</p>
                    <p style={{ margin: 0, fontSize: 11, color: C.muted, fontFamily: F }}>Tarif indicatif</p>
                  </div>
                  {isClient ? (
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={() => setShowModal(true)}
                      style={{ all: "unset", cursor: "pointer", background: C.electric, color: "#fff", fontSize: 13, fontWeight: 700, padding: "11px 20px", borderRadius: 10, fontFamily: F, whiteSpace: "nowrap" }}
                    >📋 Demander une intervention</motion.button>
                  ) : !currentUser ? (
                    <motion.button whileHover={{ scale: 1.03 }} onClick={() => navigate("/login")}
                      style={{ all: "unset", cursor: "pointer", background: C.electric, color: "#fff", fontSize: 13, fontWeight: 700, padding: "11px 20px", borderRadius: 10, fontFamily: F }}
                    >Se connecter pour demander</motion.button>
                  ) : null}
                  {artisan.phone && (
                    <a href={`tel:${artisan.phone}`} style={{ fontSize: 12, color: C.electric, textDecoration: "none", fontFamily: F }}>
                      📞 {artisan.phone}
                    </a>
                  )}
                </div>
              </div>

              {/* Skills pills */}
              <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginTop: 16, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
                {artisan.skills.map(skill => (
                  <span key={skill} style={{ fontSize: 12, color: C.mutedLt, background: C.surfaceLt, border: `1px solid ${C.border}`, borderRadius: 6, padding: "4px 10px", fontFamily: F }}>
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* ── Tabs ── */}
            <div style={{ display: "flex", gap: 2, background: C.sidebar, borderRadius: 10, padding: 3, marginBottom: 20 }}>
              {TABS.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  style={{ all: "unset", flex: 1, textAlign: "center", padding: "9px 8px", borderRadius: 8, fontSize: 13, fontWeight: activeTab === tab.id ? 600 : 400, cursor: "pointer", background: activeTab === tab.id ? C.surface : "transparent", color: activeTab === tab.id ? C.text : C.muted, transition: "all 0.18s", fontFamily: F }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ── Tab Content ── */}
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>

                {activeTab === "overview" && (
                  <div style={{ display: "grid", gap: 16 }}>
                    {/* Bio */}
                    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px 22px" }}>
                      <h2 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 600, color: C.text, fontFamily: F }}>À propos</h2>
                      <p style={{ margin: 0, fontSize: 14, color: C.mutedLt, lineHeight: 1.7, fontFamily: F }}>{artisan.bio}</p>
                    </div>

                    {/* Stats grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10 }}>
                      {[
                        { label: "Note moyenne",   value: artisan.rating.toFixed(1) + " ★", color: C.warning  },
                        { label: "Missions faites",value: String(artisan.jobsDone || artisan.reviews.length * 8), color: C.electric },
                        { label: "Avis clients",   value: String(artisan.reviews.length), color: C.success  },
                        { label: "Temps de réponse", value: artisan.responseTime, color: C.mutedLt },
                      ].map(s => (
                        <div key={s.label} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 18px" }}>
                          <p style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 700, color: s.color, fontFamily: F }}>{s.value}</p>
                          <p style={{ margin: 0, fontSize: 11, color: C.muted, fontFamily: F }}>{s.label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Derniers avis */}
                    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px 22px" }}>
                      <h2 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 600, color: C.text, fontFamily: F }}>Derniers avis</h2>
                      <div style={{ display: "grid", gap: 10 }}>
                        {artisan.reviews.slice(0, 2).map((r, i) => <ReviewCard key={i} r={r} i={i} />)}
                      </div>
                      {artisan.reviews.length > 2 && (
                        <button onClick={() => setActiveTab("reviews")} style={{ all: "unset", cursor: "pointer", marginTop: 12, fontSize: 12, color: C.electric, fontFamily: F }}>
                          Voir tous les avis →
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "gallery" && (
                  <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px 22px" }}>
                    <h2 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 600, color: C.text, fontFamily: F }}>Galerie de réalisations</h2>
                    <Gallery photos={artisan.photos} />
                  </div>
                )}

                {activeTab === "availability" && (
                  <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px 22px" }}>
                    <h2 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 600, color: C.text, fontFamily: F }}>Disponibilités cette semaine</h2>
                    <AvailabilityGrid available={artisan.availability} />
                    {isClient && (
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        onClick={() => setShowModal(true)}
                        style={{ all: "unset", cursor: "pointer", marginTop: 20, display: "inline-flex", alignItems: "center", gap: 8, background: C.electric, color: "#fff", fontSize: 13, fontWeight: 600, padding: "11px 20px", borderRadius: 9, fontFamily: F }}
                      >📋 Demander une intervention</motion.button>
                    )}
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div>
                    {/* Résumé */}
                    <div style={{ display: "flex", gap: 16, padding: "16px 20px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, marginBottom: 14, alignItems: "center" }}>
                      <div style={{ textAlign: "center", flexShrink: 0 }}>
                        <p style={{ margin: 0, fontSize: 36, fontWeight: 800, color: C.warning, fontFamily: F }}>{artisan.rating.toFixed(1)}</p>
                        <Stars rating={artisan.rating} size={13} />
                        <p style={{ margin: "4px 0 0", fontSize: 11, color: C.muted, fontFamily: F }}>{artisan.reviews.length} avis</p>
                      </div>
                      <div style={{ flex: 1 }}>
                        {[5,4,3,2,1].map(star => {
                          const count = artisan.reviews.filter(r => r.rating === star).length;
                          const pct   = artisan.reviews.length ? (count / artisan.reviews.length) * 100 : 0;
                          return (
                            <div key={star} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                              <span style={{ fontSize: 11, color: C.muted, width: 8, fontFamily: F }}>{star}</span>
                              <div style={{ flex: 1, height: 5, background: C.surfaceLt, borderRadius: 3, overflow: "hidden" }}>
                                <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.5 }}
                                  style={{ height: "100%", background: C.warning, borderRadius: 3 }} />
                              </div>
                              <span style={{ fontSize: 11, color: C.muted, width: 16, textAlign: "right", fontFamily: F }}>{count}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div style={{ display: "grid", gap: 8 }}>
                      {artisan.reviews.map((r, i) => <ReviewCard key={i} r={r} i={i} />)}
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>

            {/* ── Sticky CTA mobile ── */}
            {isClient && (
              <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "12px 20px", background: C.bg + "ee", backdropFilter: "blur(12px)", borderTop: `1px solid ${C.border}`, display: "flex", gap: 12, alignItems: "center", zIndex: 20 }}>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: C.text, fontFamily: F }}>{artisan.name}</p>
                  <p style={{ margin: 0, fontSize: 12, color: C.muted, fontFamily: F }}>{artisan.hourlyRate}</p>
                </div>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setShowModal(true)}
                  style={{ all: "unset", cursor: "pointer", background: C.electric, color: "#fff", fontSize: 14, fontWeight: 700, padding: "12px 22px", borderRadius: 10, fontFamily: F }}
                >Demander →</motion.button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Modal de demande ── */}
      <AnimatePresence>
        {showModal && artisan && (
          <RequestModal artisan={artisan} onClose={() => setShowModal(false)} onSuccess={handleRequestSuccess} />
        )}
      </AnimatePresence>

    </div>
  );
}
