import { useState, useRef, useEffect } from 'react';

// ─── Design system CSS (injected once by App) ────────────────────────────────
export const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@500;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');`;
// Add this to Shared.jsx
export function Stars({ rating, size = 14 }) {
  // Using the C object defined above
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map(s => (
        <span 
          key={s} 
          style={{ 
            fontSize: size, 
            color: s <= Math.round(rating) ? C.warning : C.surfaceLt 
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}
export const GLOBAL_CSS = `
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --primary:#0C5E47;--primary-mid:#1A7A5E;--primary-light:#E6F5F0;
  --accent:#D4572A;--accent-light:#FAF0EB;
  --sand:#F5F2EC;--sand-dark:#EBE7DF;--card:#FFFFFF;
  --text:#1C1C1A;--text-mid:#4A4A45;--text-muted:#8A8A82;--border:#E2DDD5;
  --sidebar:220px;
  --ease-out:cubic-bezier(0.23,1,0.32,1);
  --ease-spring:cubic-bezier(0.34,1.56,0.64,1);
}
body{font-family:'DM Sans',system-ui,sans-serif;background:var(--sand);color:var(--text);min-height:100vh}

/* ── NAV ── */
.nav{position:sticky;top:0;z-index:50;background:rgba(245,242,236,0.93);backdrop-filter:blur(12px);
  border-bottom:1px solid var(--border);height:60px;display:flex;align-items:center;padding:0 24px;gap:14px}
.nav-logo{font-family:'Syne',sans-serif;font-size:19px;font-weight:800;color:var(--primary);
  letter-spacing:-0.5px;white-space:nowrap;display:flex;align-items:center;gap:7px;cursor:pointer}
.nav-logo-dot{color:var(--accent)}
.nav-search-wrap{flex:1;max-width:400px;position:relative}
.nav-search-wrap i{position:absolute;left:11px;top:50%;transform:translateY(-50%);font-size:15px;
  color:var(--text-muted);pointer-events:none}
.nav-search{width:100%;background:var(--card);border:1px solid var(--border);border-radius:10px;
  padding:0 13px 0 36px;height:37px;font-family:'DM Sans',sans-serif;font-size:14px;
  color:var(--text);outline:none;transition:border-color 180ms,box-shadow 180ms}
.nav-search:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(12,94,71,0.1)}
.nav-actions{display:flex;align-items:center;gap:8px;margin-left:auto}
.nav-link{padding:0;border:none;background:none;cursor:pointer;
  font-family:'DM Sans',sans-serif}
/* ── LOGIN button — outline style ── */
.nav-btn-login{
  display:inline-flex;align-items:center;gap:6px;
  padding:8px 18px;height:37px;
  border-radius:9px;
  border:1.5px solid var(--border);
  background:var(--card);
  font-family:'DM Sans',sans-serif;
  font-size:14px;font-weight:600;
  color:var(--text-mid);
  cursor:pointer;
  transition:border-color 160ms,color 160ms,background 160ms,transform 120ms;
  white-space:nowrap;
}
.nav-btn-login:hover{
  border-color:var(--primary);
  color:var(--primary);
  background:var(--primary-light);
}
.nav-btn-login:active{transform:scale(0.97)}
/* ── SIGNUP button — solid primary ── */
.nav-btn-primary{
  display:inline-flex;align-items:center;gap:6px;
  padding:8px 18px;height:37px;
  border-radius:9px;
  border:none;
  background:var(--primary);
  font-family:'DM Sans',sans-serif;
  font-size:14px;font-weight:600;
  color:white;
  cursor:pointer;
  transition:background 150ms,transform 120ms,box-shadow 150ms;
  white-space:nowrap;
  box-shadow:0 1px 4px rgba(12,94,71,0.25);
}
.nav-btn-primary:hover{background:var(--primary-mid);box-shadow:0 3px 10px rgba(12,94,71,0.3)}
.nav-btn-primary:active{transform:scale(0.97);box-shadow:none}

/* ── NOTIFICATION BELL ── */
.notif-btn{position:relative;width:37px;height:37px;border:1px solid var(--border);
  border-radius:10px;background:var(--card);display:flex;align-items:center;
  justify-content:center;cursor:pointer;color:var(--text-mid);
  transition:background 150ms,border-color 150ms,transform 120ms;font-size:18px}
.notif-btn:hover{background:var(--primary-light);border-color:var(--primary);color:var(--primary)}
.notif-btn:active{transform:scale(0.95)}
.notif-badge{position:absolute;top:-5px;right:-5px;background:var(--accent);color:white;
  font-size:10px;font-weight:700;min-width:18px;height:18px;border-radius:9px;
  display:flex;align-items:center;justify-content:center;padding:0 4px;
  border:2px solid var(--sand);animation:badge-pop 0.3s var(--ease-spring)}
@keyframes badge-pop{from{transform:scale(0)}to{transform:scale(1)}}

/* ── USER AVATAR ── */
.user-avatar{width:35px;height:35px;border-radius:50%;background:var(--primary);
  display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;
  color:white;cursor:pointer;position:relative;border:2px solid var(--primary-light)}
.user-menu{position:absolute;top:calc(100%+8px);right:0;background:var(--card);
  border:1px solid var(--border);border-radius:12px;padding:6px;min-width:190px;
  box-shadow:0 8px 24px rgba(0,0,0,0.1);animation:slide-up 200ms var(--ease-out);z-index:200}
.user-menu-header{padding:10px 12px 8px;border-bottom:1px solid var(--border);margin-bottom:4px}
.user-menu-name{font-size:13.5px;font-weight:700;color:var(--text)}
.user-menu-role{font-size:11.5px;color:var(--text-muted);margin-top:1px}
.user-menu-item{display:flex;align-items:center;gap:9px;padding:9px 12px;border-radius:8px;
  font-size:13.5px;color:var(--text-mid);cursor:pointer;transition:background 140ms}
.user-menu-item:hover{background:var(--sand)}
.user-menu-item.danger{color:#A32D2D}
.user-menu-item.danger:hover{background:#FCEBEB}
.user-menu-divider{border:none;border-top:1px solid var(--border);margin:4px 0}

/* ── NOTIFICATION PANEL ── */
.notif-overlay{position:fixed;inset:0;z-index:80;background:rgba(28,28,26,0.18);
  animation:fade-in 200ms var(--ease-out)}
.notif-panel{position:fixed;top:0;right:0;bottom:0;width:360px;z-index:81;
  background:var(--card);border-left:1px solid var(--border);
  display:flex;flex-direction:column;animation:slide-in-right 250ms var(--ease-out);overflow:hidden}
@keyframes slide-in-right{from{transform:translateX(100%)}to{transform:translateX(0)}}
@keyframes fade-in{from{opacity:0}to{opacity:1}}
.notif-header{padding:18px 20px 14px;border-bottom:1px solid var(--border);
  display:flex;align-items:center;justify-content:space-between}
.notif-title{font-family:'Syne',sans-serif;font-size:16px;font-weight:700;color:var(--text);
  display:flex;align-items:center;gap:10px}
.notif-close-btn{width:30px;height:30px;border-radius:7px;border:1px solid var(--border);
  background:transparent;color:var(--text-muted);cursor:pointer;
  display:flex;align-items:center;justify-content:center;font-size:16px;transition:background 150ms}
.notif-close-btn:hover{background:var(--sand-dark);color:var(--text)}
.notif-list{flex:1;overflow-y:auto;padding:8px 0}
.notif-item{display:flex;align-items:flex-start;gap:11px;padding:13px 18px;
  border-bottom:1px solid var(--border);cursor:pointer;transition:background 150ms;
  animation:notif-slide-in 0.28s var(--ease-out) both}
@keyframes notif-slide-in{from{opacity:0;transform:translateX(14px)}to{opacity:1;transform:translateX(0)}}
.notif-item:hover{background:var(--sand)}
.notif-item.unread{background:rgba(12,94,71,0.04)}
.notif-icon{width:34px;height:34px;border-radius:9px;display:flex;align-items:center;
  justify-content:center;font-size:15px;flex-shrink:0;margin-top:1px}
.notif-icon.t-demande{background:var(--primary-light);color:var(--primary)}
.notif-icon.t-message{background:#EEF0FA;color:#3B4CBF}
.notif-icon.t-status{background:#EAF5E6;color:#2A6B1A}
.notif-icon.t-review{background:#FFF8E8;color:#9A7012}
.notif-content{flex:1}
.notif-ntitle{font-size:13px;font-weight:600;color:var(--text);margin-bottom:2px;line-height:1.4}
.notif-ndesc{font-size:12px;color:var(--text-muted);line-height:1.4}
.notif-ntime{font-size:11px;color:var(--text-muted);margin-top:3px}
.notif-dot{width:7px;height:7px;border-radius:50%;background:var(--primary);flex-shrink:0;margin-top:5px}
.notif-empty{padding:40px 20px;text-align:center;color:var(--text-muted);font-size:14px}
.notif-footer{padding:12px 18px;border-top:1px solid var(--border)}
.btn-mark-read{width:100%;height:35px;background:var(--primary-light);color:var(--primary);
  border:none;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;
  cursor:pointer;transition:background 150ms}
.btn-mark-read:hover{background:#D0EDE6}

/* ── CONTACT MODAL ── */
.modal-overlay{position:fixed;inset:0;z-index:90;background:rgba(28,28,26,0.52);
  display:flex;align-items:center;justify-content:center;padding:24px;
  animation:fade-in 200ms var(--ease-out)}
.modal{background:var(--card);border-radius:20px;width:100%;max-width:510px;
  max-height:88vh;overflow-y:auto;animation:slide-up 280ms var(--ease-out)}
@keyframes slide-up{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}
.modal-header{padding:20px 22px 14px;border-bottom:1px solid var(--border);
  display:flex;align-items:flex-start;gap:13px}
.modal-av{width:44px;height:44px;border-radius:12px;display:flex;align-items:center;
  justify-content:center;font-family:'Syne',sans-serif;font-size:16px;font-weight:700;
  color:white;flex-shrink:0}
.modal-info{flex:1}
.modal-pretitle{font-size:11.5px;color:var(--text-muted);margin-bottom:2px}
.modal-name{font-family:'Syne',sans-serif;font-size:16px;font-weight:700;color:var(--text)}
.modal-cat{font-size:12.5px;color:var(--text-muted);margin-top:2px;display:flex;align-items:center;gap:5px}
.modal-x{width:30px;height:30px;border-radius:7px;border:1px solid var(--border);
  background:transparent;color:var(--text-muted);cursor:pointer;
  display:flex;align-items:center;justify-content:center;font-size:15px;transition:background 140ms}
.modal-x:hover{background:var(--sand-dark);color:var(--text)}
.modal-body{padding:20px 22px}
.field{margin-bottom:16px}
.field-label{display:block;font-size:12.5px;font-weight:600;color:var(--text-mid);margin-bottom:7px}
.field-label span{color:var(--accent);margin-left:2px}
.field-input,.field-textarea,.field-select{width:100%;background:var(--sand);border:1.5px solid var(--border);
  border-radius:10px;padding:10px 13px;font-family:'DM Sans',sans-serif;font-size:14px;
  color:var(--text);outline:none;transition:border-color 180ms,background 180ms}
.field-input:focus,.field-textarea:focus,.field-select:focus{border-color:var(--primary);background:white}
.field-input.err,.field-textarea.err{border-color:var(--accent)}
.field-textarea{resize:vertical;min-height:85px;line-height:1.5}
.urgency-group{display:flex;gap:9px}
.urgency-opt{flex:1;padding:10px 12px;border:1.5px solid var(--border);border-radius:10px;
  cursor:pointer;display:flex;align-items:center;gap:8px;transition:all 160ms;background:var(--sand)}
.urgency-opt.sel-normal{border-color:var(--primary);background:var(--primary-light)}
.urgency-opt.sel-urgent{border-color:var(--accent);background:var(--accent-light)}
.urgency-label{font-size:13px;font-weight:600;color:var(--text-mid)}
.sel-normal .urgency-label{color:var(--primary)}
.sel-urgent .urgency-label{color:var(--accent)}
.urgency-sub{font-size:11px;color:var(--text-muted)}
.modal-footer{padding:14px 22px 20px;border-top:1px solid var(--border);display:flex;gap:9px}
.btn-cancel{padding:0 18px;height:42px;border:1.5px solid var(--border);border-radius:10px;
  background:transparent;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;
  color:var(--text-mid);cursor:pointer;transition:background 150ms;white-space:nowrap}
.btn-cancel:hover{background:var(--sand-dark)}
.btn-submit{flex:1;height:42px;background:var(--primary);color:white;border:none;border-radius:10px;
  font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;cursor:pointer;
  display:flex;align-items:center;justify-content:center;gap:7px;
  transition:background 150ms,transform 120ms}
.btn-submit:hover{background:var(--primary-mid)}
.btn-submit:active{transform:scale(0.97)}
.btn-submit:disabled{opacity:0.6;cursor:not-allowed;transform:none}

/* ── TOAST ── */
.toast{position:fixed;bottom:26px;left:50%;transform:translateX(-50%);z-index:100;
  background:#1C1C1A;color:white;padding:12px 18px;border-radius:14px;
  display:flex;align-items:center;gap:10px;font-size:14px;font-weight:500;
  white-space:nowrap;box-shadow:0 8px 28px rgba(0,0,0,0.22);
  animation:toast-in 0.32s var(--ease-spring) both}
@keyframes toast-in{from{opacity:0;transform:translateX(-50%) translateY(18px) scale(0.95)}
  to{opacity:1;transform:translateX(-50%) translateY(0) scale(1)}}
.toast-icon{width:22px;height:22px;border-radius:50%;background:#2A8A5E;
  display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0}

/* ── SPINNER ── */
.spinner{width:17px;height:17px;border:2.5px solid rgba(255,255,255,0.3);
  border-top-color:white;border-radius:50%;animation:spin 0.65s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}

/* ── PILL BADGES ── */
.pill{display:inline-flex;align-items:center;gap:4px;font-size:11.5px;font-weight:600;
  padding:3px 9px;border-radius:20px;letter-spacing:0.2px}
.pill-green{background:#E6F5F0;color:#0C5E47}
.pill-orange{background:#FAF0EB;color:#D4572A}
.pill-blue{background:#EEF0FA;color:#3B4CBF}
.pill-amber{background:#FFF8E8;color:#9A7012}
.pill-gray{background:var(--sand-dark);color:var(--text-muted)}
.pill-red{background:#FCEBEB;color:#A32D2D}
.pill-avail{background:#EAF5E6;color:#2A6B1A}
.pill-busy{background:#FAF0EB;color:#9A3515}
.pill-pending{background:#FFF8E8;color:#9A7012}
.pill-done{background:#E6F5F0;color:#0C5E47}
.pill-prog{background:#EEF0FA;color:#3B4CBF}
.pill-cancelled{background:#FCEBEB;color:#A32D2D}

/* ── STAT CARDS ── */
.stat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin-bottom:28px}
.stat-card{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:18px 20px}
.stat-card-icon{width:36px;height:36px;border-radius:9px;display:flex;align-items:center;
  justify-content:center;font-size:17px;margin-bottom:12px}
.stat-card-val{font-family:'Syne',sans-serif;font-size:26px;font-weight:800;color:var(--text);line-height:1}
.stat-card-label{font-size:12.5px;color:var(--text-muted);margin-top:5px}
.stat-card-delta{font-size:12px;margin-top:4px;display:flex;align-items:center;gap:3px}
.delta-up{color:#2A8A5E}
.delta-down{color:var(--accent)}

/* ── SECTION HEADER ── */
.section-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
.section-title{font-family:'Syne',sans-serif;font-size:17px;font-weight:700;color:var(--text)}
.section-count{font-size:12.5px;color:var(--text-muted);background:var(--sand-dark);
  padding:3px 10px;border-radius:20px}

/* ── TABLE ── */
.tbl{width:100%;border-collapse:collapse;font-size:13.5px}
.tbl thead th{text-align:left;padding:9px 14px;font-size:11.5px;font-weight:700;
  color:var(--text-muted);text-transform:uppercase;letter-spacing:0.6px;
  border-bottom:1px solid var(--border)}
.tbl tbody td{padding:13px 14px;border-bottom:1px solid var(--border);color:var(--text-mid);vertical-align:middle}
.tbl tbody tr:last-child td{border-bottom:none}
.tbl tbody tr{transition:background 140ms}
.tbl tbody tr:hover{background:var(--sand)}

/* ── CARD ── */
.card{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:22px}

/* ── CHART CARD ── */
.chart-card{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:20px 22px}
.chart-title{font-family:'Syne',sans-serif;font-size:14px;font-weight:700;color:var(--text);margin-bottom:4px}
.chart-sub{font-size:12px;color:var(--text-muted);margin-bottom:16px}

/* ── DASHBOARD LAYOUT ── */
.dash-layout{display:flex;min-height:calc(100vh - 60px)}
.dash-sidebar{width:var(--sidebar);flex-shrink:0;background:var(--card);
  border-right:1px solid var(--border);padding:20px 0;position:sticky;top:60px;
  height:calc(100vh - 60px);overflow-y:auto;display:flex;flex-direction:column}
.dash-sidebar-logo{padding:0 16px 16px;border-bottom:1px solid var(--border);margin-bottom:10px}
.dash-sidebar-user-name{font-family:'Syne',sans-serif;font-size:14px;font-weight:700;color:var(--text)}
.dash-sidebar-user-role{font-size:12px;color:var(--text-muted);margin-top:2px}
.dash-sidebar-section{padding:8px 10px 4px;font-size:10.5px;font-weight:700;
  text-transform:uppercase;letter-spacing:1px;color:var(--text-muted)}
.dash-nav-item{display:flex;align-items:center;gap:10px;padding:9px 14px;margin:1px 6px;
  border-radius:9px;font-size:13.5px;font-weight:500;color:var(--text-mid);
  cursor:pointer;transition:all 150ms;border:none;background:none;font-family:'DM Sans',sans-serif;
  width:calc(100% - 12px);text-align:left}
.dash-nav-item:hover{background:var(--sand);color:var(--text)}
.dash-nav-item.active{background:var(--primary-light);color:var(--primary);font-weight:600}
.dash-nav-item i{font-size:17px;flex-shrink:0}
.dash-main{flex:1;padding:28px;overflow-x:hidden;max-width:900px}
.dash-sidebar-bottom{margin-top:auto;padding:16px 6px 0;border-top:1px solid var(--border)}

/* ── MISC ── */
.empty-state{text-align:center;padding:48px 20px;color:var(--text-muted)}
.empty-state i{font-size:38px;display:block;margin-bottom:10px;opacity:0.35}
.empty-state h3{font-family:'Syne',sans-serif;font-size:15px;font-weight:700;color:var(--text-mid);margin-bottom:5px}
.row-actions{display:flex;gap:6px}
.act-btn{padding:5px 12px;border-radius:7px;font-size:12.5px;font-weight:600;
  cursor:pointer;border:none;font-family:'DM Sans',sans-serif;transition:all 140ms}
.act-accept{background:#E6F5F0;color:#0C5E47}
.act-accept:hover{background:#C9ECE0}
.act-decline{background:#FCEBEB;color:#A32D2D}
.act-decline:hover{background:#F7C1C1}
.act-view{background:var(--sand-dark);color:var(--text-mid)}
.act-view:hover{background:var(--border)}
`;

// ── Nav ───────────────────────────────────────────────────────────────────────
export function Nav({ page, setPage, user, notifs, onBell, onLogout, search, setSearch }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const unread = notifs.filter(n => n.unread).length;
  const initials = user ? user.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() : 'G';

  useEffect(() => {
    const handler = e => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <nav className="nav">
      <div className="nav-logo" onClick={() => setPage('home')}>
        <i className="ti ti-tool" style={{fontSize:19}} />
        Service<span className="nav-logo-dot">DZ</span>
      </div>

      {(page === 'home') && (
        <div className="nav-search-wrap">
          <i className="ti ti-search" />
          <input className="nav-search" placeholder="Artisan, métier, ville…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      )}

      <div className="nav-actions">
        {user ? (
          <>
            <button className="notif-btn" onClick={onBell}
              aria-label={`Notifications${unread > 0 ? ` (${unread})` : ''}`}>
              <i className="ti ti-bell" style={{fontSize:18}} />
              {unread > 0 && <span className="notif-badge">{unread > 9 ? '9+' : unread}</span>}
            </button>

            <div style={{position:'relative'}} ref={menuRef}>
              <div className="user-avatar" onClick={() => setMenuOpen(s => !s)}>{initials}</div>
              {menuOpen && (
                <div className="user-menu">
                  <div className="user-menu-header">
                    <div className="user-menu-name">{user.name}</div>
                    <div className="user-menu-role">{user.role === 'client' ? 'Client' : 'Artisan'}</div>
                  </div>
                  <div className="user-menu-item" onClick={() => { setPage('dashboard'); setMenuOpen(false); }}>
                    <i className="ti ti-layout-dashboard" style={{fontSize:16}} /> Tableau de bord
                  </div>
                  <div className="user-menu-item" onClick={() => { setPage('home'); setMenuOpen(false); }}>
                    <i className="ti ti-home" style={{fontSize:16}} /> Accueil
                  </div>
                  <hr className="user-menu-divider" />
                  <div className="user-menu-item danger" onClick={() => { onLogout(); setMenuOpen(false); }}>
                    <i className="ti ti-logout" style={{fontSize:16}} /> Se déconnecter
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <button className="nav-link" onClick={() => setPage('login')}>Connexion</button>
            <button className="nav-btn-primary" onClick={() => setPage('register')}>Inscription</button>
          </>
        )}
      </div>
    </nav>
  );
}

// ── NotifPanel ─────────────────────────────────────────────────────────────────
const NOTIF_ICONS = { demande:'ti-tool', message:'ti-message-circle', status:'ti-circle-check', review:'ti-star' };

export function NotifPanel({ notifs, onClose, onMarkAll, onRead }) {
  const unread = notifs.filter(n => n.unread).length;
  return (
    <>
      <div className="notif-overlay" onClick={onClose} />
      <div className="notif-panel">
        <div className="notif-header">
          <div className="notif-title">
            Notifications
            {unread > 0 && (
              <span style={{background:'var(--accent)',color:'white',fontSize:11,fontWeight:700,
                padding:'2px 8px',borderRadius:20}}>{unread}</span>
            )}
          </div>
          <button className="notif-close-btn" onClick={onClose}><i className="ti ti-x" /></button>
        </div>

        <div className="notif-list">
          {notifs.length === 0 ? (
            <div className="notif-empty">
              <i className="ti ti-bell-off" style={{fontSize:34,display:'block',marginBottom:10,opacity:0.3}} />
              Aucune notification
            </div>
          ) : notifs.map((n, i) => (
            <div key={n.id} className={`notif-item${n.unread ? ' unread' : ''}`}
              style={{animationDelay:`${i*35}ms`}} onClick={() => onRead(n.id)}>
              <div className={`notif-icon t-${n.type}`}>
                <i className={`ti ${NOTIF_ICONS[n.type] || 'ti-bell'}`} />
              </div>
              <div className="notif-content">
                <div className="notif-ntitle">{n.title}</div>
                <div className="notif-ndesc">{n.desc}</div>
                <div className="notif-ntime">{n.time}</div>
              </div>
              {n.unread && <div className="notif-dot" />}
            </div>
          ))}
        </div>

        {unread > 0 && (
          <div className="notif-footer">
            <button className="btn-mark-read" onClick={onMarkAll}>
              <i className="ti ti-checks" style={{marginRight:5,fontSize:14,verticalAlign:-2}} />
              Tout marquer comme lu
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ── ContactModal ───────────────────────────────────────────────────────────────
export function ContactModal({ artisan, onClose, onSubmit }) {
  const [form, setForm] = useState({ name:'', phone:'', description:'', date:'', urgency:'normal' });
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm(f => ({...f, [k]:v}));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = true;
    if (!form.phone.trim()) e.phone = true;
    if (!form.description.trim()) e.description = true;
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSend = async () => {
    if (!validate()) return;
    setSending(true);
    try {
      await onSubmit({ artisan, ...form });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-av" style={{background: artisan.color || 'var(--primary)'}}>
            {artisan.initials || artisan.name?.slice(0,2).toUpperCase()}
          </div>
          <div className="modal-info">
            <div className="modal-pretitle">Demande d'intervention</div>
            <div className="modal-name">{artisan.name}</div>
            <div className="modal-cat">
              <i className="ti ti-briefcase" style={{fontSize:12}} />
              {artisan.category} · {artisan.region}
            </div>
          </div>
          <button className="modal-x" onClick={onClose}><i className="ti ti-x" /></button>
        </div>

        <div className="modal-body">
          <div className="field">
            <label className="field-label">Votre nom<span>*</span></label>
            <input className={`field-input${errors.name?' err':''}`} placeholder="Mohammed Benziane"
              value={form.name} onChange={e => set('name', e.target.value)} />
          </div>
          <div className="field">
            <label className="field-label">Téléphone<span>*</span></label>
            <input className={`field-input${errors.phone?' err':''}`} placeholder="05 XX XX XX XX"
              value={form.phone} onChange={e => set('phone', e.target.value)} />
          </div>
          <div className="field">
            <label className="field-label">Description du problème<span>*</span></label>
            <textarea className={`field-textarea${errors.description?' err':''}`}
              placeholder="Décrivez votre problème…"
              value={form.description} onChange={e => set('description', e.target.value)} />
          </div>
          <div className="field">
            <label className="field-label">Date souhaitée</label>
            <input className="field-input" type="date" value={form.date}
              min={new Date().toISOString().split('T')[0]}
              onChange={e => set('date', e.target.value)} />
          </div>
          <div className="field">
            <label className="field-label">Urgence</label>
            <div className="urgency-group">
              {[{id:'normal',icon:'ti-clock',label:'Normal',sub:'Sous 72h'},
                {id:'urgent',icon:'ti-flame',label:'Urgent',sub:"Aujourd'hui"}].map(opt => (
                <div key={opt.id}
                  className={`urgency-opt${form.urgency===opt.id ? ` sel-${opt.id}` : ''}`}
                  onClick={() => set('urgency', opt.id)}>
                  <i className={`ti ${opt.icon}`} style={{fontSize:19,
                    color: form.urgency===opt.id ? (opt.id==='urgent'?'var(--accent)':'var(--primary)') : 'var(--text-muted)'}} />
                  <div>
                    <div className="urgency-label">{opt.label}</div>
                    <div className="urgency-sub">{opt.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Annuler</button>
          <button className="btn-submit" onClick={handleSend} disabled={sending}>
            {sending ? <><div className="spinner" /> Envoi…</> : <><i className="ti ti-send" style={{fontSize:15}} /> Envoyer la demande</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────
export function Toast({ message }) {
  return (
    <div className="toast">
      <div className="toast-icon"><i className="ti ti-check" style={{fontSize:12,color:'white'}} /></div>
      {message}
    </div>
  );
}

// ── Pill badge ─────────────────────────────────────────────────────────────────
const STATUS_PILLS = {
  pending:   { cls:'pill-pending',  label:'En attente' },
  accepted:  { cls:'pill-prog',     label:'Acceptée' },
  in_progress:{ cls:'pill-blue',   label:'En cours' },
  done:      { cls:'pill-done',     label:'Terminée' },
  cancelled: { cls:'pill-cancelled',label:'Annulée' },
};
export function StatusPill({ status }) {
  const s = STATUS_PILLS[status] || { cls:'pill-gray', label: status };
  return <span className={`pill ${s.cls}`}>{s.label}</span>;
}
