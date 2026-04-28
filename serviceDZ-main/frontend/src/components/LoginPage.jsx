// ─── LoginPage.jsx ────────────────────────────────────────────────────────────
// Avec Auth0 Universal Login, cette page devient un simple bouton
// Auth0 gère tout : login, register, forgot password, CORS, tokens
// Plus besoin de formulaire custom ni de gestion CORS !

import { useAuth0 } from "@auth0/auth0-react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const C = {
  walnut:     "#1A1410",
  anthraLt:   "#3D3D3A",
  muted:      "#888780",
  mutedLt:    "#B4B2A9",
  electric:   "#378ADD",
  electricLt: "#85B7EB",
  electricDim:"#185FA5",
  surface:    "#201B16",
  border:     "rgba(255,255,255,0.07)",
  text:       "#F1EFE8",
};

function Spinner() {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      style={{ width: 20, height: 20, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", margin: "0 auto" }}
    />
  );
}

export default function LoginPage() {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  // Si déjà connecté → redirige vers home
  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", background: C.walnut, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Spinner />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: C.walnut, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: C.text, position: "relative", padding: "40px 20px" }}>

      {/* Grille */}
      <div aria-hidden="true" style={{ position: "fixed", inset: 0, backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`, backgroundSize: "48px 48px", pointerEvents: "none", zIndex: 0 }} />
      {/* Orbes */}
      <div aria-hidden="true" style={{ position: "fixed", bottom: -100, right: -100, width: 480, height: 480, background: `radial-gradient(ellipse, ${C.electric}18 0%, transparent 65%)`, pointerEvents: "none", zIndex: 0 }} />
      <div aria-hidden="true" style={{ position: "fixed", top: -80, left: -80, width: 360, height: 360, background: `radial-gradient(ellipse, ${C.electricDim}14 0%, transparent 65%)`, pointerEvents: "none", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 420, display: "flex", flexDirection: "column", alignItems: "center" }}>

        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 40, cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          <div style={{ width: 32, height: 32, borderRadius: 9, background: C.electric, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⚙</div>
          <span style={{ fontSize: 19, fontWeight: 800, letterSpacing: "-0.03em" }}>Service<span style={{ color: C.electric }}>DZ</span></span>
        </motion.div>

        {/* Card */}
        <motion.div initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: "40px 36px", boxShadow: "0 24px 64px rgba(0,0,0,0.45)", textAlign: "center" }}
        >
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>👋</div>
            <h1 style={{ margin: "0 0 10px", fontSize: 26, fontWeight: 800, letterSpacing: "-0.03em" }}>Bon retour</h1>
            <p style={{ margin: "0 0 32px", fontSize: 14, color: C.muted, lineHeight: 1.6 }}>
              Connectez-vous ou créez votre compte<br />pour accéder à ServiceDZ.
            </p>
          </motion.div>

          {/* Bouton Login */}
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => loginWithRedirect()}
            aria-label="Se connecter avec Auth0"
            style={{ all: "unset", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: C.electric, color: "#fff", fontSize: 15, fontWeight: 700, padding: "15px 32px", borderRadius: 12, width: "100%", boxSizing: "border-box", marginBottom: 12 }}
          >
            <span>🔐</span> Se connecter
          </motion.button>

          {/* Bouton Register */}
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => loginWithRedirect({ authorizationParams: { screen_hint: "signup" } })}
            aria-label="Créer un compte"
            style={{ all: "unset", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: "transparent", color: C.text, fontSize: 15, fontWeight: 600, padding: "15px 32px", borderRadius: 12, border: `1px solid ${C.border}`, width: "100%", boxSizing: "border-box" }}
          >
            <span>✨</span> Créer un compte
          </motion.button>
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          style={{ marginTop: 24, fontSize: 11, color: C.muted, textAlign: "center", maxWidth: 340, lineHeight: 1.6 }}
        >
          En continuant, vous acceptez nos{" "}
          <a href="#" style={{ color: C.electricLt, textDecoration: "none" }}>Conditions d'utilisation</a>
          {" "}et notre{" "}
          <a href="#" style={{ color: C.electricLt, textDecoration: "none" }}>Politique de confidentialité</a>.
        </motion.p>
      </div>
    </div>
  );
}
