import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

// ─── Auth0 Config — depuis .env ───────────────────────────────────────────────
// Dans ton fichier .env à la racine du projet React, ajoute :
//   REACT_APP_AUTH0_DOMAIN=ton-tenant.auth0.com
//   REACT_APP_AUTH0_CLIENT_ID=ton_client_id
//   REACT_APP_AUTH0_CONNECTION=Username-Password-Authentication
//   REACT_APP_AUTH0_AUDIENCE=https://ton-tenant.auth0.com/api/v2/   (optionnel)

const AUTH0_DOMAIN     = process.env.REACT_APP_AUTH0_DOMAIN     || "";
const AUTH0_CLIENT_ID  = process.env.REACT_APP_AUTH0_CLIENT_ID  || "";
const AUTH0_CONNECTION = process.env.REACT_APP_AUTH0_CONNECTION  || "Username-Password-Authentication";
const AUTH0_AUDIENCE   = process.env.REACT_APP_AUTH0_AUDIENCE    || `https://${AUTH0_DOMAIN}/api/v2/`;

// ─── Auth0 API Calls ──────────────────────────────────────────────────────────
const auth0 = {
  // POST /oauth/token  → retourne access_token + id_token
  login: async ({ email, password }) => {
    const res = await fetch(`https://${AUTH0_DOMAIN}/oauth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "password",
        username: email,
        password,
        client_id: AUTH0_CLIENT_ID,
        connection: AUTH0_CONNECTION,
        audience: AUTH0_AUDIENCE,
        scope: "openid profile email",
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error_description || data.error || `Erreur ${res.status}`);
    return data; // { access_token, id_token, token_type, expires_in }
  },

  // POST /dbconnections/signup  → crée le compte dans la DB Auth0
register: async ({ email, password, name, role }) => {
  const res = await fetch(`https://${AUTH0_DOMAIN}/dbconnections/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: AUTH0_CLIENT_ID,
      connection: AUTH0_CONNECTION,
      email,
      password,
      name,
      // Ajout des métadonnées pour stocker le rôle
      user_metadata: {
        full_name: name,
        role: role || "client"
      },
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.description || data.error || `Erreur ${res.status}`);
  return data;
},

  // POST /dbconnections/change_password  → envoie un email de reset
  forgotPassword: async ({ email }) => {
    const res = await fetch(`https://${AUTH0_DOMAIN}/dbconnections/change_password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: AUTH0_CLIENT_ID,
        connection: AUTH0_CONNECTION,
        email,
      }),
    });
    // Auth0 retourne 200 avec du texte, pas du JSON
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Erreur ${res.status}`);
    }
    return true;
  },
};

// ─── Palette ──────────────────────────────────────────────────────────────────
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
  danger:     "#E24B4A",
  dangerBg:   "rgba(226,75,74,0.1)",
  success:    "#1D9E75",
};

