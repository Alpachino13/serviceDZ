import { useState, useEffect } from 'react';
import { repairsAPI, workersAPI } from '../api';
import { StatusPill } from '../components/Shared';
import { BarChart, DonutChart } from '../components/Charts';

// ─── Client Dashboard ─────────────────────────────────────────────────────────

const MOCK_REPAIRS = [
  { _id:'r1', artisanName:'Khaled Bouras', category:'Plomberie', description:'Fuite sous évier',    status:'done',        scheduledAt:'2025-04-12', createdAt:'2025-04-10' },
  { _id:'r2', artisanName:'Amine Ziani',   category:'Électricité',description:'Panne tableau élec', status:'in_progress', scheduledAt:'2025-05-03', createdAt:'2025-04-28' },
  { _id:'r3', artisanName:'Sofiane Hadj',  category:'Maçonnerie', description:'Fissure mur salon',  status:'pending',     scheduledAt:'2025-05-15', createdAt:'2025-05-10' },
  { _id:'r4', artisanName:'Yacine Khelil', category:'Plomberie',  description:'Remplacement robinet',status:'done',        scheduledAt:'2025-03-22', createdAt:'2025-03-20' },
  { _id:'r5', artisanName:'Billal Tahar',  category:'Électricité',description:'Installation prise',  status:'cancelled',   scheduledAt:'2025-02-18', createdAt:'2025-02-15' },
];

const MONTHLY_DATA = [
  {label:'Nov',value:1},{label:'Déc',value:0},{label:'Jan',value:2},
  {label:'Fév',value:1},{label:'Mar',value:2},{label:'Avr',value:3},
];

const DASH_CSS = `
.client-dash-header{margin-bottom:26px}
.dash-page-title{font-family:'Syne',sans-serif;font-size:26px;font-weight:800;color:var(--text);
  letter-spacing:-0.5px}
.dash-page-sub{font-size:14px;color:var(--text-muted);margin-top:4px}
.chart-2col{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px}
@media(max-width:700px){.chart-2col{grid-template-columns:1fr}}
.repair-row-info{display:flex;flex-direction:column;gap:2px}
.repair-artisan-name{font-size:13.5px;font-weight:600;color:var(--text)}
.repair-category{font-size:12px;color:var(--text-muted)}
.repair-desc{font-size:12.5px;color:var(--text-mid);max-width:220px;
  overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.repair-date{font-size:12px;color:var(--text-muted)}
.sidebar-av-wrap{display:flex;align-items:center;gap:10px;padding:0 14px 14px}
.sidebar-av{width:38px;height:38px;border-radius:50%;background:var(--primary);
  display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:white}
.sidebar-av-info{flex:1;min-width:0}
.sidebar-av-name{font-size:13.5px;font-weight:700;color:var(--text);white-space:nowrap;
  overflow:hidden;text-overflow:ellipsis}
.sidebar-av-role{font-size:11.5px;color:var(--text-muted)}
`;

const SECTIONS = ['apercu', 'missions', 'rechercher'];

