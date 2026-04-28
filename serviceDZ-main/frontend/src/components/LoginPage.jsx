// src/components/LoginPage.jsx
// Connecté directement à ton server.js Ubuntu
// POST /api/login    → connexion avec JWT
// POST /api/register → inscription avec JWT

import { useState } from "react";
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
  danger:     "#E24B4A",
  dangerBg:   "rgba(226,75,74,0.08)",
  success:    "#1D9E75",
};

const API = (process.env.REACT_APP_API_URL || "").replace(/\/$/, "");

// ─── Helpers ──────────────────────────────────────────────────────────────────
function saveSession(token, user) {
  localStorage.setItem("sdz_token", token);
  localStorage.setItem("sdz_user",  JSON.stringify(user));
}

export function getToken() {
  return localStorage.getItem("sdz_token");
}

export function getUser() {
  try { return JSON.parse(localStorage.getItem("sdz_user")); }
  catch { return null; }
}

export function logout() {
  localStorage.removeItem("sdz_token");
  localStorage.removeItem("sdz_user");
  window.location.href = "/login";
}

// ─── Field ────────────────────────────────────────────────────────────────────
function Field({ id, label, type = "text", value, onChange, placeholder, error, autoComplete, rightSlot }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label htmlFor={id} style={{ fontSize: 12, fontWeight: 600, color: focused ? C.electric : C.mutedLt, letterSpacing: "0.06em", textTransform: "uppercase", transition: "color 0.2s" }}>
        {label}
      </label>
      <motion.div
        animate={{ boxShadow: error ? `0 0 0 1.5px ${C.danger}` : focused ? `0 0 0 2px ${C.electric}88` : `0 0 0 1px ${C.border}` }}
        transition={{ duration: 0.18 }} style={{ borderRadius: 12 }}
      >
        <div style={{ display: "flex", alignItems: "center", background: focused ? C.surfaceLt : C.surface, border: `1px solid ${error ? C.danger + "80" : focused ? C.electric + "55" : C.border}`, borderRadius: 12, padding: "0 14px", gap: 10, transition: "all 0.2s" }}>
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
          <motion.p id={`${id}-error`} role="alert" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
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
      style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%" }}
    />
  );
}

