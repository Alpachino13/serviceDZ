// src/components/LoginPage.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";

const API = (process.env.REACT_APP_API_URL || "").replace(/\/$/, "");
const AUTH0_DOMAIN    = process.env.REACT_APP_AUTH0_DOMAIN    || "";
const AUTH0_CLIENT_ID = process.env.REACT_APP_AUTH0_CLIENT_ID || "";

const F = "'Inter', 'Segoe UI', sans-serif";

const C = {
  bg:       "#111110",
  surface:  "#1A1918",
  surfaceLt:"#222120",
  border:   "rgba(255,255,255,0.08)",
  text:     "#F0EDE8",
  muted:    "#888580",
  electric: "#3B82F6",
  electricD:"#1D4ED8",
  success:  "#10B981",
  danger:   "#EF4444",
  dangerBg: "rgba(239,68,68,0.08)",
};

function saveSession(token, user) {
  localStorage.setItem("sdz_token", token);
  localStorage.setItem("sdz_user",  JSON.stringify(user));
}

// ─── Google OAuth via Auth0 ───────────────────────────────────────────────────
function loginWithGoogle() {
  if (!AUTH0_DOMAIN || !AUTH0_CLIENT_ID) {
    alert("Google login non configuré (variables AUTH0 manquantes)");
    return;
  }
  const redirect = encodeURIComponent(`${window.location.origin}/auth/callback`);
  const url = `https://${AUTH0_DOMAIN}/authorize`
    + `?response_type=code`
    + `&client_id=${AUTH0_CLIENT_ID}`
    + `&redirect_uri=${redirect}`
    + `&scope=openid%20profile%20email`
    + `&connection=google-oauth2`;
  window.location.href = url;
}

// ─── Field ────────────────────────────────────────────────────────────────────
function Field({ id, label, type = "text", value, onChange, placeholder, error, autoComplete, right }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label htmlFor={id} style={{ fontSize: 11, fontWeight: 600, color: focused ? C.electric : C.muted, letterSpacing: "0.07em", textTransform: "uppercase", fontFamily: F }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          id={id} type={type} value={value} onChange={onChange}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          placeholder={placeholder} autoComplete={autoComplete}
          aria-invalid={!!error}
          style={{
            width: "100%", boxSizing: "border-box",
            background: focused ? C.surfaceLt : C.surface,
            border: `1px solid ${error ? C.danger + "80" : focused ? C.electric + "70" : C.border}`,
            borderRadius: 10, padding: right ? "12px 44px 12px 14px" : "12px 14px",
            fontSize: 14, color: C.text, outline: "none", fontFamily: F,
            transition: "border-color 0.15s, background 0.15s",
            boxShadow: focused ? `0 0 0 3px ${C.electric}18` : "none",
          }}
        />
        {right && (
          <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }}>{right}</div>
        )}
      </div>
      {error && <p role="alert" style={{ margin: 0, fontSize: 11, color: C.danger, fontFamily: F }}>{error}</p>}
    </div>
  );
}

function EyeBtn({ show, toggle }) {
  return (
    <button type="button" onClick={toggle} aria-label={show ? "Masquer" : "Afficher"}
      style={{ all: "unset", cursor: "pointer", color: C.muted, display: "flex" }}>
      {show
        ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
      }
    </button>
  );
}

