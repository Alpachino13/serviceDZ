// src/components/LoginPage.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";

const API = (process.env.REACT_APP_API_URL || "").replace(/\/$/, "");
const F   = "'Inter', 'Segoe UI', sans-serif";

const C = {
  bg:       "#111110",
  surface:  "#1A1918",
  surfaceLt:"#222120",
  border:   "rgba(255,255,255,0.08)",
  text:     "#F0EDE8",
  muted:    "#888580",
  electric: "#3B82F6",
  success:  "#10B981",
  danger:   "#EF4444",
  dangerBg: "rgba(239,68,68,0.08)",
};

const SPECIALTIES = [
  { value: "Plomberie",     icon: "🔧" },
  { value: "Électricité",   icon: "⚡" },
  { value: "Maçonnerie",    icon: "🧱" },
  { value: "Menuiserie",    icon: "🪟" },
  { value: "Climatisation", icon: "❄️" },
  { value: "Peinture",      icon: "🎨" },
  { value: "Serrurerie",    icon: "🔩" },
  { value: "Rénovation",    icon: "🏠" },
];

function saveSession(token, user) {
  localStorage.setItem("sdz_token", token);
  localStorage.setItem("sdz_user",  JSON.stringify(user));
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
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", role: "client", specialty: "" });
  const [errs, setErrs] = useState({});

  const set = k => e => { setForm(f => ({ ...f, [k]: e.target.value })); setErrs(x => ({ ...x, [k]: "" })); setErr(""); };

  const validate = () => {
    const e = {};
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Email invalide.";
    if (!form.password || form.password.length < 6)       e.password = "Minimum 6 caractères.";
    if (mode === "register") {
      if (!form.name)                              e.name    = "Nom requis.";
      if (form.password !== form.confirm)          e.confirm = "Mots de passe différents.";
      if (form.role === "artisan" && !form.specialty) e.specialty = "Choisissez une spécialité.";
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
      : { name: form.name, email: form.email, password: form.password, role: form.role, specialty: form.role === "artisan" ? form.specialty : undefined };
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
                    <button key={o.v} type="button" onClick={() => setForm(f => ({ ...f, role: o.v, specialty: "" }))} aria-pressed={form.role === o.v}
                      style={{ all: "unset", cursor: "pointer", padding: "10px 12px", borderRadius: 9, border: `1px solid ${form.role === o.v ? C.electric + "80" : C.border}`, background: form.role === o.v ? `${C.electric}10` : "transparent", transition: "all 0.15s" }}
                    >
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: form.role === o.v ? C.electric : C.text, fontFamily: F }}>{o.l}</p>
                      <p style={{ margin: "2px 0 0", fontSize: 11, color: C.muted, fontFamily: F }}>{o.d}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Spécialité — artisan uniquement */}
              {form.role === "artisan" && (
                <div>
                  <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: "0.07em", textTransform: "uppercase", fontFamily: F }}>Ma spécialité</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
                    {SPECIALTIES.map(s => (
                      <button key={s.value} type="button" onClick={() => setForm(f => ({ ...f, specialty: s.value }))} aria-pressed={form.specialty === s.value}
                        style={{ all: "unset", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, padding: "9px 11px", borderRadius: 8, border: `1px solid ${form.specialty === s.value ? C.success + "80" : C.border}`, background: form.specialty === s.value ? `${C.success}10` : "transparent", transition: "all 0.15s" }}
                      >
                        <span style={{ fontSize: 15 }}>{s.icon}</span>
                        <span style={{ fontSize: 12, fontWeight: form.specialty === s.value ? 600 : 400, color: form.specialty === s.value ? C.success : C.muted, fontFamily: F }}>{s.value}</span>
                      </button>
                    ))}
                  </div>
                  {errs.specialty && <p style={{ margin: "5px 0 0", fontSize: 11, color: C.danger, fontFamily: F }}>{errs.specialty}</p>}
                </div>
              )}
            </>}

            {/* Submit */}
            <motion.button whileHover={{ opacity: 0.9 }} whileTap={{ scale: 0.98 }} onClick={submit} disabled={loading}
              style={{ all: "unset", marginTop: 4, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: C.electric, color: "#fff", padding: "13px", borderRadius: 10, fontSize: 14, fontWeight: 600, fontFamily: F, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? <><Spinner /> Chargement…</> : mode === "login" ? "Se connecter" : "Créer mon compte"}
            </motion.button>
          </div>

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
