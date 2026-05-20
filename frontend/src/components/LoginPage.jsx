import { useState } from 'react';
import { authAPI } from '../api';

// ─── Login + Register page ────────────────────────────────────────────────────

const AUTH_CSS = `
.auth-wrap{min-height:calc(100vh - 60px);display:flex;align-items:center;justify-content:center;padding:32px 20px}
.auth-card{background:white;border:1px solid var(--border);border-radius:20px;
  width:100%;max-width:440px;padding:36px 40px;animation:auth-in 0.35s var(--ease-out)}
@keyframes auth-in{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
.auth-logo{font-family:'Syne',sans-serif;font-size:22px;font-weight:800;color:var(--primary);
  text-align:center;margin-bottom:6px;letter-spacing:-0.5px}
.auth-logo-dot{color:var(--accent)}
.auth-subtitle{text-align:center;font-size:14px;color:var(--text-muted);margin-bottom:28px}
.auth-tabs{display:flex;gap:4px;background:var(--sand);border-radius:10px;padding:4px;margin-bottom:28px}
.auth-tab{flex:1;padding:9px;border-radius:8px;border:none;background:transparent;
  font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;color:var(--text-muted);
  cursor:pointer;transition:all 180ms}
.auth-tab.active{background:white;color:var(--text);font-weight:600;
  box-shadow:0 1px 6px rgba(0,0,0,0.08)}
.auth-field{margin-bottom:16px}
.auth-label{display:block;font-size:12.5px;font-weight:600;color:var(--text-mid);margin-bottom:7px}
.auth-input{width:100%;background:var(--sand);border:1.5px solid var(--border);border-radius:10px;
  padding:11px 14px;font-family:'DM Sans',sans-serif;font-size:14px;color:var(--text);
  outline:none;transition:border-color 180ms,background 180ms}
.auth-input:focus{border-color:var(--primary);background:white}
.auth-input.err{border-color:var(--accent)}
.auth-role-group{display:flex;gap:10px}
.auth-role-opt{flex:1;padding:12px;border:1.5px solid var(--border);border-radius:10px;
  cursor:pointer;text-align:center;transition:all 160ms;background:var(--sand)}
.auth-role-opt.sel{border-color:var(--primary);background:var(--primary-light)}
.auth-role-icon{font-size:22px;margin-bottom:5px}
.auth-role-label{font-size:13px;font-weight:600;color:var(--text-mid)}
.auth-role-opt.sel .auth-role-label{color:var(--primary)}
.auth-role-sub{font-size:11px;color:var(--text-muted);margin-top:2px}
.auth-btn{width:100%;height:44px;background:var(--primary);color:white;border:none;border-radius:11px;
  font-family:'DM Sans',sans-serif;font-size:15px;font-weight:700;cursor:pointer;
  display:flex;align-items:center;justify-content:center;gap:8px;
  transition:background 150ms,transform 120ms;margin-top:8px}
.auth-btn:hover{background:var(--primary-mid)}
.auth-btn:active{transform:scale(0.98)}
.auth-btn:disabled{opacity:0.6;cursor:not-allowed;transform:none}
.auth-error{background:#FCEBEB;border:1px solid #F7C1C1;border-radius:9px;
  padding:10px 14px;font-size:13px;color:#A32D2D;margin-bottom:16px;
  display:flex;align-items:center;gap:8px}
.auth-divider{display:flex;align-items:center;gap:12px;margin:20px 0;color:var(--text-muted);font-size:13px}
.auth-divider::before,.auth-divider::after{content:'';flex:1;height:1px;background:var(--border)}
.auth-footer-text{text-align:center;font-size:13px;color:var(--text-muted);margin-top:18px}
.auth-link{color:var(--primary);font-weight:600;cursor:pointer;text-decoration:none}
.auth-link:hover{text-decoration:underline}
`;