// ─── Field Component ──────────────────────────────────────────────────────────
function Field({ id, label, type = "text", value, onChange, placeholder, error, autoComplete, rightSlot }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label htmlFor={id} style={{ fontSize: 12, fontWeight: 600, color: focused ? C.electric : C.mutedLt, letterSpacing: "0.06em", textTransform: "uppercase", transition: "color 0.2s" }}>
        {label}
      </label>
      <motion.div
        animate={{ boxShadow: error ? `0 0 0 1.5px ${C.danger}` : focused ? `0 0 0 2px ${C.electric}88` : `0 0 0 1px ${C.border}` }}
        transition={{ duration: 0.18 }}
        style={{ borderRadius: 12 }}
      >
        <div style={{ display: "flex", alignItems: "center", background: focused ? C.surfaceLt : C.surface, border: `1px solid ${error ? C.danger + "80" : focused ? C.electric + "55" : C.border}`, borderRadius: 12, padding: "0 14px", gap: 10, transition: "background 0.2s, border-color 0.2s" }}>
          <input
            id={id} type={type} value={value} onChange={onChange}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            placeholder={placeholder} autoComplete={autoComplete}
            aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined}
            style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontSize: 15, color: C.text, padding: "14px 0", fontFamily: "inherit" }}
          />
          {rightSlot}
        </div>
      </motion.div>
      <AnimatePresence>
        {error && (
          <motion.p id={`${id}-error`} role="alert" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.18 }}
            style={{ margin: 0, fontSize: 12, color: C.danger }}>{error}</motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function EyeIcon({ visible }) {
  return visible ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

function Spinner() {
  return (
    <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%" }} />
  );
}

// ─── Page Login ───────────────────────────────────────────────────────────────
export default function LoginPage() {
  const navigate = useNavigate();

  const [mode, setMode]           = useState("login"); // "login" | "register" | "forgot"
  const [showPass, setShowPass]   = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [successMsg, setSuccessMsg]   = useState("");

  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "", name: "" ,role: "client"});
  const [errors, setErrors] = useState({});

  const set = (key) => (e) => {
    setForm(f => ({ ...f, [key]: e.target.value }));
    setErrors(err => ({ ...err, [key]: "" }));
    setGlobalError("");
  };

  // ─── Validation ─────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.email)                            e.email    = "L'adresse e-mail est requise.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email    = "Adresse e-mail invalide.";
    if (mode !== "forgot") {
      if (!form.password)                       e.password = "Le mot de passe est requis.";
      else if (form.password.length < 8)        e.password = "Minimum 8 caractères (requis par Auth0).";
    }
    if (mode === "register") {
      if (!form.name)                           e.name     = "Le nom est requis.";
      if (form.password !== form.confirmPassword) e.confirmPassword = "Les mots de passe ne correspondent pas.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ─── Vérification config Auth0 ───────────────────────────────────────────────
  const checkConfig = () => {
    if (!AUTH0_DOMAIN || !AUTH0_CLIENT_ID) {
      setGlobalError(
        "⚙ Configuration manquante. Ajoute REACT_APP_AUTH0_DOMAIN et REACT_APP_AUTH0_CLIENT_ID dans ton fichier .env"
      );
      return false;
    }
    return true;
  };

  // ─── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validate() || !checkConfig()) return;
    setLoading(true);
    setGlobalError("");
    setSuccessMsg("");

    try {
      if (mode === "login") {
        const data = await auth0.login({ email: form.email, password: form.password });
        // Stocke les tokens
        localStorage.setItem("sdz_access_token", data.access_token);
        if (data.id_token) localStorage.setItem("sdz_id_token", data.id_token);
        setSuccessMsg("Connexion réussie ! Redirection…");
        setTimeout(() => navigate("/"), 1000);

      } else if (mode === "register") {
        await auth0.register({ 
  email: form.email, 
  password: form.password, 
  name: form.name,
  role: form.role // <--- Vérifiez que cette ligne est présente
});
    setSuccessMsg("Compte créé ! Vous pouvez maintenant vous connecter.");
      setTimeout(() => switchMode("login"), 1800);

      } else {
        await auth0.forgotPassword({ email: form.email });
        setSuccessMsg("Email de réinitialisation envoyé. Vérifiez votre boîte mail.");
      }
    } catch (err) {
      // Auth0 renvoie des messages en anglais, on les traduit
      const msg = err.message || "";
      if (msg.includes("Wrong email or password"))   setGlobalError("Email ou mot de passe incorrect.");
      else if (msg.includes("user is blocked"))       setGlobalError("Ce compte est bloqué. Contactez le support.");
      else if (msg.includes("user already exists"))   setGlobalError("Un compte existe déjà avec cet email.");
      else if (msg.includes("password is too weak"))  setGlobalError("Mot de passe trop faible. Utilisez majuscules, chiffres et symboles.");
      else if (msg.includes("invalid_grant"))         setGlobalError("Email ou mot de passe incorrect.");
      else if (msg.includes("too many attempts"))     setGlobalError("Trop de tentatives. Attendez quelques minutes.");
      else setGlobalError(msg || "Une erreur est survenue, réessayez.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (m) => {
    setMode(m);
    setErrors({});
    setGlobalError("");
    setSuccessMsg("");
    setShowPass(false);
    setShowPass2(false);
  };

  const handleKeyDown = (e) => { if (e.key === "Enter" && !loading) handleSubmit(); };

  const LABELS = {
    login:    { title: "Bon retour",          sub: "Connectez-vous à votre compte ServiceDZ",              cta: "Se connecter",    alt: "Pas encore de compte ?", altAction: "register", altLabel: "Créer un compte" },
    register: { title: "Rejoignez-nous",      sub: "Créez votre compte ServiceDZ gratuitement",            cta: "Créer mon compte", alt: "Déjà un compte ?",       altAction: "login",    altLabel: "Se connecter" },
    forgot:   { title: "Mot de passe oublié", sub: "Entrez votre e-mail, Auth0 vous enverra un lien reset", cta: "Envoyer le lien",  alt: "Je me souviens !",       altAction: "login",    altLabel: "Retour" },
  };
  const L = LABELS[mode];

  return (
    <div style={{ minHeight: "100vh", background: C.walnut, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: C.text, position: "relative", padding: "40px 20px" }}>

      {/* Grille */}
      <div aria-hidden="true" style={{ position: "fixed", inset: 0, backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`, backgroundSize: "48px 48px", pointerEvents: "none", zIndex: 0 }} />
      {/* Orbes */}
      <div aria-hidden="true" style={{ position: "fixed", bottom: -100, right: -100, width: 480, height: 480, background: `radial-gradient(ellipse, ${C.electric}18 0%, transparent 65%)`, pointerEvents: "none", zIndex: 0 }} />
      <div aria-hidden="true" style={{ position: "fixed", top: -80, left: -80, width: 360, height: 360, background: `radial-gradient(ellipse, ${C.electricDim}14 0%, transparent 65%)`, pointerEvents: "none", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 420, display: "flex", flexDirection: "column", alignItems: "center" }}>

        {/* Logo */}
        <motion.a href="/" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          aria-label="Retour à l'accueil"
          style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", marginBottom: 36 }}
        >
          <div style={{ width: 32, height: 32, borderRadius: 9, background: C.electric, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }} aria-hidden="true">⚙</div>
          <span style={{ fontSize: 19, fontWeight: 800, letterSpacing: "-0.03em", color: C.text }}>Service<span style={{ color: C.electric }}>DZ</span></span>
        </motion.a>

        {/* Card */}
        <motion.div layout initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: "36px 36px 32px", boxShadow: "0 24px 64px rgba(0,0,0,0.45)" }}
        >
          {/* Titre */}
          <AnimatePresence mode="wait">
            <motion.div key={mode + "-h"} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} style={{ marginBottom: 24 }}>
              <h1 style={{ margin: "0 0 6px", fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em" }}>{L.title}</h1>
              <p style={{ margin: 0, fontSize: 13, color: C.muted, lineHeight: 1.5 }}>{L.sub}</p>
            </motion.div>
          </AnimatePresence>

          {/* Alerte de config manquante */}
          {(!AUTH0_DOMAIN || !AUTH0_CLIENT_ID) && (
            <div role="alert" style={{ background: "rgba(239,159,39,0.1)", border: "1px solid rgba(239,159,39,0.35)", borderRadius: 10, padding: "10px 14px", marginBottom: 20, fontSize: 12, color: "#EF9F27", lineHeight: 1.6 }}>
              ⚙ <strong>Config manquante</strong><br />
              Crée un fichier <code style={{ background: "rgba(255,255,255,0.08)", padding: "1px 5px", borderRadius: 4 }}>.env</code> à la racine avec :<br />
              <code style={{ fontSize: 11, display: "block", marginTop: 6, color: "#EF9F2799" }}>
                REACT_APP_AUTH0_DOMAIN=ton-tenant.auth0.com<br />
                REACT_APP_AUTH0_CLIENT_ID=ton_client_id
              </code>
            </div>
          )}

          {/* Erreur globale */}
          <AnimatePresence>
            {globalError && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                role="alert" aria-live="assertive"
                style={{ background: C.dangerBg, border: `1px solid ${C.danger}40`, borderRadius: 10, padding: "10px 14px", marginBottom: 20, fontSize: 13, color: C.danger, display: "flex", gap: 8 }}
              >
                <span aria-hidden="true" style={{ flexShrink: 0 }}>⚠</span>{globalError}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Succès */}
          <AnimatePresence>
            {successMsg && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                role="status" aria-live="polite"
                style={{ background: `${C.success}15`, border: `1px solid ${C.success}40`, borderRadius: 10, padding: "10px 14px", marginBottom: 20, fontSize: 13, color: C.success, display: "flex", gap: 8 }}
              >
                <span aria-hidden="true" style={{ flexShrink: 0 }}>✓</span>{successMsg}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Champs */}
          <AnimatePresence mode="wait">
            <motion.div key={mode + "-form"} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }}
              style={{ display: "flex", flexDirection: "column", gap: 18 }} onKeyDown={handleKeyDown}
            >
              {mode === "register" && (
                <Field id="name" label="Nom complet" value={form.name} onChange={set("name")} placeholder="Karim Bensalem" autoComplete="name" error={errors.name} />
              )}

              <Field id="email" label="Adresse e-mail" type="email" value={form.email} onChange={set("email")} placeholder="vous@example.com" autoComplete="email" error={errors.email} />

              {mode !== "forgot" && (
                <Field
                  id="password" label="Mot de passe"
                  type={showPass ? "text" : "password"}
                  value={form.password} onChange={set("password")}
                  placeholder="••••••••"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  error={errors.password}
                  rightSlot={
                    <button type="button" onClick={() => setShowPass(v => !v)} aria-label={showPass ? "Masquer" : "Afficher"}
                      style={{ all: "unset", cursor: "pointer", color: C.muted, display: "flex", alignItems: "center", flexShrink: 0 }}>
                      <EyeIcon visible={showPass} />
                    </button>
                  }
                />
              )}

              {mode === "register" && (
                <Field
                  id="confirmPassword" label="Confirmer le mot de passe"
                  type={showPass2 ? "text" : "password"}
                  value={form.confirmPassword} onChange={set("confirmPassword")}
                  placeholder="••••••••" autoComplete="new-password" error={errors.confirmPassword}
                  rightSlot={
                    <button type="button" onClick={() => setShowPass2(v => !v)} aria-label={showPass2 ? "Masquer" : "Afficher"}
                      style={{ all: "unset", cursor: "pointer", color: C.muted, display: "flex", alignItems: "center", flexShrink: 0 }}>
                      <EyeIcon visible={showPass2} />
                    </button>
                  }
                />
              )}

              {mode === "login" && (
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: -8 }}>
                  <button type="button" onClick={() => switchMode("forgot")}
                    style={{ all: "unset", cursor: "pointer", fontSize: 12, color: C.electric, textDecoration: "underline" }}>
                    Mot de passe oublié ?
                  </button>
                </div>
              )}

              <motion.button type="button" onClick={handleSubmit} disabled={loading}
                whileHover={!loading ? { scale: 1.02 } : {}} whileTap={!loading ? { scale: 0.98 } : {}}
                aria-busy={loading}
                style={{ all: "unset", marginTop: 4, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: loading ? C.electricDim : C.electric, color: "#fff", fontSize: 14, fontWeight: 700, padding: "14px", borderRadius: 12, transition: "background 0.2s", width: "100%", boxSizing: "border-box" }}
              >
                {loading ? <><Spinner /> Chargement…</> : L.cta}
              </motion.button>
            </motion.div>
          </AnimatePresence>

          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
            <div style={{ flex: 1, height: 1, background: C.border }} />
            <span style={{ fontSize: 11, color: C.muted, letterSpacing: "0.05em" }}>OU</span>
            <div style={{ flex: 1, height: 1, background: C.border }} />
          </div>

          <p style={{ margin: 0, textAlign: "center", fontSize: 13, color: C.muted }}>
            {L.alt}{" "}
            <button type="button" onClick={() => switchMode(L.altAction)}
              style={{ all: "unset", cursor: "pointer", color: C.electric, fontWeight: 600, textDecoration: "underline" }}>
              {L.altLabel}
            </button>
          </p>
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          style={{ marginTop: 28, fontSize: 11, color: C.muted, textAlign: "center", maxWidth: 340, lineHeight: 1.6 }}
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
