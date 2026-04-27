import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Color Tokens ────────────────────────────────────────────────────────────
const C = {
  walnut:     "#1A1410",
  walnutMid:  "#231D18",
  anthracite: "#2C2C2A",
  anthraLt:   "#3D3D3A",
  muted:      "#888780",
  mutedLt:    "#B4B2A9",
  electric:   "#378ADD",
  electricLt: "#85B7EB",
  electricDim:"#185FA5",
  surface:    "#201B16",
  border:     "rgba(255,255,255,0.07)",
  borderHov:  "rgba(55,138,221,0.35)",
  text:       "#F1EFE8",
  textMuted:  "#B4B2A9",
};

// ─── Service Categories ───────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 1, icon: "🔧", label: "Plomberie",      count: 142, color: "#378ADD" },
  { id: 2, icon: "⚡", label: "Électricité",    count: 98,  color: "#EF9F27" },
  { id: 3, icon: "🧱", label: "Maçonnerie",     count: 61,  color: "#D85A30" },
  { id: 4, icon: "🪟", label: "Menuiserie",     count: 77,  color: "#1D9E75" },
  { id: 5, icon: "❄️", label: "Climatisation",  count: 55,  color: "#5DCAA5" },
  { id: 6, icon: "🎨", label: "Peinture",       count: 89,  color: "#D4537E" },
  { id: 7, icon: "🔩", label: "Serrurerie",     count: 43,  color: "#888780" },
  { id: 8, icon: "🏠", label: "Rénovation",     count: 34,  color: "#AFA9EC" },
];

const FEATURED = [
  { id: 1, name: "Karim Bensalem",   specialty: "Plomberie · Tlemcen",     rating: 4.9, jobs: 214, initials: "KB", color: "#185FA5" },
  { id: 2, name: "Yasmine Hadjadj",  specialty: "Électricité · Tlemcen",   rating: 4.8, jobs: 178, initials: "YH", color: "#0F6E56" },
  { id: 3, name: "Omar Bouchrit",    specialty: "Rénovation · Mansourah",  rating: 5.0, jobs: 93,  initials: "OB", color: "#993C1D" },
];

// ─── Skeleton Loader ──────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <motion.div
      initial={{ opacity: 0.4 }}
      animate={{ opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 16,
        padding: "20px 22px",
        display: "flex",
        gap: 14,
        alignItems: "center",
      }}
    >
      <div style={{ width: 48, height: 48, borderRadius: "50%", background: C.anthraLt, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ height: 14, width: "55%", background: C.anthraLt, borderRadius: 6, marginBottom: 8 }} />
        <div style={{ height: 12, width: "80%", background: C.anthracite, borderRadius: 6, marginBottom: 8 }} />
        <div style={{ height: 12, width: "40%", background: C.anthracite, borderRadius: 6 }} />
      </div>
    </motion.div>
  );
}

function CategoryCard({ cat, index }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.button
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`Catégorie : ${cat.label}, ${cat.count} réparateurs disponibles`}
      style={{
        all: "unset",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 12,
        background: hovered ? `${cat.color}12` : C.surface,
        border: `1px solid ${hovered ? cat.color + "55" : C.border}`,
        borderRadius: 16,
        padding: "20px 20px 18px",
        transition: "all 0.22s ease",
        outline: "none",
      }}
    >
      <motion.span
        animate={{ scale: hovered ? 1.15 : 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        style={{ fontSize: 26, lineHeight: 1 }}
        role="img"
        aria-hidden="true"
      >
        {cat.icon}
      </motion.span>
      <div>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: C.text, letterSpacing: "0.01em" }}>
          {cat.label}
        </p>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: C.muted }}>
          {cat.count} réparateurs
        </p>
      </div>
      <motion.div
        animate={{ width: hovered ? "100%" : "32px" }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        style={{ height: 2, background: cat.color, borderRadius: 2 }}
      />
    </motion.button>
  );
}

