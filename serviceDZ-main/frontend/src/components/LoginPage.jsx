// src/components/LoginPage.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react"; // Importation essentielle

const C = {
  walnut:     "#1A1410",
  anthracite: "#2C2C2A",
  electric:   "#378ADD",
  electricLt: "#85B7EB",
  electricDim:"#185FA5",
  surface:    "#201B16",
  surfaceLt:  "#261F19",
  border:     "rgba(255,255,255,0.07)",
  text:       "#F1EFE8",
  textMuted:  "#B4B2A9",
  danger:     "#E24B4A",
  dangerBg:   "rgba(226,75,74,0.08)",
};

// ─── Field Simplifié (Design conservé) ─────────────────────────────────────────
function Field({ id, label, type = "text", value, onChange, placeholder, error }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label htmlFor={id} style={{ fontSize: 12, fontWeight: 600, color: focused ? C.electric : "#B4B2A9", letterSpacing: "0.06em", textTransform: "uppercase", transition: "color 0.2s" }}>
        {label}
      </label>
      <motion.div
        animate={{ boxShadow: error ? `0 0 0 1.5px ${C.danger}` : focused ? `0 0 0 2px ${C.electric}88` : `0 0 0 1px ${C.border}` }}
        style={{ borderRadius: 12 }}
      >
        <input
          id={id} type={type} value={value} onChange={onChange}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          placeholder={placeholder}
          style={{ width: "100%", background: focused ? C.surfaceLt : C.surface, border: `1px solid ${error ? C.danger + "80" : focused ? C.electric + "55" : C.border}`, borderRadius: 12, padding: "14px", fontSize: 15, color: C.text, outline: "none", boxSizing: "border-box" }}
        />
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginWithRedirect } = useAuth0();
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  // Déclenche Auth0 avec les bons paramètres
  const handleAuth = () => {
    if (mode === "register") {
      loginWithRedirect({
        authorizationParams: { 
          screen_hint: 'signup',
          login_hint: email // Pré-remplit l'email sur Auth0 !
        }
      });
    } else {
      loginWithRedirect({
        authorizationParams: { login_hint: email }
      });
    }
  };

  const LABELS = {
    login:    { title: "Bon retour",    sub: "Connectez-vous à ServiceDZ via Auth0", cta: "Continuer vers la connexion", alt: "Pas encore de compte ?", altLabel: "Créer un compte", action: "register" },
    register: { title: "Rejoignez-nous", sub: "Créez votre compte sécurisé ServiceDZ", cta: "Continuer vers l'inscription", alt: "Déjà un compte ?", altLabel: "Se connecter", action: "login" },
  };
  const L = LABELS[mode];

  return (
    <div style={{ minHeight: "100vh", background: C.walnut, display: "flex", alignItems: "center", justifyContent: "center", color: C.text, position: "relative", padding: "20px" }}>
      
      {/* Background Design (Conservé) */}
      <div aria-hidden="true" style={{ position: "fixed", inset: 0, backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`, backgroundSize: "48px 48px", pointerEvents: "none" }} />
      <div aria-hidden="true" style={{ position: "fixed", bottom: -100, right: -100, width: 400, height: 400, background: `radial-gradient(circle, ${C.electric}15 0%, transparent 70%)` }} />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 400 }}>
        
        {/* Logo (Conservé) */}
        <div onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 30, cursor: "pointer" }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: C.electric, display: "flex", alignItems: "center", justifyContent: "center" }}>⚙</div>
          <span style={{ fontSize: 20, fontWeight: 800 }}>Service<span style={{ color: C.electric }}>DZ</span></span>
        </div>

        {/* Card (Design conservé) */}
        <motion.div layout style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: "36px", boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}>
          
          <h1 style={{ margin: "0 0 8px", fontSize: 24, fontWeight: 800 }}>{L.title}</h1>
          <p style={{ margin: "0 0 24px", fontSize: 13, color: "#888780" }}>{L.sub}</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* On ne garde que l'Email pour le design et le login_hint */}
            <Field 
              label="Adresse e-mail (optionnel)" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="votre@email.com" 
            />

            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={handleAuth}
              style={{ all: "unset", cursor: "pointer", background: C.electric, color: "#fff", textAlign: "center", padding: "14px", borderRadius: 12, fontWeight: 700, fontSize: 14 }}
            >
              {L.cta}
            </motion.button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
            <div style={{ flex: 1, height: 1, background: C.border }} />
            <span style={{ fontSize: 11, color: "#888780" }}>OU</span>
            <div style={{ flex: 1, height: 1, background: C.border }} />
          </div>

          {/* Bouton Social (Nouveau & Pro) */}
          <button 
            onClick={() => loginWithRedirect({ authorizationParams: { connection: 'google-oauth2' } })}
            style={{ all: "unset", width: "100%", boxSizing: "border-box", cursor: "pointer", border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontSize: 14, fontWeight: 600 }}
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18" alt="" />
            Continuer avec Google
          </button>

          <p style={{ marginTop: 24, textAlign: "center", fontSize: 13, color: "#888780" }}>
            {L.alt}{" "}
            <span onClick={() => setMode(L.action)} style={{ color: C.electric, fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}>
              {L.altLabel}
            </span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}