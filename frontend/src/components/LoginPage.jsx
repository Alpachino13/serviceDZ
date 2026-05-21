import { useState } from 'react';
import { authAPI } from '../api';

const WORKER_CATEGORIES = [
  { id:'plomberie',     label:'Plomberie',      icon:'🔧' },
  { id:'electricite',   label:'Électricité',    icon:'⚡' },
  { id:'peinture',      label:'Peinture',       icon:'🖌️' },
  { id:'maconnerie',    label:'Maçonnerie',     icon:'🧱' },
  { id:'menuiserie',    label:'Menuiserie',     icon:'🪵' },
  { id:'climatisation', label:'Climatisation',  icon:'❄️' },
  { id:'carrelage',     label:'Carrelage',      icon:'🏠' },
  { id:'serrurerie',    label:'Serrurerie',     icon:'🔑' },
];

const AUTH_CSS = `
.auth-wrap{min-height:calc(100vh - 60px);display:flex;align-items:center;
  justify-content:center;padding:32px 20px;background:var(--sand)}
.auth-card{background:white;border:1px solid var(--border);border-radius:20px;
  width:100%;max-width:460px;padding:36px 40px;
  animation:auth-in 0.35s var(--ease-out);box-shadow:0 4px 24px rgba(0,0,0,0.06)}
@keyframes auth-in{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
.auth-logo{font-family:'Syne',sans-serif;font-size:22px;font-weight:800;color:var(--primary);
  text-align:center;margin-bottom:6px;letter-spacing:-0.5px}
.auth-logo-dot{color:var(--accent)}
.auth-subtitle{text-align:center;font-size:14px;color:var(--text-muted);margin-bottom:28px}
.auth-tabs{display:flex;gap:4px;background:var(--sand);border-radius:10px;
  padding:4px;margin-bottom:24px}
.auth-tab{flex:1;padding:9px;border-radius:8px;border:none;background:transparent;
  font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;color:var(--text-muted);
  cursor:pointer;transition:all 180ms}
.auth-tab.active{background:white;color:var(--text);font-weight:600;
  box-shadow:0 1px 6px rgba(0,0,0,0.08)}
.auth-field{margin-bottom:16px}
.auth-label{display:block;font-size:12.5px;font-weight:600;color:var(--text-mid);margin-bottom:7px}
.auth-label span{color:var(--accent)}
.auth-input{width:100%;background:var(--sand);border:1.5px solid var(--border);
  border-radius:10px;padding:11px 14px;font-family:'DM Sans',sans-serif;
  font-size:14px;color:var(--text);outline:none;
  transition:border-color 180ms,background 180ms}
.auth-input:focus{border-color:var(--primary);background:white}
.auth-input.err{border-color:var(--accent)}

/* Role cards */
.auth-role-group{display:flex;gap:10px}
.auth-role-opt{flex:1;padding:12px;border:1.5px solid var(--border);border-radius:10px;
  cursor:pointer;text-align:center;transition:all 160ms;background:var(--sand)}
.auth-role-opt.sel{border-color:var(--primary);background:var(--primary-light)}
.auth-role-icon{font-size:22px;margin-bottom:5px}
.auth-role-label{font-size:13px;font-weight:600;color:var(--text-mid)}
.auth-role-opt.sel .auth-role-label{color:var(--primary)}
.auth-role-sub{font-size:11px;color:var(--text-muted);margin-top:2px}

/* Category grid */
.cat-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-top:2px}
.cat-opt{padding:10px 12px;border:1.5px solid var(--border);border-radius:10px;
  cursor:pointer;display:flex;align-items:center;gap:9px;
  background:var(--sand);transition:all 160ms}
.cat-opt.sel{border-color:var(--primary);background:var(--primary-light)}
.cat-opt-icon{font-size:18px;flex-shrink:0}
.cat-opt-label{font-size:13px;font-weight:600;color:var(--text-mid);line-height:1.2}
.cat-opt.sel .cat-opt-label{color:var(--primary)}

/* Phone field with flag */
.phone-wrap{display:flex;gap:8px}
.phone-prefix{display:flex;align-items:center;gap:6px;padding:0 12px;
  background:var(--sand);border:1.5px solid var(--border);border-radius:10px;
  font-size:14px;color:var(--text-mid);font-weight:600;white-space:nowrap;flex-shrink:0}

/* Submit button */
.auth-btn{width:100%;height:44px;background:var(--primary);color:white;border:none;
  border-radius:11px;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:700;
  cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;
  transition:background 150ms,transform 120ms;margin-top:8px}
.auth-btn:hover{background:var(--primary-mid)}
.auth-btn:active{transform:scale(0.98)}
.auth-btn:disabled{opacity:0.6;cursor:not-allowed;transform:none}

/* Error box */
.auth-error{background:#FCEBEB;border:1px solid #F7C1C1;border-radius:9px;
  padding:10px 14px;font-size:13px;color:#A32D2D;margin-bottom:16px;
  display:flex;align-items:center;gap:8px}

/* Footer */
.auth-footer-text{text-align:center;font-size:13px;color:var(--text-muted);margin-top:18px}
.auth-link{color:var(--primary);font-weight:600;cursor:pointer}
.auth-link:hover{text-decoration:underline}

/* Steps indicator */
.auth-steps{display:flex;align-items:center;justify-content:center;gap:6px;margin-bottom:22px}
.auth-step{width:28px;height:4px;border-radius:2px;background:var(--border);transition:background 300ms}
.auth-step.done{background:var(--primary)}
.auth-step.active{background:var(--primary-mid)}
.auth-back{display:flex;align-items:center;gap:6px;font-size:13px;color:var(--text-muted);
  cursor:pointer;background:none;border:none;font-family:'DM Sans',sans-serif;
  padding:0;margin-bottom:16px;transition:color 150ms}
.auth-back:hover{color:var(--primary)}

/* Success screen */
.auth-success{text-align:center;padding:12px 0}
.auth-success-icon{width:64px;height:64px;border-radius:50%;background:var(--primary-light);
  display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:28px}
.auth-success-title{font-family:'Syne',sans-serif;font-size:20px;font-weight:800;
  color:var(--text);margin-bottom:8px}
.auth-success-sub{font-size:14px;color:var(--text-muted);line-height:1.6}
`;

