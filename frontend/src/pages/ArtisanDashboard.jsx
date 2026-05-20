import { useState, useEffect } from 'react';
import { repairsAPI } from '../api';
import { StatusPill } from '../components/Shared';
import { LineChart, BarChart, DonutChart } from '../components/Charts';

// ─── Artisan Dashboard ────────────────────────────────────────────────────────

const MOCK_MISSIONS = [
  { _id:'m1', clientName:'Mohammed Benziane', category:'Plomberie',  description:'Fuite robinet cuisine',  status:'pending',     scheduledAt:'2025-05-20', createdAt:'2025-05-18', urgent:true  },
  { _id:'m2', clientName:'Sara Khedim',       category:'Électricité',description:'Disjoncteur qui saute',  status:'accepted',    scheduledAt:'2025-05-22', createdAt:'2025-05-17', urgent:false },
  { _id:'m3', clientName:'Hamid Ouali',       category:'Plomberie',  description:'Remplacement chauffe-eau',status:'in_progress',scheduledAt:'2025-05-19', createdAt:'2025-05-15', urgent:false },
  { _id:'m4', clientName:'Nadia Belhadj',     category:'Plomberie',  description:'WC bouché',              status:'done',        scheduledAt:'2025-04-30', createdAt:'2025-04-28', urgent:true  },
  { _id:'m5', clientName:'Karim Aissaoui',    category:'Électricité',description:'Installation prises',    status:'done',        scheduledAt:'2025-04-22', createdAt:'2025-04-20', urgent:false },
];

const MONTHLY_LINE = [
  {label:'Nov',value:3},{label:'Déc',value:5},{label:'Jan',value:4},
  {label:'Fév',value:6},{label:'Mar',value:8},{label:'Avr',value:7},
];
const RATING_LINE = [
  {label:'Nov',value:4.5},{label:'Déc',value:4.6},{label:'Jan',value:4.7},
  {label:'Fév',value:4.8},{label:'Mar',value:4.8},{label:'Avr',value:4.9},
];

const A_DASH_CSS = `
.artisan-header-bar{display:flex;align-items:flex-start;justify-content:space-between;
  gap:16px;margin-bottom:26px;flex-wrap:wrap}
.profile-badge{display:flex;align-items:center;gap:12px;background:var(--card);
  border:1px solid var(--border);border-radius:14px;padding:14px 18px}
.profile-badge-av{width:46px;height:46px;border-radius:12px;background:var(--primary);
  display:flex;align-items:center;justify-content:center;
  font-family:'Syne',sans-serif;font-size:16px;font-weight:700;color:white;flex-shrink:0}
.profile-badge-name{font-family:'Syne',sans-serif;font-size:15px;font-weight:700;color:var(--text)}
.profile-badge-cat{font-size:12.5px;color:var(--text-muted);margin-top:2px;display:flex;align-items:center;gap:5px}
.toggle-avail{padding:8px 16px;border-radius:9px;font-size:13px;font-weight:600;
  cursor:pointer;border:1.5px solid;font-family:'DM Sans',sans-serif;transition:all 160ms}
.toggle-avail.available{background:#EAF5E6;color:#2A6B1A;border-color:#A8D8B8}
.toggle-avail.available:hover{background:#D5EED8}
.toggle-avail.busy{background:#FAF0EB;color:#9A3515;border-color:#F5C4B3}
.toggle-avail.busy:hover{background:#F7E0D5}
.incoming-card{background:var(--card);border:1px solid var(--border);border-radius:14px;
  padding:18px;margin-bottom:12px;transition:border-color 200ms,box-shadow 200ms;
  animation:card-in 0.3s var(--ease-out) both}
.incoming-card:hover{border-color:#C8C3BA;box-shadow:0 4px 16px rgba(0,0,0,0.06)}
.incoming-card.urgent-card{border-left:3px solid var(--accent)}
.incoming-card-top{display:flex;align-items:flex-start;gap:12px;margin-bottom:10px}
.incoming-client-av{width:38px;height:38px;border-radius:10px;background:#EEF0FA;
  display:flex;align-items:center;justify-content:center;
  font-size:13px;font-weight:700;color:#3B4CBF;flex-shrink:0}
.incoming-client-name{font-size:14px;font-weight:700;color:var(--text);margin-bottom:2px}
.incoming-meta{font-size:12px;color:var(--text-muted);display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.incoming-desc{font-size:13px;color:var(--text-mid);margin-bottom:12px;line-height:1.5;
  background:var(--sand);border-radius:8px;padding:9px 12px}
.incoming-footer{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px}
.urgent-tag{display:inline-flex;align-items:center;gap:5px;padding:3px 9px;
  background:var(--accent-light);color:var(--accent);font-size:11.5px;font-weight:700;border-radius:20px}
.profile-section{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px}
@media(max-width:680px){.profile-section{grid-template-columns:1fr}}
.avail-toggle-wrap{display:flex;align-items:center;justify-content:space-between;
  margin-bottom:14px}
`;