export default function LoginPage({ onAuth, initTab = 'login' }) {
  const [tab, setTab] = useState(initTab); // 'login' | 'register'
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'client' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const set = (k, v) => { setForm(f => ({...f, [k]:v})); setError(''); };

  const handleSubmit = async () => {
    if (!form.email || !form.password) { setError('Veuillez remplir tous les champs.'); return; }
    if (tab === 'register' && !form.name) { setError('Le nom est requis.'); return; }
    setLoading(true);
    setError('');
    try {
      const res = tab === 'login'
        ? await authAPI.login(form.email, form.password)
        : await authAPI.register({ name: form.name, email: form.email, password: form.password, role: form.role });

      // Store JWT + user in localStorage
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user || { name: form.name, email: form.email, role: form.role }));
      onAuth(res.user || { name: form.name, email: form.email, role: form.role });
    } catch (e) {
      setError(e.message || 'Une erreur est survenue. Vérifiez vos identifiants.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{AUTH_CSS}</style>
      <div className="auth-wrap">
        <div className="auth-card">
          <div className="auth-logo">
            <i className="ti ti-tool" style={{fontSize:20,verticalAlign:-3,marginRight:6}} />
            Service<span className="auth-logo-dot">DZ</span>
          </div>
          <div className="auth-subtitle">
            {tab === 'login' ? 'Bienvenue ! Connectez-vous à votre compte.' : 'Créez votre compte en quelques secondes.'}
          </div>

          {/* Tabs */}
          <div className="auth-tabs">
            <button className={`auth-tab${tab === 'login' ? ' active' : ''}`} onClick={() => setTab('login')}>Connexion</button>
            <button className={`auth-tab${tab === 'register' ? ' active' : ''}`} onClick={() => setTab('register')}>Inscription</button>
          </div>

          {/* Error */}
          {error && (
            <div className="auth-error">
              <i className="ti ti-alert-circle" style={{fontSize:16,flexShrink:0}} />
              {error}
            </div>
          )}

          {/* Name field (register only) */}
          {tab === 'register' && (
            <div className="auth-field">
              <label className="auth-label">Nom complet</label>
              <input className="auth-input" placeholder="Ahmed Benali" value={form.name}
                onChange={e => set('name', e.target.value)} />
            </div>
          )}

          <div className="auth-field">
            <label className="auth-label">Adresse email</label>
            <input className="auth-input" type="email" placeholder="exemple@gmail.com" value={form.email}
              onChange={e => set('email', e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
          </div>
          <div className="auth-field">
            <label className="auth-label">Mot de passe</label>
            <input className="auth-input" type="password" placeholder="••••••••" value={form.password}
              onChange={e => set('password', e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
          </div>

          {/* Role selection (register only) */}
          {tab === 'register' && (
            <div className="auth-field">
              <label className="auth-label">Je suis…</label>
              <div className="auth-role-group">
                <div className={`auth-role-opt${form.role === 'client' ? ' sel' : ''}`}
                  onClick={() => set('role', 'client')}>
                  <div className="auth-role-icon">👤</div>
                  <div className="auth-role-label">Client</div>
                  <div className="auth-role-sub">Je cherche un artisan</div>
                </div>
                <div className={`auth-role-opt${form.role === 'artisan' ? ' sel' : ''}`}
                  onClick={() => set('role', 'artisan')}>
                  <div className="auth-role-icon">🔧</div>
                  <div className="auth-role-label">Artisan</div>
                  <div className="auth-role-sub">J'offre mes services</div>
                </div>
              </div>
            </div>
          )}

          <button className="auth-btn" onClick={handleSubmit} disabled={loading}>
            {loading
              ? <><div className="spinner" /> Chargement…</>
              : tab === 'login' ? <><i className="ti ti-login" style={{fontSize:16}} /> Se connecter</> : <><i className="ti ti-user-plus" style={{fontSize:16}} /> Créer mon compte</>
            }
          </button>

          <div className="auth-footer-text">
            {tab === 'login'
              ? <>Pas encore inscrit ? <span className="auth-link" onClick={() => setTab('register')}>Créer un compte</span></>
              : <>Déjà un compte ? <span className="auth-link" onClick={() => setTab('login')}>Se connecter</span></>
            }
          </div>
        </div>
      </div>
    </>
  );
}