// ─── Page Login ───────────────────────────────────────────────────────────────
export default function LoginPage() {
  const navigate = useNavigate();

  const [mode, setMode]         = useState("login"); // "login" | "register"
  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [successMsg, setSuccessMsg]   = useState("");

  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", role: "client" });
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
    if (!form.password)                         e.password = "Le mot de passe est requis.";
    else if (form.password.length < 6)          e.password = "Minimum 6 caractères.";
    if (mode === "register") {
      if (!form.name)                                       e.name            = "Le nom est requis.";
      if (form.password !== form.confirmPassword)           e.confirmPassword = "Les mots de passe ne correspondent pas.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ─── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setGlobalError("");
    setSuccessMsg("");

    const endpoint = mode === "login" ? "/api/login" : "/api/register";
    const body     = mode === "login"
      ? { email: form.email, password: form.password }
      : { name: form.name, email: form.email, password: form.password, role: form.role };

    try {
      const res  = await fetch(`${API}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        // Traduction des erreurs serveur
        const msg = data.error || data.message || `Erreur ${res.status}`;
        if (msg.includes("Email") || msg.includes("mot de passe") || msg.includes("incorrect")) {
          setGlobalError("Email ou mot de passe incorrect.");
        } else if (msg.includes("existe") || msg.includes("duplicate") || res.status === 409) {
          setGlobalError("Un compte existe déjà avec cet email.");
        } else {
          setGlobalError(msg);
        }
        return;
      }

      // ✅ Succès
      saveSession(data.token, data.user);

      if (mode === "login") {
        setSuccessMsg("Connexion réussie ! Redirection…");
        // Redirige selon le rôle
        setTimeout(() => {
          const role = data.user?.role;
          if (role === "client")  navigate("/dashboard/client");
          else if (role === "artisan" || role === "worker") navigate("/dashboard/artisan");
          else navigate("/dashboard");
        }, 800);
      } else {
        setSuccessMsg("Compte créé avec succès ! Redirection…");
        setTimeout(() => {
          const role = data.user?.role;
          if (role === "client")  navigate("/dashboard/client");
          else if (role === "artisan" || role === "worker") navigate("/dashboard/artisan");
          else navigate("/dashboard");
        }, 800);
      }

    } catch (err) {
      console.error(err);
      setGlobalError("Impossible de contacter le serveur. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (m) => {
    setMode(m); setErrors({}); setGlobalError(""); setSuccessMsg("");
    setShowPass(false); setShowPass2(false);
  };

  const handleKeyDown = (e) => { if (e.key === "Enter" && !loading) handleSubmit(); };

  const LABELS = {
    login:    { title: "Bon retour",    sub: "Connectez-vous à votre compte ServiceDZ",    cta: "Se connecter",    alt: "Pas encore de compte ?", altAction: "register", altLabel: "Créer un compte" },
    register: { title: "Rejoignez-nous", sub: "Créez votre compte ServiceDZ gratuitement", cta: "Créer mon compte", alt: "Déjà un compte ?",       altAction: "login",    altLabel: "Se connecter" },
  };
  const L = LABELS[mode];

  return (
    <div style={{ minHeight: "100vh", background: C.walnut, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: C.text, position: "relative", padding: "40px 20px" }}>

      {/* Déco */}
      <div aria-hidden="true" style={{ position: "fixed", inset: 0, backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`, backgroundSize: "48px 48px", pointerEvents: "none", zIndex: 0 }} />
      <div aria-hidden="true" style={{ position: "fixed", bottom: -100, right: -100, width: 480, height: 480, background: `radial-gradient(ellipse, ${C.electric}18 0%, transparent 65%)`, pointerEvents: "none", zIndex: 0 }} />
      <div aria-hidden="true" style={{ position: "fixed", top: -80, left: -80, width: 360, height: 360, background: `radial-gradient(ellipse, ${C.electricDim}14 0%, transparent 65%)`, pointerEvents: "none", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 420 }}>

        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 36, cursor: "pointer" }}
        >
          <div style={{ width: 32, height: 32, borderRadius: 9, background: C.electric, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⚙</div>
          <span style={{ fontSize: 19, fontWeight: 800, letterSpacing: "-0.03em" }}>Service<span style={{ color: C.electric }}>DZ</span></span>
        </motion.div>

        {/* Card */}
        <motion.div layout initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: "36px 36px 32px", boxShadow: "0 24px 64px rgba(0,0,0,0.45)" }}
        >
          {/* Titre */}
          <AnimatePresence mode="wait">
            <motion.div key={mode + "-h"} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} style={{ marginBottom: 24 }}>
              <h1 style={{ margin: "0 0 6px", fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em" }}>{L.title}</h1>
              <p style={{ margin: 0, fontSize: 13, color: C.muted, lineHeight: 1.5 }}>{L.sub}</p>
            </motion.div>
          </AnimatePresence>

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
                style={{ background: `${C.success}12`, border: `1px solid ${C.success}40`, borderRadius: 10, padding: "10px 14px", marginBottom: 20, fontSize: 13, color: C.success, display: "flex", gap: 8 }}
              >
                <span>✓</span>{successMsg}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Formulaire */}
          <AnimatePresence mode="wait">
            <motion.div key={mode + "-form"} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }}
              style={{ display: "flex", flexDirection: "column", gap: 18 }} onKeyDown={handleKeyDown}
            >
              {/* Nom — register uniquement */}
              {mode === "register" && (
                <Field id="name" label="Nom complet" value={form.name} onChange={set("name")} placeholder="Karim Bensalem" autoComplete="name" error={errors.name} />
              )}

              {/* Email */}
              <Field id="email" label="Adresse e-mail" type="email" value={form.email} onChange={set("email")} placeholder="vous@example.com" autoComplete="email" error={errors.email} />

              {/* Mot de passe */}
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

              {/* Confirmer mdp — register */}
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

              {/* Rôle — register */}
              {mode === "register" && (
                <fieldset style={{ border: "none", margin: 0, padding: 0 }}>
                  <legend style={{ fontSize: 12, fontWeight: 600, color: C.mutedLt, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>Je suis…</legend>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {[
                      { value: "client",  label: "👤 Client",  desc: "Je cherche un artisan" },
                      { value: "artisan", label: "🔧 Artisan", desc: "Je propose mes services" },
                    ].map(opt => (
                      <button key={opt.value} type="button" onClick={() => setForm(f => ({ ...f, role: opt.value }))}
                        aria-pressed={form.role === opt.value}
                        style={{ all: "unset", cursor: "pointer", padding: "11px 14px", borderRadius: 10, border: `1px solid ${form.role === opt.value ? C.electric + "70" : C.border}`, background: form.role === opt.value ? `${C.electric}12` : "transparent", textAlign: "left", transition: "all 0.18s" }}
                      >
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: form.role === opt.value ? C.electric : C.text }}>{opt.label}</p>
                        <p style={{ margin: "2px 0 0", fontSize: 11, color: C.muted }}>{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </fieldset>
              )}

              {/* Submit */}
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

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          style={{ marginTop: 24, fontSize: 11, color: C.muted, textAlign: "center", lineHeight: 1.6 }}
        >
          En continuant, vous acceptez nos{" "}
          <a href="#" style={{ color: C.electricLt, textDecoration: "none" }}>CGU</a> et notre{" "}
          <a href="#" style={{ color: C.electricLt, textDecoration: "none" }}>Politique de confidentialité</a>.
        </motion.p>
      </div>
    </div>
  );
}