export default function LoginPage({ onAuth, initTab = 'login', onGoHome }) {
  const [tab,     setTab]     = useState(initTab);
  // Step 1 = role/info, Step 2 = category (workers only)
  const [step,    setStep]    = useState(1);
  const [form,    setForm]    = useState({
    name:'', email:'', password:'', phone:'', role:'client', category:''
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState(false);

  const set = (k, v) => { setForm(f => ({...f, [k]:v})); setError(''); };
  const isWorker = form.role === 'artisan' || form.role === 'worker';

  // ── Step 1 → Step 2 validation ────────────────────────────────────────────
  const handleNext = () => {
    if (!form.name.trim())     { setError('Le nom est requis.');       return; }
    if (!form.email.trim())    { setError("L'email est requis.");      return; }
    if (!form.password.trim()) { setError('Le mot de passe est requis.'); return; }
    if (form.password.length < 6) { setError('Mot de passe trop court (6 caractères min.).'); return; }
    setError('');
    if (isWorker) { setStep(2); }
    else          { handleSubmit(); }
  };

  // ── Final submit ──────────────────────────────────────────────────────────
  const handleSubmit = async (overrideCategory) => {
    if (isWorker && !form.category && !overrideCategory) {
      setError('Veuillez choisir votre métier.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      if (tab === 'login') {
        const res = await authAPI.login(form.email, form.password);
        localStorage.setItem('token', res.token);
        const u = res.user || { name:form.email, email:form.email, role:'client' };
        localStorage.setItem('user', JSON.stringify(u));
        onAuth(u);
      } else {
        // Register — sends category to backend → added to workers collection
        const payload = {
          name:     form.name,
          email:    form.email,
          password: form.password,
          phone:    form.phone,
          role:     isWorker ? 'artisan' : 'client',
          category: overrideCategory || form.category || undefined,
          region:   'tlemcen', // default region
        };
        const res = await authAPI.register(payload);
        localStorage.setItem('token', res.token);
        const u = res.user || payload;
        localStorage.setItem('user', JSON.stringify(u));
        setSuccess(true);
        setTimeout(() => onAuth(u), 1800);
      }
    } catch (e) {
      setError(e.message || 'Une erreur est survenue.');
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  // ── Login form ─────────────────────────────────────────────────────────────
  const renderLogin = () => (
    <>
      <div className="auth-field">
        <label className="auth-label">Adresse email</label>
        <input className={`auth-input${error&&!form.email?' err':''}`}
          type="email" placeholder="exemple@gmail.com"
          value={form.email} onChange={e => set('email', e.target.value)}
          onKeyDown={e => e.key==='Enter' && handleSubmit()} />
      </div>
      <div className="auth-field">
        <label className="auth-label">Mot de passe</label>
        <input className={`auth-input${error&&!form.password?' err':''}`}
          type="password" placeholder="••••••••"
          value={form.password} onChange={e => set('password', e.target.value)}
          onKeyDown={e => e.key==='Enter' && handleSubmit()} />
      </div>
      <button className="auth-btn" onClick={handleSubmit} disabled={loading}>
        {loading
          ? <><div className="spinner"/>Connexion…</>
          : <><i className="ti ti-login" style={{fontSize:16}}/>Se connecter</>}
      </button>
    </>
  );

  // ── Register step 1 — info + role ─────────────────────────────────────────
  const renderRegisterStep1 = () => (
    <>
      {/* Steps indicator */}
      {isWorker && (
        <div className="auth-steps">
          <div className="auth-step done" />
          <div className={`auth-step ${step>=2?'done':'active'}`} />
        </div>
      )}

      <div className="auth-field">
        <label className="auth-label">Nom complet <span>*</span></label>
        <input className={`auth-input${error&&!form.name?' err':''}`}
          placeholder="Ahmed Benali"
          value={form.name} onChange={e => set('name', e.target.value)} />
      </div>
      <div className="auth-field">
        <label className="auth-label">Adresse email <span>*</span></label>
        <input className={`auth-input${error&&!form.email?' err':''}`}
          type="email" placeholder="exemple@gmail.com"
          value={form.email} onChange={e => set('email', e.target.value)} />
      </div>
      <div className="auth-field">
        <label className="auth-label">Téléphone</label>
        <div className="phone-wrap">
          <div className="phone-prefix">🇩🇿 +213</div>
          <input className="auth-input" placeholder="05 XX XX XX XX"
            value={form.phone} onChange={e => set('phone', e.target.value)} />
        </div>
      </div>
      <div className="auth-field">
        <label className="auth-label">Mot de passe <span>*</span></label>
        <input className={`auth-input${error&&!form.password?' err':''}`}
          type="password" placeholder="Minimum 6 caractères"
          value={form.password} onChange={e => set('password', e.target.value)} />
      </div>
      <div className="auth-field">
        <label className="auth-label">Je suis…</label>
        <div className="auth-role-group">
          <div className={`auth-role-opt${form.role==='client'?' sel':''}`}
            onClick={() => { set('role','client'); set('category',''); }}>
            <div className="auth-role-icon">👤</div>
            <div className="auth-role-label">Client</div>
            <div className="auth-role-sub">Je cherche un artisan</div>
          </div>
          <div className={`auth-role-opt${isWorker?' sel':''}`}
            onClick={() => set('role','artisan')}>
            <div className="auth-role-icon">🔧</div>
            <div className="auth-role-label">Artisan</div>
            <div className="auth-role-sub">J'offre mes services</div>
          </div>
        </div>
      </div>

      <button className="auth-btn" onClick={handleNext} disabled={loading}>
        {loading
          ? <><div className="spinner"/>Chargement…</>
          : isWorker
            ? <><i className="ti ti-arrow-right" style={{fontSize:16}}/>Choisir mon métier →</>
            : <><i className="ti ti-user-plus" style={{fontSize:16}}/>Créer mon compte</>
        }
      </button>
    </>
  );

  // ── Register step 2 — category picker (workers only) ─────────────────────
  const renderRegisterStep2 = () => (
    <>
      <button className="auth-back" onClick={() => { setStep(1); setError(''); }}>
        <i className="ti ti-arrow-left" style={{fontSize:15}}/>Retour
      </button>
      <div className="auth-steps">
        <div className="auth-step done"/>
        <div className="auth-step active"/>
      </div>
      <div className="auth-field">
        <label className="auth-label">Votre métier principal <span>*</span></label>
        <div className="cat-grid">
          {WORKER_CATEGORIES.map(c => (
            <div key={c.id}
              className={`cat-opt${form.category===c.id?' sel':''}`}
              onClick={() => set('category', c.id)}>
              <span className="cat-opt-icon">{c.icon}</span>
              <span className="cat-opt-label">{c.label}</span>
              {form.category===c.id && (
                <i className="ti ti-check" style={{marginLeft:'auto',fontSize:14,color:'var(--primary)'}}/>
              )}
            </div>
          ))}
        </div>
      </div>

      <button className="auth-btn"
        onClick={() => handleSubmit(form.category)}
        disabled={loading || !form.category}>
        {loading
          ? <><div className="spinner"/>Création du compte…</>
          : <><i className="ti ti-user-plus" style={{fontSize:16}}/>Créer mon compte</>
        }
      </button>
    </>
  );

  // ── Success screen ─────────────────────────────────────────────────────────
  const renderSuccess = () => (
    <div className="auth-success">
      <div className="auth-success-icon">✅</div>
      <div className="auth-success-title">Compte créé !</div>
      <div className="auth-success-sub">
        Bienvenue sur ServiceDZ, <strong>{form.name.split(' ')[0]}</strong>.<br/>
        Vous allez être redirigé vers votre tableau de bord…
      </div>
    </div>
  );

  return (
    <>
      <style>{AUTH_CSS}</style>
      <div className="auth-wrap">
        <div className="auth-card">

          {/* Back to home */}
          {onGoHome && !success && (
            <button className="auth-back" style={{marginBottom:12}} onClick={onGoHome}>
              <i className="ti ti-arrow-left" style={{fontSize:15}}/>Retour à l'accueil
            </button>
          )}

          <div className="auth-logo">
            <i className="ti ti-tool" style={{fontSize:20,verticalAlign:-3,marginRight:6}}/>
            Service<span className="auth-logo-dot">DZ</span>
          </div>
          <div className="auth-subtitle">
            {success
              ? 'Compte créé avec succès !'
              : tab==='login'
                ? 'Bienvenue ! Connectez-vous à votre compte.'
                : step===1 ? 'Créez votre compte en quelques secondes.'
                           : `Parfait ${form.name.split(' ')[0]} — quel est votre métier ?`
            }
          </div>

          {/* Tabs (login / register) — hidden on step 2 */}
          {!success && step===1 && (
            <div className="auth-tabs">
              <button className={`auth-tab${tab==='login'?' active':''}`}
                onClick={() => { setTab('login'); setStep(1); setError(''); }}>
                Connexion
              </button>
              <button className={`auth-tab${tab==='register'?' active':''}`}
                onClick={() => { setTab('register'); setStep(1); setError(''); }}>
                Inscription
              </button>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="auth-error">
              <i className="ti ti-alert-circle" style={{fontSize:16,flexShrink:0}}/>
              {error}
            </div>
          )}

          {/* Content */}
          {success                            && renderSuccess()}
          {!success && tab==='login'          && renderLogin()}
          {!success && tab==='register' && step===1 && renderRegisterStep1()}
          {!success && tab==='register' && step===2 && renderRegisterStep2()}

          {/* Footer switch */}
          {!success && step===1 && (
            <div className="auth-footer-text">
              {tab==='login'
                ? <>Pas encore inscrit ?{' '}
                    <span className="auth-link"
                      onClick={() => { setTab('register'); setError(''); }}>
                      Créer un compte
                    </span></>
                : <>Déjà un compte ?{' '}
                    <span className="auth-link"
                      onClick={() => { setTab('login'); setError(''); }}>
                      Se connecter
                    </span></>
              }
            </div>
          )}
        </div>
      </div>
    </>
  );
}