export default function ClientDashboard({ user, setPage, onContact }) {
  const [section, setSection]   = useState('apercu');
  const [repairs, setRepairs]   = useState([]);
  const [loading, setLoading]   = useState(true);

  const initials = user ? user.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() : 'CL';

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await repairsAPI.myRepairs();
        setRepairs(Array.isArray(data) ? data : MOCK_REPAIRS);
      } catch {
        setRepairs(MOCK_REPAIRS);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const stats = {
    total:    repairs.length,
    pending:  repairs.filter(r => r.status === 'pending').length,
    progress: repairs.filter(r => r.status === 'in_progress' || r.status === 'accepted').length,
    done:     repairs.filter(r => r.status === 'done').length,
    cancelled:repairs.filter(r => r.status === 'cancelled').length,
  };

  const donutData = [
    { label:'Terminées',   value: stats.done,      color:'#0C5E47' },
    { label:'En cours',    value: stats.progress,   color:'#185FA5' },
    { label:'En attente',  value: stats.pending,    color:'#BA7517' },
    { label:'Annulées',    value: stats.cancelled,  color:'#A32D2D' },
  ].filter(d => d.value > 0);

  return (
    <>
      <style>{DASH_CSS}</style>
      <div className="dash-layout">

        {/* Sidebar */}
        <aside className="dash-sidebar">
          <div className="sidebar-av-wrap">
            <div className="sidebar-av">{initials}</div>
            <div className="sidebar-av-info">
              <div className="sidebar-av-name">{user?.name || 'Client'}</div>
              <div className="sidebar-av-role">Client</div>
            </div>
          </div>

          <div className="dash-sidebar-section">Navigation</div>

          {[
            { id:'apercu',    icon:'ti-layout-dashboard', label:'Aperçu' },
            { id:'missions',  icon:'ti-clipboard-list',   label:'Mes demandes' },
            { id:'rechercher',icon:'ti-search',           label:'Trouver artisan' },
          ].map(item => (
            <button key={item.id} className={`dash-nav-item${section === item.id ? ' active' : ''}`}
              onClick={() => setSection(item.id)}>
              <i className={`ti ${item.icon}`} />
              {item.label}
            </button>
          ))}

          <div className="dash-sidebar-bottom">
            <button className="dash-nav-item" onClick={() => setPage('home')}>
              <i className="ti ti-home" />Accueil
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="dash-main">

          {/* ── APERÇU ── */}
          {section === 'apercu' && (
            <>
              <div className="client-dash-header">
                <div className="dash-page-title">Bonjour, {user?.name?.split(' ')[0] || 'Client'} 👋</div>
                <div className="dash-page-sub">Voici le résumé de vos demandes d'intervention.</div>
              </div>

              {/* Stats */}
              <div className="stat-grid">
                {[
                  { icon:'ti-clipboard-list', bg:'#E6F5F0', iconColor:'#0C5E47', val:stats.total,    lbl:'Total demandes' },
                  { icon:'ti-clock',          bg:'#FFF8E8', iconColor:'#9A7012', val:stats.pending,   lbl:'En attente' },
                  { icon:'ti-refresh',        bg:'#EEF0FA', iconColor:'#3B4CBF', val:stats.progress,  lbl:'En cours' },
                  { icon:'ti-circle-check',   bg:'#E6F5F0', iconColor:'#0C5E47', val:stats.done,      lbl:'Terminées' },
                ].map((s, i) => (
                  <div className="stat-card" key={i}>
                    <div className="stat-card-icon" style={{background:s.bg}}>
                      <i className={`ti ${s.icon}`} style={{color:s.iconColor}} />
                    </div>
                    <div className="stat-card-val">{s.val}</div>
                    <div className="stat-card-label">{s.lbl}</div>
                  </div>
                ))}
              </div>

              {/* Charts */}
              <div className="chart-2col">
                <div className="chart-card">
                  <div className="chart-title">Demandes par mois</div>
                  <div className="chart-sub">6 derniers mois</div>
                  <BarChart data={MONTHLY_DATA} color="#0C5E47" height={170} />
                </div>

                <div className="chart-card">
                  <div className="chart-title">Répartition des statuts</div>
                  <div className="chart-sub">Toutes les demandes</div>
                  {donutData.length > 0
                    ? <DonutChart data={donutData} size={150} />
                    : <div style={{padding:'30px 0',color:'var(--text-muted)',fontSize:13,textAlign:'center'}}>
                        Aucune donnée
                      </div>
                  }
                </div>
              </div>

              {/* Recent */}
              <div className="section-hd">
                <div className="section-title">Demandes récentes</div>
                <button style={{fontSize:13,color:'var(--primary)',background:'none',border:'none',
                  cursor:'pointer',fontWeight:600,fontFamily:'DM Sans,sans-serif'}}
                  onClick={() => setSection('missions')}>Voir tout →</button>
              </div>
              <div className="card" style={{padding:0,overflow:'hidden'}}>
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>Artisan</th><th>Description</th><th>Statut</th><th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {repairs.slice(0,4).map(r => (
                      <tr key={r._id}>
                        <td>
                          <div className="repair-artisan-name">{r.artisanName || 'Artisan'}</div>
                          <div className="repair-category">{r.category}</div>
                        </td>
                        <td><div className="repair-desc">{r.description}</div></td>
                        <td><StatusPill status={r.status} /></td>
                        <td><div className="repair-date">{r.scheduledAt?.slice(0,10) || '—'}</div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ── MES DEMANDES ── */}
          {section === 'missions' && (
            <>
              <div className="client-dash-header">
                <div className="dash-page-title">Mes demandes</div>
                <div className="dash-page-sub">Toutes vos demandes d'intervention.</div>
              </div>

              {loading ? (
                <div style={{padding:'40px 0',textAlign:'center',color:'var(--text-muted)'}}>Chargement…</div>
              ) : repairs.length === 0 ? (
                <div className="empty-state">
                  <i className="ti ti-clipboard" />
                  <h3>Aucune demande</h3>
                  <p>Recherchez un artisan pour créer votre première demande.</p>
                </div>
              ) : (
                <div className="card" style={{padding:0,overflow:'hidden'}}>
                  <table className="tbl">
                    <thead>
                      <tr>
                        <th>Artisan</th><th>Description</th><th>Statut</th><th>Planifiée</th><th>Créée</th>
                      </tr>
                    </thead>
                    <tbody>
                      {repairs.map(r => (
                        <tr key={r._id}>
                          <td>
                            <div className="repair-artisan-name">{r.artisanName || 'Artisan'}</div>
                            <div className="repair-category">{r.category}</div>
                          </td>
                          <td><div className="repair-desc">{r.description}</div></td>
                          <td><StatusPill status={r.status} /></td>
                          <td><div className="repair-date">{r.scheduledAt?.slice(0,10) || '—'}</div></td>
                          <td><div className="repair-date">{r.createdAt?.slice(0,10)}</div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* ── RECHERCHER ── */}
          {section === 'rechercher' && (
            <>
              <div className="client-dash-header">
                <div className="dash-page-title">Trouver un artisan</div>
                <div className="dash-page-sub">Retournez sur l'accueil pour rechercher et contacter un artisan.</div>
              </div>
              <div className="card" style={{textAlign:'center',padding:48}}>
                <i className="ti ti-search" style={{fontSize:40,color:'var(--text-muted)',opacity:0.4,display:'block',marginBottom:14}} />
                <div style={{fontFamily:'Syne,sans-serif',fontSize:17,fontWeight:700,marginBottom:8}}>
                  Parcourir les artisans
                </div>
                <div style={{fontSize:14,color:'var(--text-muted)',marginBottom:22}}>
                  Filtrez par métier, région et disponibilité.
                </div>
                <button className="nav-btn-primary" onClick={() => setPage('home')} style={{margin:'0 auto'}}>
                  Voir tous les artisans →
                </button>
              </div>
            </>
          )}

        </main>
      </div>
    </>
  );
}
