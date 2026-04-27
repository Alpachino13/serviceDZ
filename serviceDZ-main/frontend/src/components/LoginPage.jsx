import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Même palette que la HomePage ────────────────────────────────────────────
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
  borderFocus:"rgba(55,138,221,0.6)",
  text:       "#F1EFE8",
  textMuted:  "#B4B2A9",
  danger:     "#E24B4A",
  dangerBg:   "rgba(226,75,74,0.1)",
  success:    "#1D9E75",
};

// ─── Input Field ──────────────────────────────────────────────────────────────
function Field({ id, label, type = "text", value, onChange, placeholder, error, autoComplete, rightSlot }) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label
        htmlFor={id}
        style={{ fontSize: 12, fontWeight: 600, color: focused ? C.electric : C.mutedLt, letterSpacing: "0.06em", textTransform: "uppercase", transition: "color 0.2s" }}
      >
        {label}
      </label>
      <motion.div
        animate={{
          boxShadow: error
            ? `0 0 0 1.5px ${C.danger}`
            : focused
              ? `0 0 0 2px ${C.electric}88`
              : `0 0 0 1px ${C.border}`,
        }}
        transition={{ duration: 0.18 }}
        style={{ borderRadius: 12, position: "relative" }}
      >
        <div style={{
          display: "flex",
          alignItems: "center",
          background: focused ? C.surfaceLt : C.surface,
          border: `1px solid ${error ? C.danger + "80" : focused ? C.electric + "55" : C.border}`,
          borderRadius: 12,
          padding: "0 14px",
          gap: 10,
          transition: "background 0.2s, border-color 0.2s",
        }}>
          <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={placeholder}
            autoComplete={autoComplete}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            style={{
              flex: 1,
              border: "none",
              background: "transparent",
              outline: "none",
              fontSize: 15,
              color: C.text,
              padding: "14px 0",
              fontFamily: "inherit",
            }}
          />
          {rightSlot}
        </div>
      </motion.div>
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-error`}
            role="alert"
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            style={{ margin: 0, fontSize: 12, color: C.danger }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Eye toggle ───────────────────────────────────────────────────────────────
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

// ─── Spinner ──────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      style={{ width: 16, height: 16, border: `2px solid rgba(255,255,255,0.3)`, borderTop: "2px solid #fff", borderRadius: "50%" }}
    />
  );
}

// ─── Page principale ───────────────────────────────────────────────────────────
export default function LoginPage() {
  const [mode, setMode]         = useState("login");   // "login" | "register" | "forgot"
  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [successMsg, setSuccessMsg]   = useState("");

  const [form, setForm] = useState({
    email: "", password: "", confirmPassword: "", name: "", role: "client",
  });
  const [errors, setErrors] = useState({});

  const set = (key) => (e) => {
    setForm(f => ({ ...f, [key]: e.target.value }));
    setErrors(err => ({ ...err, [key]: "" }));
    setGlobalError("");
  };

  // ─── Validation ─────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.email)                       e.email = "L'adresse e-mail est requise.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Adresse e-mail invalide.";

    if (mode !== "forgot") {
      if (!form.password)                   e.password = "Le mot de passe est requis.";
      else if (form.password.length < 6)    e.password = "Minimum 6 caractères.";
    }
    if (mode === "register") {
      if (!form.name)                       e.name = "Le nom est requis.";
      if (form.password !== form.confirmPassword) e.confirmPassword = "Les mots de passe ne correspondent pas.";
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

    const apiUrl = (process.env.REACT_APP_API_URL || "").replace(/\/$/, "");
    const endpoints = {
      login:    "/api/auth/login",
      register: "/api/auth/register",
      forgot:   "/api/auth/forgot-password",
    };

    const body = mode === "login"
      ? { email: form.email, password: form.password }
      : mode === "register"
        ? { name: form.name, email: form.email, password: form.password, role: form.role }
        : { email: form.email };

    try {
      const res = await fetch(`${apiUrl}${endpoints[mode]}`, {
        method: "POST",
        headers:{
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true"},
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `Erreur HTTP ${res.status}`);

      if (mode === "login") {
        if (data.token) localStorage.setItem("sdz_token", data.token);
        setSuccessMsg("Connexion réussie ! Redirection…");
        setTimeout(() => { window.location.href = "/"; }, 1200);
      } else if (mode === "register") {
        setSuccessMsg("Compte créé ! Vous pouvez maintenant vous connecter.");
        setTimeout(() => setMode("login"), 1800);
      } else {
        setSuccessMsg("Un lien de réinitialisation a été envoyé à votre adresse e-mail.");
      }
    } catch (err) {
      setGlobalError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleSubmit(); };

  // ─── Labels par mode ─────────────────────────────────────────────────────────
  const LABELS = {
    login:    { title: "Bon retour", sub: "Connectez-vous à votre compte ServiceDZ", cta: "Se connecter", alt: "Pas encore de compte ?", altAction: "register", altLabel: "Créer un compte" },
    register: { title: "Rejoignez-nous", sub: "Créez votre compte en quelques secondes", cta: "Créer mon compte", alt: "Déjà un compte ?", altAction: "login", altLabel: "Se connecter" },
    forgot:   { title: "Mot de passe oublié", sub: "Entrez votre e-mail pour recevoir un lien de réinitialisation", cta: "Envoyer le lien", alt: "Je me souviens !", altAction: "login", altLabel: "Retour" },
  };
  const L = LABELS[mode];

  const switchMode = (m) => {
    setMode(m);
    setErrors({});
    setGlobalError("");
    setSuccessMsg("");
    setShowPass(false);
    setShowPass2(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: C.walnut, display: "flex", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: C.text }}>

      {/* ── Grille décorative ── */}
      <div aria-hidden="true" style={{ position: "fixed", inset: 0, backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`, backgroundSize: "48px 48px", pointerEvents: "none", zIndex: 0 }} />

      {/* ── Orbe ── */}
      <div aria-hidden="true" style={{ position: "fixed", bottom: -100, right: -100, width: 480, height: 480, background: `radial-gradient(ellipse at center, ${C.electric}18 0%, transparent 65%)`, pointerEvents: "none", zIndex: 0 }} />
      <div aria-hidden="true" style={{ position: "fixed", top: -80, left: -80, width: 360, height: 360, background: `radial-gradient(ellipse at center, ${C.electricDim}14 0%, transparent 65%)`, pointerEvents: "none", zIndex: 0 }} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1, padding: "40px 20px" }}>

        {/* Logo */}
        <motion.a
          href="/"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          aria-label="ServiceDZ - Retour à l'accueil"
          style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", marginBottom: 40 }}
        >
          <div style={{ width: 32, height: 32, borderRadius: 9, background: C.electric, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }} aria-hidden="true">⚙</div>
          <span style={{ fontSize: 19, fontWeight: 800, letterSpacing: "-0.03em", color: C.text }}>
            Service<span style={{ color: C.electric }}>DZ</span>
          </span>
        </motion.a>

        {/* Card */}
        <motion.div
          layout
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: "100%",
            maxWidth: 420,
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 20,
            padding: "36px 36px 32px",
            boxShadow: "0 24px 64px rgba(0,0,0,0.45)",
          }}
        >
          {/* Header */}
          <AnimatePresence mode="wait">
            <motion.div
              key={mode + "-header"}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              style={{ marginBottom: 28 }}
            >
              <h1 style={{ margin: "0 0 6px", fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em", color: C.text }}>{L.title}</h1>
              <p style={{ margin: 0, fontSize: 13, color: C.muted, lineHeight: 1.5 }}>{L.sub}</p>
            </motion.div>
          </AnimatePresence>

          {/* Global error */}
          <AnimatePresence>
            {globalError && (
              <motion.div
                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                role="alert" aria-live="assertive"
                style={{ background: C.dangerBg, border: `1px solid ${C.danger}40`, borderRadius: 10, padding: "10px 14px", marginBottom: 20, fontSize: 13, color: C.danger, display: "flex", gap: 8, alignItems: "flex-start" }}
              >
                <span aria-hidden="true" style={{ flexShrink: 0, marginTop: 1 }}>⚠</span>
                {globalError}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success */}
          <AnimatePresence>
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                role="status" aria-live="polite"
                style={{ background: `${C.success}15`, border: `1px solid ${C.success}40`, borderRadius: 10, padding: "10px 14px", marginBottom: 20, fontSize: 13, color: C.success, display: "flex", gap: 8, alignItems: "flex-start" }}
              >
                <span aria-hidden="true" style={{ flexShrink: 0 }}>✓</span>
                {successMsg}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form fields */}
          <AnimatePresence mode="wait">
            <motion.div
              key={mode + "-form"}
              initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.22 }}
              style={{ display: "flex", flexDirection: "column", gap: 18 }}
              onKeyDown={handleKeyDown}
            >
              {/* Nom — register seulement */}
              {mode === "register" && (
                <Field
                  id="name" label="Nom complet"
                  value={form.name} onChange={set("name")}
                  placeholder="Karim Bensalem"
                  autoComplete="name"
                  error={errors.name}
                />
              )}

              {/* Email */}
              <Field
                id="email" label="Adresse e-mail" type="email"
                value={form.email} onChange={set("email")}
                placeholder="vous@example.com"
                autoComplete="email"
                error={errors.email}
              />

              {/* Mot de passe */}
              {mode !== "forgot" && (
                <Field
                  id="password" label="Mot de passe"
                  type={showPass ? "text" : "password"}
                  value={form.password} onChange={set("password")}
                  placeholder="••••••••"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  error={errors.password}
                  rightSlot={
                    <button
                      type="button"
                      onClick={() => setShowPass(v => !v)}
                      aria-label={showPass ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                      style={{ all: "unset", cursor: "pointer", color: C.muted, display: "flex", alignItems: "center", padding: "2px", flexShrink: 0 }}
                    >
                      <EyeIcon visible={showPass} />
                    </button>
                  }
                />
              )}

              {/* Confirmer mdp — register seulement */}
              {mode === "register" && (
                <Field
                  id="confirmPassword" label="Confirmer le mot de passe"
                  type={showPass2 ? "text" : "password"}
                  value={form.confirmPassword} onChange={set("confirmPassword")}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  error={errors.confirmPassword}
                  rightSlot={
                    <button
                      type="button"
                      onClick={() => setShowPass2(v => !v)}
                      aria-label={showPass2 ? "Masquer" : "Afficher"}
                      style={{ all: "unset", cursor: "pointer", color: C.muted, display: "flex", alignItems: "center", padding: "2px", flexShrink: 0 }}
                    >
                      <EyeIcon visible={showPass2} />
                    </button>
                  }
                />
              )}

              {/* Role selector — register seulement */}
              {mode === "register" && (
                <fieldset style={{ border: "none", margin: 0, padding: 0 }}>
                  <legend style={{ fontSize: 12, fontWeight: 600, color: C.mutedLt, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>
                    Je suis…
                  </legend>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {[{ value: "client", label: "👤 Client", desc: "Je cherche un artisan" }, { value: "artisan", label: "🔧 Artisan", desc: "Je propose mes services" }].map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, role: opt.value }))}
                        aria-pressed={form.role === opt.value}
                        style={{
                          all: "unset",
                          cursor: "pointer",
                          padding: "12px 14px",
                          borderRadius: 10,
                          border: `1px solid ${form.role === opt.value ? C.electric + "70" : C.border}`,
                          background: form.role === opt.value ? `${C.electric}12` : C.surface,
                          textAlign: "left",
                          transition: "all 0.18s",
                        }}
                      >
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: form.role === opt.value ? C.electric : C.text }}>{opt.label}</p>
                        <p style={{ margin: "2px 0 0", fontSize: 11, color: C.muted }}>{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </fieldset>
              )}

              {/* Mot de passe oublié link — login seulement */}
              {mode === "login" && (
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: -8 }}>
                  <button
                    type="button"
                    onClick={() => switchMode("forgot")}
                    style={{ all: "unset", cursor: "pointer", fontSize: 12, color: C.electric, textDecoration: "underline", textDecorationColor: `${C.electric}50` }}
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
              )}

              {/* Submit */}
              <motion.button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                whileHover={!loading ? { scale: 1.02 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                style={{
                  all: "unset",
                  marginTop: 4,
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  background: loading ? C.electricDim : C.electric,
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 700,
                  padding: "14px",
                  borderRadius: 12,
                  letterSpacing: "0.01em",
                  transition: "background 0.2s",
                  width: "100%",
                  boxSizing: "border-box",
                }}
                aria-busy={loading}
              >
                {loading ? <><Spinner /> Chargement…</> : L.cta}
              </motion.button>
            </motion.div>
          </AnimatePresence>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
            <div style={{ flex: 1, height: 1, background: C.border }} />
            <span style={{ fontSize: 11, color: C.muted, letterSpacing: "0.05em" }}>OU</span>
            <div style={{ flex: 1, height: 1, background: C.border }} />
          </div>

          {/* Switch mode */}
          <p style={{ margin: 0, textAlign: "center", fontSize: 13, color: C.muted }}>
            {L.alt}{" "}
            <button
              type="button"
              onClick={() => switchMode(L.altAction)}
              style={{ all: "unset", cursor: "pointer", color: C.electric, fontWeight: 600, textDecoration: "underline", textDecorationColor: `${C.electric}50` }}
            >
              {L.altLabel}
            </button>
          </p>
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
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
