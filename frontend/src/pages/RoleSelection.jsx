// src/pages/RoleSelection.jsx
// Affiché après le premier login si l'utilisateur n'a pas encore de rôle en DB

import { useState } from "react";
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
  success:    "#1D9E75",
  danger:     "#E24B4A",
};

const ROLES = [
  {
    id: "client",
    icon: "👤",
    title: "Je suis un Client",
    desc: "Je cherche des artisans qualifiés pour mes projets de réparation et rénovation.",
    perks: ["Publiez vos demandes gratuitement", "Recevez des devis en 2h", "Accédez aux avis vérifiés"],
    color: "#378ADD",
  },
  {
    id: "artisan",
    icon: "🔧",
    title: "Je suis un Artisan",
    desc: "Je propose mes services et veux développer mon activité sur ServiceDZ.",
    perks: ["Recevez des missions près de chez vous", "Gérez votre agenda", "Augmentez votre visibilité"],
    color: "#1D9E75",
  },
];

function Spinner() {
  return (
    <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%" }} />
  );
}

export default function RoleSelection() {
  const { user, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handleConfirm = async () => {
    if (!selected) return;
    setLoading(true);
    setError("");

    const apiUrl = (process.env.REACT_APP_API_URL || "").replace(/\/$/, "");

    try {
      const token = await getAccessTokenSilently();

      const res = await fetch(`${apiUrl}/api/users/role`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          role: selected,
          auth0Id: user.sub,
          email: user.email,
          name: user.name,
          picture: user.picture,
        }),
      });

      if (!res.ok) throw new Error(`Erreur ${res.status}`);

      // Redirige vers le bon dashboard
      navigate(selected === "client" ? "/dashboard/client" : "/dashboard/artisan");

    } catch (err) {
      console.error(err);
      setError("Impossible de sauvegarder votre rôle. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: C.walnut, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: C.text, padding: "40px 20px", position: "relative" }}>

      {/* Grille */}
      <div aria-hidden="true" style={{ position: "fixed", inset: 0, backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`, backgroundSize: "48px 48px", pointerEvents: "none", zIndex: 0 }} />
      <div aria-hidden="true" style={{ position: "fixed", top: -160, left: "50%", transform: "translateX(-50%)", width: 600, height: 400, background: `radial-gradient(ellipse, ${C.electric}18 0%, transparent 65%)`, pointerEvents: "none", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 700 }}>

        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 48 }}
        >
          <div style={{ width: 32, height: 32, borderRadius: 9, background: C.electric, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⚙</div>
          <span style={{ fontSize: 19, fontWeight: 800, letterSpacing: "-0.03em" }}>Service<span style={{ color: C.electric }}>DZ</span></span>
        </motion.div>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: 40 }}
        >
          <p style={{ margin: "0 0 12px", fontSize: 13, color: C.electric, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Bienvenue {user?.name?.split(" ")[0]} 👋
          </p>
          <h1 style={{ margin: "0 0 12px", fontSize: 32, fontWeight: 800, letterSpacing: "-0.03em" }}>
            Vous êtes…
          </h1>
          <p style={{ margin: 0, fontSize: 15, color: C.muted, lineHeight: 1.6 }}>
            Choisissez votre profil pour personnaliser votre expérience ServiceDZ.
          </p>
        </motion.div>

        {/* Role Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
          {ROLES.map((role, i) => (
            <motion.button
              key={role.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => setSelected(role.id)}
              aria-pressed={selected === role.id}
              style={{
                all: "unset",
                cursor: "pointer",
                background: selected === role.id ? `${role.color}12` : C.surface,
                border: `2px solid ${selected === role.id ? role.color : C.border}`,
                borderRadius: 18,
                padding: "28px 24px",
                textAlign: "left",
                transition: "all 0.22s ease",
                position: "relative",
                boxShadow: selected === role.id ? `0 0 32px ${role.color}20` : "none",
              }}
            >
              {/* Check badge */}
              <AnimatePresence>
                {selected === role.id && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    style={{ position: "absolute", top: 16, right: 16, width: 22, height: 22, borderRadius: "50%", background: role.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff", fontWeight: 700 }}
                  >✓</motion.div>
                )}
              </AnimatePresence>

              <div style={{ fontSize: 36, marginBottom: 14 }}>{role.icon}</div>
              <h2 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: selected === role.id ? role.color : C.text, letterSpacing: "-0.02em", transition: "color 0.2s" }}>
                {role.title}
              </h2>
              <p style={{ margin: "0 0 16px", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{role.desc}</p>

              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                {role.perks.map(perk => (
                  <li key={perk} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: C.mutedLt }}>
                    <span style={{ color: role.color, flexShrink: 0 }}>✓</span> {perk}
                  </li>
                ))}
              </ul>

              {/* Bottom bar */}
              <motion.div
                animate={{ width: selected === role.id ? "100%" : "0%" }}
                transition={{ duration: 0.3 }}
                style={{ position: "absolute", bottom: 0, left: 0, height: 3, background: role.color, borderRadius: "0 0 18px 18px" }}
              />
            </motion.button>
          ))}
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              role="alert" style={{ margin: "0 0 16px", textAlign: "center", fontSize: 13, color: C.danger }}
            >⚠ {error}</motion.p>
          )}
        </AnimatePresence>

        {/* Confirm button */}
        <motion.button
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          onClick={handleConfirm}
          disabled={!selected || loading}
          whileHover={selected && !loading ? { scale: 1.02 } : {}}
          whileTap={selected && !loading ? { scale: 0.98 } : {}}
          style={{
            all: "unset",
            cursor: selected && !loading ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            width: "100%",
            boxSizing: "border-box",
            padding: "16px",
            borderRadius: 13,
            background: selected ? (selected === "client" ? C.electric : C.success) : C.anthracite,
            color: selected ? "#fff" : C.muted,
            fontSize: 15,
            fontWeight: 700,
            transition: "background 0.25s, color 0.25s",
            letterSpacing: "0.01em",
          }}
          aria-busy={loading}
          aria-disabled={!selected}
        >
          {loading ? (
            <><Spinner /> Enregistrement…</>
          ) : selected ? (
            `Continuer en tant que ${selected === "client" ? "Client" : "Artisan"} →`
          ) : (
            "Choisissez votre profil pour continuer"
          )}
        </motion.button>

        <p style={{ marginTop: 20, textAlign: "center", fontSize: 12, color: C.muted }}>
          Vous pourrez modifier votre profil dans les paramètres.
        </p>
      </div>
    </div>
  );
}
