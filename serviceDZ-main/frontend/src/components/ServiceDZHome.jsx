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

// ─── Composants Secondaires ───────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <motion.div
      initial={{ opacity: 0.4 }}
      animate={{ opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px 22px", display: "flex", gap: 14, alignItems: "center" }}
    >
      <div style={{ width: 48, height: 48, borderRadius: "50%", background: C.anthraLt, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ height: 14, width: "55%", background: C.anthraLt, borderRadius: 6, marginBottom: 8 }} />
        <div style={{ height: 12, width: "80%", background: C.anthracite, borderRadius: 6 }} />
      </div>
    </motion.div>
  );
}

function CategoryCard({ cat, index }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.button
      initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ all: "unset", cursor: "pointer", display: "flex", flexDirection: "column", gap: 12, background: hovered ? `${cat.color}12` : C.surface, border: `1px solid ${hovered ? cat.color + "55" : C.border}`, borderRadius: 16, padding: "20px", transition: "all 0.22s ease" }}
    >
      <span style={{ fontSize: 26 }}>{cat.icon}</span>
      <div>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: C.text }}>{cat.label}</p>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: C.muted }}>{cat.count} réparateurs</p>
      </div>
    </motion.button>
  );
}

function ExpertCard({ expert, index }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + 0.07 * index }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background: hovered ? `${expert.color}0F` : C.surface, border: `1px solid ${hovered ? expert.color + "44" : C.border}`, borderRadius: 16, padding: "20px 22px", display: "flex", gap: 14, alignItems: "center", cursor: "pointer", transition: "all 0.22s ease" }}
    >
      <div style={{ width: 48, height: 48, borderRadius: "50%", background: expert.color + "30", border: `1.5px solid ${expert.color}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: expert.color, flexShrink: 0 }}>
        {expert.initials}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: C.text }}>{expert.name}</p>
        <p style={{ margin: "3px 0 0", fontSize: 12, color: C.muted }}>{expert.specialty}</p>
      </div>
    </motion.article>
  );
}

// ─── Search Bar (Connectée) ───────────────────────────────────────────────────
function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const handleKeyDown = (e) => { if (e.key === 'Enter') onSearch(query); };

  return (
    <motion.div style={{ position: "relative", width: "100%", maxWidth: 600, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", background: C.surface, border: `1px solid ${focused ? C.electric : C.border}`, borderRadius: 14, padding: "0 16px", gap: 10 }}>
        <span style={{ color: focused ? C.electric : C.muted }}>⌕</span>
        <input
          type="search" placeholder="Plombier, électricien..." value={query}
          onChange={e => setQuery(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} onKeyDown={handleKeyDown}
          style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontSize: 15, color: C.text, padding: "16px 0" }}
        />
        <button onClick={() => onSearch(query)} style={{ all: "unset", cursor: "pointer", background: C.electric, color: "#fff", fontSize: 13, fontWeight: 600, padding: "9px 18px", borderRadius: 9 }}>
          Rechercher
        </button>
      </div>
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
    <div style={{ minHeight: "100vh", background: C.walnut, color: C.text, fontFamily: "sans-serif" }}>
      <nav style={{ display: "flex", justifyContent: "space-between", padding: "20px 40px", borderBottom: `1px solid ${C.border}` }}>
        <span style={{ fontWeight: 700 }}>Service<span style={{ color: C.electric }}>DZ</span></span>
      </nav>

      <header style={{ textAlign: "center", padding: "60px 20px" }}>
        <h1>Trouvez votre <span style={{ color: C.electric }}>réparateur</span></h1>
        <SearchBar onSearch={handleSearch} />
      </header>

      <main style={{ maxWidth: 1120, margin: "0 auto", padding: "0 20px" }}>
        
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

        {/* --- Catégories (Contenu Statique) --- */}
        <section style={{ marginBottom: 64 }}>
          <h2 style={{ fontSize: 20, marginBottom: 20 }}>Catégories</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12 }}>
            {CATEGORIES.map((cat, i) => <CategoryCard key={cat.id} cat={cat} index={i} />)}
          </div>
        </section>

      </main>
    </div>
  );
}