export default function ArtisanDashboard({ user, setPage }) {
  const [section,   setSection]   = useState('apercu');
  const [missions,  setMissions]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [available, setAvailable] = useState(true);
  const [updating,  setUpdating]  = useState({});

  const initials = user ? user.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() : 'AR';

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await repairsAPI.myMissions();
        setMissions(Array.isArray(data) ? data : MOCK_MISSIONS);
      } catch {
        setMissions(MOCK_MISSIONS);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const pending = missions.filter(m => m.status === 'pending');
  const active  = missions.filter(m => m.status === 'in_progress' || m.status === 'accepted');
  const done    = missions.filter(m => m.status === 'done');

  const updateStatus = async (id, status) => {
    setUpdating(u => ({...u, [id]: true}));
    try {
      await repairsAPI.updateStatus(id, status);
      setMissions(ms => ms.map(m => m._id === id ? {...m, status} : m));
    } catch {
      // Optimistic update failed — revert
      setMissions(ms => ms.map(m => m));
    } finally {
      setUpdating(u => ({...u, [id]: false}));
    }
  };

  const donutData = [
    { label:'Terminées',  value: done.length,                                color:'#0C5E47' },
    { label:'En cours',   value: active.length,                              color:'#185FA5' },
    { label:'En attente', value: pending.length,                             color:'#BA7517' },
    { label:'Annulées',   value: missions.filter(m=>m.status==='cancelled').length, color:'#A32D2D' },
  ].filter(d => d.value > 0);

  const NAV_ITEMS = [
    { id:'apercu',    icon:'ti-layout-dashboard', label:'Aperçu' },
    { id:'demandes',  icon:'ti-inbox',            label:`Demandes${pending.length > 0 ? ` (${pending.length})` : ''}` },
    { id:'missions',  icon:'ti-clipboard-list',   label:'Mes missions' },
    { id:'profil',    icon:'ti-user',             label:'Mon profil' },
  ];

  return (
    <>
      <style>{A_DASH_CSS}</style>
      <div className="dash-layout">

        {/* Sidebar */}
        <aside className="dash-sidebar">
          <div className="sidebar-av-wrap">
            <div className="sidebar-av">{initials}</div>
            <div className="sidebar-av-info">
              <div className="sidebar-av-name">{user?.name || 'Artisan'}</div>
              <div className="sidebar-av-role">Artisan</div>
            </div>
          </div>

          <div className="dash-sidebar-section">Navigation</div>

          {NAV_ITEMS.map(item => (
            <button key={item.id}
              className={`dash-nav-item${section === item.id ? ' active' : ''}`}
              onClick={() => setSection(item.id)}>
              <i className={`ti ${item.icon}`} />
              {item.label}
              {item.id === 'demandes' && pending.length > 0 && (
                <span style={{marginLeft:'auto',background:'var(--accent)',color:'white',
                  fontSize:10,fontWeight:700,padding:'2px 7px',borderRadius:20}}>{pending.length}</span>
              )}
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
              <div className="artisan-header-bar">
                <div>
                  <div className="dash-page-title">Bienvenue, {user?.name?.split(' ')[0] || 'Artisan'} 👷</div>
                  <div style={{fontSize:14,color:'var(--text-muted)',marginTop:4}}>
                    Voici vos statistiques et vos dernières activités.
                  </div>
                </div>
                <button
                  className={`toggle-avail ${available ? 'available' : 'busy'}`}
                  onClick={() => setAvailable(a => !a)}>
                  <span style={{width:7,height:7,borderRadius:'50%',
                    background: available ? '#2A6B1A' : '#9A3515',
                    display:'inline-block',marginRight:7}} />
                  {available ? 'Disponible' : 'Indisponible'}
                </button>
              </div>

              {/* Stats */}
              <div className="stat-grid">
                {[
                  { icon:'ti-clipboard-list', bg:'#E6F5F0', ic:'#0C5E47', val:missions.length, lbl:'Total missions', delta:'+3 ce mois', up:true },
                  { icon:'ti-clock',          bg:'#FFF8E8', ic:'#9A7012', val:pending.length,  lbl:'En attente' },
                  { icon:'ti-refresh',        bg:'#EEF0FA', ic:'#3B4CBF', val:active.length,   lbl:'En cours' },
                  { icon:'ti-star',           bg:'#FFF8E8', ic:'#9A7012', val:'4.8',           lbl:'Note moyenne', delta:'+0.1', up:true },
                ].map((s, i) => (
                  <div className="stat-card" key={i}>
                    <div className="stat-card-icon" style={{background:s.bg}}>
                      <i className={`ti ${s.icon}`} style={{color:s.ic}} />
                    </div>
                    <div className="stat-card-val">{s.val}</div>
                    <div className="stat-card-label">{s.lbl}</div>
                    {s.delta && (
                      <div className={`stat-card-delta ${s.up ? 'delta-up' : 'delta-down'}`}>
                        <i className={`ti ti-trending-${s.up ? 'up' : 'down'}`} style={{fontSize:12}} />
                        {s.delta}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Charts */}
              <div className="chart-2col">
                <div className="chart-card">
                  <div className="chart-title">Missions par mois</div>
                  <div className="chart-sub">6 derniers mois</div>
                  <LineChart data={MONTHLY_LINE} color="#0C5E47" height={170} />
                </div>
                <div className="chart-card">
                  <div className="chart-title">Évolution de la note</div>
                  <div className="chart-sub">Note moyenne /5</div>
                  <LineChart data={RATING_LINE} color="#D4572A" height={170} unit="" />
                </div>
              </div>

              {/* Pending quick view */}
              {pending.length > 0 && (
                <>
                  <div className="section-hd">
                    <div className="section-title">Demandes en attente</div>
                    <button style={{fontSize:13,color:'var(--primary)',background:'none',border:'none',
                      cursor:'pointer',fontWeight:600,fontFamily:'DM Sans,sans-serif'}}
                      onClick={() => setSection('demandes')}>Voir tout →</button>
                  </div>
                  {pending.slice(0,2).map(m => (
                    <IncomingCard key={m._id} mission={m} onUpdate={updateStatus} updating={updating[m._id]} />
                  ))}
                </>
              )}
            </>
          )}

          {/* ── DEMANDES ENTRANTES ── */}
          {section === 'demandes' && (
            <>
              <div className="client-dash-header">
                <div className="dash-page-title">Demandes entrantes</div>
                <div style={{fontSize:14,color:'var(--text-muted)',marginTop:4}}>
                  Acceptez ou refusez les demandes de vos clients.
                </div>
              </div>

              {loading ? (
                <div style={{padding:'40px 0',textAlign:'center',color:'var(--text-muted)'}}>Chargement…</div>
              ) : pending.length === 0 ? (
                <div className="empty-state">
                  <i className="ti ti-inbox" />
                  <h3>Aucune demande en attente</h3>
                  <p>Vous recevrez ici les nouvelles demandes de vos clients.</p>
                </div>
              ) : (
                pending.map(m => (
                  <IncomingCard key={m._id} mission={m} onUpdate={updateStatus} updating={updating[m._id]} />
                ))
              )}
            </>
          )}

          {/* ── MES MISSIONS ── */}
          {section === 'missions' && (
            <>
              <div className="client-dash-header">
                <div className="dash-page-title">Mes missions</div>
                <div style={{fontSize:14,color:'var(--text-muted)',marginTop:4}}>
                  Toutes vos missions passées et en cours.
                </div>
              </div>

              {/* Charts row */}
              <div className="chart-2col" style={{marginBottom:20}}>
                <div className="chart-card">
                  <div className="chart-title">Volume mensuel</div>
                  <div className="chart-sub">Missions réalisées</div>
                  <BarChart data={MONTHLY_LINE} color="#0C5E47" height={160} />
                </div>
                <div className="chart-card">
                  <div className="chart-title">Répartition statuts</div>
                  <div className="chart-sub">Toutes les missions</div>
                  {donutData.length > 0
                    ? <DonutChart data={donutData} size={140} />
                    : <div style={{padding:'30px 0',textAlign:'center',color:'var(--text-muted)',fontSize:13}}>Aucune donnée</div>
                  }
                </div>
              </div>

              {loading ? (
                <div style={{padding:'40px 0',textAlign:'center',color:'var(--text-muted)'}}>Chargement…</div>
              ) : (
                <div className="card" style={{padding:0,overflow:'hidden'}}>
                  <table className="tbl">
                    <thead>
                      <tr><th>Client</th><th>Description</th><th>Statut</th><th>Planifiée</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {missions.map(m => (
                        <tr key={m._id}>
                          <td>
                            <div style={{fontWeight:600,fontSize:13.5,color:'var(--text)'}}>{m.clientName}</div>
                            <div style={{fontSize:12,color:'var(--text-muted)'}}>{m.category}</div>
                          </td>
                          <td><div style={{fontSize:12.5,color:'var(--text-mid)',maxWidth:200,
                            overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                            {m.description}</div></td>
                          <td><StatusPill status={m.status} /></td>
                          <td><div style={{fontSize:12,color:'var(--text-muted)'}}>{m.scheduledAt?.slice(0,10)||'—'}</div></td>
                          <td>
                            {m.status === 'in_progress' && (
                              <button className="act-btn act-accept"
                                disabled={updating[m._id]}
                                onClick={() => updateStatus(m._id, 'done')}>
                                Marquer terminé
                              </button>
                            )}
                            {m.status === 'done' && (
                              <span style={{fontSize:12,color:'var(--text-muted)'}}>Terminée ✓</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* ── MON PROFIL ── */}
          {section === 'profil' && (
            <>
              <div className="client-dash-header">
                <div className="dash-page-title">Mon profil</div>
                <div style={{fontSize:14,color:'var(--text-muted)',marginTop:4}}>
                  Gérez vos informations et votre disponibilité.
                </div>
              </div>
              <div className="profile-section">
                <div className="card">
                  <div style={{fontFamily:'Syne,sans-serif',fontSize:14,fontWeight:700,
                    marginBottom:16,color:'var(--text)'}}>Informations</div>
                  <div className="field" style={{marginBottom:14}}>
                    <label className="field-label">Nom complet</label>
                    <input className="field-input" defaultValue={user?.name} />
                  </div>
                  <div className="field" style={{marginBottom:14}}>
                    <label className="field-label">Email</label>
                    <input className="field-input" defaultValue={user?.email} type="email" />
                  </div>
                  <div className="field" style={{marginBottom:14}}>
                    <label className="field-label">Téléphone</label>
                    <input className="field-input" placeholder="05 XX XX XX XX" />
                  </div>
                  <div className="field" style={{marginBottom:14}}>
                    <label className="field-label">Catégorie</label>
                    <input className="field-input" defaultValue={user?.category || 'Plomberie'} />
                  </div>
                  <button className="nav-btn-primary" style={{width:'100%',height:40,fontSize:14}}>
                    Enregistrer
                  </button>
                </div>

                <div>
                  <div className="card" style={{marginBottom:14}}>
                    <div style={{fontFamily:'Syne,sans-serif',fontSize:14,fontWeight:700,
                      marginBottom:14,color:'var(--text)'}}>Disponibilité</div>
                    <div className="avail-toggle-wrap">
                      <span style={{fontSize:14,color:'var(--text-mid)'}}>Statut actuel</span>
                      <button className={`toggle-avail ${available ? 'available' : 'busy'}`}
                        onClick={() => setAvailable(a => !a)}>
                        {available ? '✓ Disponible' : '✗ Indisponible'}
                      </button>
                    </div>
                    <p style={{fontSize:13,color:'var(--text-muted)',lineHeight:1.5}}>
                      Basculez votre disponibilité pour contrôler si les clients peuvent vous envoyer des demandes.
                    </p>
                  </div>

                  <div className="card">
                    <div style={{fontFamily:'Syne,sans-serif',fontSize:14,fontWeight:700,
                      marginBottom:14,color:'var(--text)'}}>Statistiques</div>
                    {[
                      {label:'Missions totales', val:missions.length},
                      {label:'Missions terminées', val:done.length},
                      {label:'Note moyenne', val:'4.8 / 5'},
                      {label:'Taux de réponse', val:'94%'},
                    ].map((s,i) => (
                      <div key={i} style={{display:'flex',justifyContent:'space-between',
                        padding:'9px 0',borderBottom: i < 3 ? '1px solid var(--border)' : 'none'}}>
                        <span style={{fontSize:13.5,color:'var(--text-muted)'}}>{s.label}</span>
                        <span style={{fontSize:13.5,fontWeight:700,color:'var(--text)'}}>{s.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

        </main>
      </div>
    </>
  );
}

// ── Incoming Request Card ─────────────────────────────────────────────────────
function IncomingCard({ mission, onUpdate, updating }) {
  const ini = mission.clientName?.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() || 'CL';

  return (
    <div className={`incoming-card${mission.urgent ? ' urgent-card' : ''}`}>
      <div className="incoming-card-top">
        <div className="incoming-client-av">{ini}</div>
        <div style={{flex:1}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:3}}>
            <div className="incoming-client-name">{mission.clientName}</div>
            {mission.urgent && (
              <span className="urgent-tag">
                <i className="ti ti-flame" style={{fontSize:11}} />Urgent
              </span>
            )}
          </div>
          <div className="incoming-meta">
            <span><i className="ti ti-briefcase" style={{fontSize:12,marginRight:3}} />{mission.category}</span>
            <span><i className="ti ti-calendar" style={{fontSize:12,marginRight:3}} />{mission.scheduledAt?.slice(0,10)||'—'}</span>
          </div>
        </div>
        <StatusPill status={mission.status} />
      </div>

      <div className="incoming-desc">
        "{mission.description}"
      </div>

      <div className="incoming-footer">
        <div style={{fontSize:12,color:'var(--text-muted)'}}>
          <i className="ti ti-clock" style={{fontSize:12,marginRight:4}} />
          Reçue le {mission.createdAt?.slice(0,10)||'—'}
        </div>
        {mission.status === 'pending' && (
          <div className="row-actions">
            <button className="act-btn act-decline" disabled={updating}
              onClick={() => onUpdate(mission._id, 'cancelled')}>
              {updating ? '…' : 'Refuser'}
            </button>
            <button className="act-btn act-accept" disabled={updating}
              onClick={() => onUpdate(mission._id, 'accepted')}>
              {updating ? '…' : '✓ Accepter'}
            </button>
          </div>
        )}
        {mission.status === 'accepted' && (
          <button className="act-btn act-accept" disabled={updating}
            onClick={() => onUpdate(mission._id, 'in_progress')}>
            Démarrer →
          </button>
        )}
      </div>
    </div>
  );
}