function ExpertCard({ expert, index }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + 0.07 * index, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`Réparateur : ${expert.name}, ${expert.specialty}, note ${expert.rating} sur 5`}
      style={{
        background: hovered ? `${expert.color}0F` : C.surface,
        border: `1px solid ${hovered ? expert.color + "44" : C.border}`,
        borderRadius: 16,
        padding: "20px 22px",
        display: "flex",
        gap: 14,
        alignItems: "center",
        cursor: "pointer",
        transition: "all 0.22s ease",
      }}
    >
      {/* Avatar */}
      <motion.div
        animate={{ scale: hovered ? 1.05 : 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: expert.color + "30",
          border: `1.5px solid ${expert.color}55`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
          fontWeight: 700,
          color: expert.color,
          flexShrink: 0,
          letterSpacing: "0.03em",
        }}
        aria-hidden="true"
      >
        {expert.initials}
      </motion.div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: C.text }}>{expert.name}</p>
        <p style={{ margin: "3px 0 0", fontSize: 12, color: C.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {expert.specialty}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
          <span
            aria-label={`Note : ${expert.rating} étoiles`}
            style={{ fontSize: 11, fontWeight: 700, color: "#EF9F27", background: "#EF9F2715", border: "1px solid #EF9F2730", borderRadius: 6, padding: "2px 7px" }}
          >
            ★ {expert.rating}
          </span>
          <span style={{ fontSize: 11, color: C.mutedLt }}>{expert.jobs} missions</span>
        </div>
      </div>
      <motion.div
        animate={{ x: hovered ? 0 : -4, opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        aria-hidden="true"
        style={{ fontSize: 16, color: expert.color, flexShrink: 0 }}
      >
        →
      </motion.div>
    </motion.article>
  );
}

// ─── Search Bar (Connectée) ───────────────────────────────────────────────────
function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const handleKeyDown = (e) => { if (e.key === 'Enter') onSearch(query); };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: "relative", width: "100%", maxWidth: 600, margin: "0 auto" }}
    >
      <label htmlFor="service-search" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap" }}>
        Rechercher un service ou un réparateur
      </label>
      <motion.div
        animate={{
          boxShadow: focused
            ? `0 0 0 2px ${C.electric}, 0 8px 32px rgba(55,138,221,0.18)`
            : `0 0 0 1px ${C.border}, 0 4px 16px rgba(0,0,0,0.3)`,
        }}
        transition={{ duration: 0.2 }}
        style={{ borderRadius: 14, overflow: "hidden" }}
      >
        <div style={{
          display: "flex",
          alignItems: "center",
          background: C.surface,
          border: `1px solid ${focused ? C.electric : C.border}`,
          borderRadius: 14,
          padding: "0 16px",
          gap: 10,
          transition: "border-color 0.2s",
        }}>
          <span aria-hidden="true" style={{ fontSize: 16, color: focused ? C.electric : C.muted, transition: "color 0.2s", flexShrink: 0 }}>⌕</span>
          <input
            id="service-search"
            type="search"
            placeholder="Plombier, électricien, peintre…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            autoComplete="off"
            style={{
              flex: 1,
              border: "none",
              background: "transparent",
              outline: "none",
              fontSize: 15,
              color: C.text,
              padding: "16px 0",
              fontFamily: "inherit",
            }}
          />
          <AnimatePresence>
            {query.length > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                onClick={() => setQuery("")}
                aria-label="Effacer la recherche"
                style={{
                  all: "unset",
                  cursor: "pointer",
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: C.anthraLt,
                  color: C.muted,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  flexShrink: 0,
                }}
              >
                ✕
              </motion.button>
            )}
          </AnimatePresence>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            aria-label="Lancer la recherche"
            style={{
              all: "unset",
              cursor: "pointer",
              background: C.electric,
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              padding: "9px 18px",
              borderRadius: 9,
              letterSpacing: "0.02em",
              flexShrink: 0,
            }}
          >
            Rechercher
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ServiceDZHome() {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  const handleSearch = async (val) => {
    if (!val.trim()) return;
    setSearchQuery(val);
    setIsSearching(true);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'https://isolated-aptitude-obtain.ngrok-free.dev';
      const response = await fetch(`${apiUrl}/api/recherche?q=${encodeURIComponent(val)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        }
      });
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.walnut,
        color: C.text,
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        overflowX: "hidden",
      }}
    >
      {/* ── Subtle grid texture ── */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: `
            linear-gradient(${C.border} 1px, transparent 1px),
            linear-gradient(90deg, ${C.border} 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── Electric accent orb ── */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: -160,
          left: "50%",
          transform: "translateX(-50%)",
          width: 520,
          height: 320,
          background: `radial-gradient(ellipse at center, ${C.electric}22 0%, transparent 70%)`,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        
        {/* --- Affichage des résultats de recherche --- */}
        { (isSearching || results.length > 0 || searchQuery) && (
          <section style={{ marginBottom: 60 }}>
            <h2 style={{ fontSize: 18, color: C.electric }}>Résultats pour "{searchQuery}"</h2>
            <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
              {isSearching ? (
                [0, 1].map(i => <SkeletonCard key={i} />)
              ) : results.length > 0 ? (
                results.map((expert, i) => <ExpertCard key={i} expert={expert} index={i} />)
              ) : (
                <p style={{ color: C.muted }}>Aucun artisan trouvé.</p>
              )}
            </div>
            <hr style={{ border: "none", borderTop: `1px solid ${C.border}`, margin: "40px 0" }} />
          </section>
        )}

        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          role="navigation"
          aria-label="Navigation principale"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 40px",
            borderBottom: `1px solid ${C.border}`,
            backdropFilter: "blur(8px)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              aria-hidden="true"
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: C.electric,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
              }}
            >
              ⚙
            </div>
            <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.02em", color: C.text }}>
              Service<span style={{ color: C.electric }}>DZ</span>
            </span>
          </div>
 
          <div role="list" style={{ display: "flex", gap: 32, listStyle: "none", margin: 0, padding: 0 }}>
            {["Services", "Réparateurs", "Comment ça marche"].map(item => (
              <a
                key={item}
                href="#"
                role="listitem"
                style={{ fontSize: 13, color: C.muted, textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => e.target.style.color = C.text}
                onMouseLeave={e => e.target.style.color = C.muted}
              >
                {item}
              </a>
            ))}
          </div>
 
          <div style={{ display: "flex", gap: 10 }}>
            <button
              style={{
                all: "unset",
                cursor: "pointer",
                fontSize: 13,
                color: C.textMuted,
                padding: "8px 16px",
                border: `1px solid ${C.border}`,
                borderRadius: 9,
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.electricDim; e.currentTarget.style.color = C.text; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMuted; }}
              aria-label="Se connecter"
            >
              Connexion
            </button>
            <button
              style={{
                all: "unset",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                color: "#fff",
                padding: "8px 16px",
                background: C.electric,
                borderRadius: 9,
                transition: "opacity 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              aria-label="Créer un compte"
            >
              Inscription
            </button>
          </div>
        </motion.nav>
<header style={{ textAlign: "center", padding: "72px 40px 60px" }}>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              fontWeight: 600,
              color: C.electric,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              background: `${C.electric}15`,
              border: `1px solid ${C.electric}30`,
              borderRadius: 99,
              padding: "5px 14px",
              marginBottom: 28,
            }}
          >
            <span aria-hidden="true">◉</span> Disponible à Tlemcen
          </motion.p>
 
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontSize: "clamp(36px, 5vw, 58px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.12,
              margin: "0 0 20px",
              color: C.text,
            }}
          >
            Trouvez le bon{" "}
            <span
              style={{
                color: "transparent",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                backgroundImage: `linear-gradient(135deg, ${C.electric}, ${C.electricLt})`,
              }}
            >
              réparateur
            </span>
            <br />
            près de chez vous
          </motion.h1>
 
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            style={{ fontSize: 16, color: C.muted, margin: "0 0 40px", lineHeight: 1.7, maxWidth: 460, marginInline: "auto" }}
          >
            Des artisans vérifiés, des tarifs transparents,
            une intervention rapide en Algérie.
          </motion.p>
 
          <SearchBar />
 
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ marginTop: 16, fontSize: 12, color: C.muted }}
          >
            Suggestions populaires :{" "}
            {["Plomberie urgente", "Panne électrique", "Peinture intérieure"].map((s, i) => (
              <button
                key={s}
                style={{
                  all: "unset",
                  cursor: "pointer",
                  color: C.electricLt,
                  marginLeft: i > 0 ? 12 : 6,
                  fontSize: 12,
                  textDecoration: "underline",
                  textDecorationColor: `${C.electric}50`,
                }}
                aria-label={`Rechercher : ${s}`}
              >
                {s}
              </button>
            ))}
          </motion.p>
        </header>
 
        {/* ── Stats Strip ── */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          aria-label="Chiffres clés de la plateforme"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 0,
            borderTop: `1px solid ${C.border}`,
            borderBottom: `1px solid ${C.border}`,
            marginBottom: 64,
          }}
        >
          {[
            { val: "1 400+", label: "Réparateurs" },
            { val: "48 villes", label: "Couverture" },
            { val: "4.8 / 5",  label: "Note moyenne" },
            { val: "< 2h",    label: "Intervention" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              style={{
                flex: 1,
                padding: "24px 20px",
                textAlign: "center",
                borderRight: i < 3 ? `1px solid ${C.border}` : "none",
              }}
            >
              <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: C.text, letterSpacing: "-0.02em" }}>
                {stat.val}
              </p>
              <p style={{ margin: "4px 0 0", fontSize: 12, color: C.muted }}>{stat.label}</p>
            </div>
          ))}
        </motion.section>
 
        {/* ── Main Content ── */}
        <main style={{ maxWidth: 1120, margin: "0 auto", padding: "0 40px 80px" }}>
 
          {/* ── Categories ── */}
          <section aria-labelledby="categories-title" style={{ marginBottom: 64 }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 28 }}>
              <h2 id="categories-title" style={{ margin: 0, fontSize: 20, fontWeight: 700, color: C.text, letterSpacing: "-0.02em" }}>
                Catégories de services
              </h2>
              <a href="#" style={{ fontSize: 13, color: C.electric, textDecoration: "none" }} aria-label="Voir toutes les catégories de services">
                Voir tout →
              </a>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                gap: 12,
              }}
              role="list"
            >
              {CATEGORIES.map((cat, i) => (
                <div key={cat.id} role="listitem">
                  <CategoryCard cat={cat} index={i} />
                </div>
              ))}
            </div>
          </section>
 
          {/* ── Featured Experts ── */}
          <section aria-labelledby="experts-title">
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 28 }}>
              <h2 id="experts-title" style={{ margin: 0, fontSize: 20, fontWeight: 700, color: C.text, letterSpacing: "-0.02em" }}>
                Réparateurs recommandés
              </h2>
              <a href="#" style={{ fontSize: 13, color: C.electric, textDecoration: "none" }} aria-label="Voir tous les réparateurs disponibles">
                Voir tout →
              </a>
            </div>
 
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: 12,
              }}
              role="list"
            >
              <AnimatePresence>
                {loading
                  ? [0, 1, 2].map(i => (
                      <div key={i} role="listitem" aria-busy="true" aria-label="Chargement du réparateur…">
                        <SkeletonCard />
                      </div>
                    ))
                  : FEATURED.map((expert, i) => (
                      <div key={expert.id} role="listitem">
                        <ExpertCard expert={expert} index={i} />
                      </div>
                    ))
                }
              </AnimatePresence>
            </div>
          </section>
      </main>
  {/* ── CTA Strip ── */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          aria-labelledby="cta-title"
          style={{
            background: C.surface,
            borderTop: `1px solid ${C.border}`,
            borderBottom: `1px solid ${C.border}`,
            padding: "56px 40px",
            textAlign: "center",
          }}
        >
          <h2 id="cta-title" style={{ margin: "0 0 12px", fontSize: 26, fontWeight: 800, color: C.text, letterSpacing: "-0.03em" }}>
            Vous êtes réparateur ?
          </h2>
          <p style={{ margin: "0 0 28px", fontSize: 15, color: C.muted, maxWidth: 380, marginInline: "auto", lineHeight: 1.7 }}>
            Rejoignez la plateforme et développez votre activité grâce à nos clients vérifiés.
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              all: "unset",
              cursor: "pointer",
              background: C.electric,
              color: "#fff",
              fontSize: 14,
              fontWeight: 700,
              padding: "13px 32px",
              borderRadius: 11,
              letterSpacing: "0.01em",
            }}
            aria-label="Créer un profil réparateur sur ServiceDZ"
          >
            Créer mon profil →
          </motion.button>
        </motion.section>
 
        {/* ── Footer ── */}
        <footer
          role="contentinfo"
          style={{
            padding: "28px 40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `1px solid ${C.border}`,
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 700, color: C.anthraLt, letterSpacing: "-0.01em" }}>
            Service<span style={{ color: C.electric }}>DZ</span>
          </span>
          <p style={{ margin: 0, fontSize: 12, color: C.muted }}>
            © 2025 ServiceDZ · Fait avec ❤ en Algérie
          </p>
          <nav aria-label="Liens légaux" style={{ display: "flex", gap: 20 }}>
            {["Confidentialité", "CGU", "Contact"].map(link => (
              <a
                key={link}
                href="#"
                style={{ fontSize: 12, color: C.muted, textDecoration: "none" }}
                onMouseEnter={e => e.target.style.color = C.text}
                onMouseLeave={e => e.target.style.color = C.muted}
              >
                {link}
              </a>
            ))}
          </nav>
        </footer>

      </div>
    </div>
  );
}