function Spinner() {
  return (
    <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
      style={{ width: 15, height: 15, border: "2px solid rgba(255,255,255,0.25)", borderTop: "2px solid #fff", borderRadius: "50%", display: "inline-block" }} />
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [mode, setMode]         = useState(searchParams.get("mode") === "register" ? "register" : "login");
  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [err, setErr]           = useState("");
  const [ok, setOk]             = useState("");
  const [form, setForm]         = useState({ name: "", email: "", password: "", confirm: "", role: "client" });
  const [errs, setErrs]         = useState({});

  const set = k => e => { setForm(f => ({ ...f, [k]: e.target.value })); setErrs(x => ({ ...x, [k]: "" })); setErr(""); };

  const validate = () => {
    const e = {};
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Email invalide.";
    if (!form.password || form.password.length < 6)       e.password = "Minimum 6 caractères.";
    if (mode === "register") {
      if (!form.name)                              e.name    = "Nom requis.";
      if (form.password !== form.confirm)          e.confirm = "Mots de passe différents.";
    }
    setErrs(e);
    return !Object.keys(e).length;
  };

  const submit = async () => {
    if (!validate()) return;
    setLoading(true); setErr(""); setOk("");
    const endpoint = mode === "login" ? "/api/login" : "/api/register";
    const body = mode === "login"
      ? { email: form.email, password: form.password }
      : { name: form.name, email: form.email, password: form.password, role: form.role };
    try {
      const res  = await fetch(`${API}${endpoint}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) { setErr(data.error || "Erreur de connexion."); return; }
      saveSession(data.token, data.user);
      setOk(mode === "login" ? "Connexion réussie !" : "Compte créé !");
      setTimeout(() => {
        const role = data.user?.role;
        navigate(role === "artisan" || role === "worker" ? "/dashboard/artisan" : "/dashboard/client");
      }, 700);
    } catch { setErr("Impossible de contacter le serveur."); }
    finally  { setLoading(false); }
  };

  const switchMode = m => { setMode(m); setErr(""); setOk(""); setErrs({}); };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F, color: C.text, padding: 20 }}>

      {/* Déco subtile */}
      <div aria-hidden="true" style={{ position: "fixed", inset: 0, backgroundImage: `radial-gradient(circle at 20% 80%, ${C.electric}0A 0%, transparent 50%), radial-gradient(circle at 80% 20%, #6366F10A 0%, transparent 50%)`, pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 400 }}>

        {/* Logo */}
        <div onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 28, cursor: "pointer" }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: C.electric, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>⚙</div>
          <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em" }}>Service<span style={{ color: C.electric }}>DZ</span></span>
        </div>

        {/* Card */}
        <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "32px", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
        >
          {/* Tabs */}
          <div style={{ display: "flex", background: C.bg, borderRadius: 10, padding: 3, marginBottom: 28, gap: 2 }}>
            {["login", "register"].map(m => (
              <button key={m} onClick={() => switchMode(m)} style={{ all: "unset", flex: 1, textAlign: "center", padding: "8px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", background: mode === m ? C.surface : "transparent", color: mode === m ? C.text : C.muted, transition: "all 0.2s", fontFamily: F }}>
                {m === "login" ? "Connexion" : "Inscription"}
              </button>
            ))}
          </div>

          {/* Erreur / Succès */}
          <AnimatePresence>
            {err && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role="alert"
              style={{ margin: "0 0 16px", padding: "10px 12px", background: C.dangerBg, border: `1px solid ${C.danger}40`, borderRadius: 8, fontSize: 13, color: C.danger, fontFamily: F }}
            >⚠ {err}</motion.p>}
            {ok && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role="status"
              style={{ margin: "0 0 16px", padding: "10px 12px", background: `${C.success}12`, border: `1px solid ${C.success}40`, borderRadius: 8, fontSize: 13, color: C.success, fontFamily: F }}
            >✓ {ok}</motion.p>}
          </AnimatePresence>

          {/* Formulaire */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }} onKeyDown={e => e.key === "Enter" && !loading && submit()}>

            {mode === "register" && (
              <Field id="name" label="Nom complet" value={form.name} onChange={set("name")} placeholder="Karim Bensalem" autoComplete="name" error={errs.name} />
            )}

            <Field id="email" label="Email" type="email" value={form.email} onChange={set("email")} placeholder="vous@email.com" autoComplete="email" error={errs.email} />

            <Field id="password" label="Mot de passe" type={showPass ? "text" : "password"} value={form.password} onChange={set("password")}
              placeholder="••••••••" autoComplete={mode === "login" ? "current-password" : "new-password"} error={errs.password}
              right={<EyeBtn show={showPass} toggle={() => setShowPass(v => !v)} />}
            />

            {mode === "register" && <>
              <Field id="confirm" label="Confirmer le mot de passe" type={showPass2 ? "text" : "password"} value={form.confirm} onChange={set("confirm")}
                placeholder="••••••••" autoComplete="new-password" error={errs.confirm}
                right={<EyeBtn show={showPass2} toggle={() => setShowPass2(v => !v)} />}
              />
              {/* Rôle */}
              <div>
                <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: "0.07em", textTransform: "uppercase", fontFamily: F }}>Je suis…</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {[{ v: "client", l: "👤 Client", d: "Je cherche un artisan" }, { v: "artisan", l: "🔧 Artisan", d: "Je propose mes services" }].map(o => (
                    <button key={o.v} type="button" onClick={() => setForm(f => ({ ...f, role: o.v }))} aria-pressed={form.role === o.v}
                      style={{ all: "unset", cursor: "pointer", padding: "10px 12px", borderRadius: 9, border: `1px solid ${form.role === o.v ? C.electric + "80" : C.border}`, background: form.role === o.v ? `${C.electric}10` : "transparent", transition: "all 0.15s" }}
                    >
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: form.role === o.v ? C.electric : C.text, fontFamily: F }}>{o.l}</p>
                      <p style={{ margin: "2px 0 0", fontSize: 11, color: C.muted, fontFamily: F }}>{o.d}</p>
                    </button>
                  ))}
                </div>
              </div>
            </>}

            {/* Submit */}
            <motion.button whileHover={{ opacity: 0.9 }} whileTap={{ scale: 0.98 }} onClick={submit} disabled={loading}
              style={{ all: "unset", marginTop: 4, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: C.electric, color: "#fff", padding: "13px", borderRadius: 10, fontSize: 14, fontWeight: 600, fontFamily: F, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? <><Spinner /> Chargement…</> : mode === "login" ? "Se connecter" : "Créer mon compte"}
            </motion.button>
          </div>

          {/* Séparateur */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "20px 0" }}>
            <div style={{ flex: 1, height: 1, background: C.border }} />
            <span style={{ fontSize: 11, color: C.muted, fontFamily: F }}>ou continuer avec</span>
            <div style={{ flex: 1, height: 1, background: C.border }} />
          </div>

          {/* Google */}
          <motion.button whileHover={{ opacity: 0.85 }} whileTap={{ scale: 0.98 }} onClick={loginWithGoogle}
            style={{ all: "unset", width: "100%", boxSizing: "border-box", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "12px", border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 13, fontWeight: 600, color: C.text, fontFamily: F, transition: "border-color 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Continuer avec Google
          </motion.button>

        </motion.div>

        <p style={{ marginTop: 18, textAlign: "center", fontSize: 11, color: C.muted, fontFamily: F }}>
          En continuant, vous acceptez nos{" "}
          <a href="#" style={{ color: C.electric, textDecoration: "none" }}>CGU</a> et notre{" "}
          <a href="#" style={{ color: C.electric, textDecoration: "none" }}>Politique de confidentialité</a>.
        </p>
      </div>
    </div>
  );
}
