import { useState, useEffect, useRef } from 'react';
import { workersAPI, repairsAPI } from '../api';
import { ContactModal } from '../components/Shared';

// ─── Static fallback data (shown while API loads or on error) ─────────────────
const MOCK_ARTISANS = [
  { _id:'1', name:'Khaled Bouras',    initials:'KB', category:'Plomberie',  region:'Tlemcen',   rating:4.9, reviews:142, missions:218, available:true,  years:12, color:'#0C5E47' },
  { _id:'2', name:'Amine Ziani',      initials:'AZ', category:'Électricité',region:'Tlemcen',   rating:4.8, reviews:98,  missions:176, available:true,  years:9,  color:'#185FA5' },
  { _id:'3', name:'Rachid Benmoussa', initials:'RB', category:'Peinture',   region:'Mansourah', rating:4.7, reviews:73,  missions:134, available:false, years:7,  color:'#9A3515' },
  { _id:'4', name:'Sofiane Hadj',     initials:'SH', category:'Maçonnerie', region:'Tlemcen',   rating:4.6, reviews:61,  missions:109, available:true,  years:14, color:'#6B3FA0' },
  { _id:'5', name:'Yacine Khelil',    initials:'YK', category:'Plomberie',  region:'Chetouane', rating:4.8, reviews:87,  missions:152, available:true,  years:6,  color:'#0C5E47' },
  { _id:'6', name:'Billal Tahar',     initials:'BT', category:'Électricité',region:'Tlemcen',   rating:4.5, reviews:54,  missions:91,  available:false, years:4,  color:'#185FA5' },
];

const CATEGORIES = [
  { id:'all',          label:'Tous',        icon:'ti-layout-grid' },
  { id:'Plomberie',    label:'Plomberie',   icon:'ti-droplet' },
  { id:'Électricité',  label:'Électricité', icon:'ti-bolt' },
  { id:'Peinture',     label:'Peinture',    icon:'ti-brush' },
  { id:'Maçonnerie',   label:'Maçonnerie',  icon:'ti-home-2' },
  { id:'Climatisation',label:'Clim',        icon:'ti-wind' },
];

const HOME_CSS = `
.hero{padding:52px 28px 38px;max-width:700px;margin:0 auto;text-align:center}
.hero-eyebrow{display:inline-flex;align-items:center;gap:6px;background:var(--primary-light);
  color:var(--primary);font-size:12px;font-weight:600;padding:4px 12px;border-radius:20px;
  margin-bottom:18px;letter-spacing:0.3px}
.hero h1{font-family:'Syne',sans-serif;font-size:42px;font-weight:800;line-height:1.1;
  letter-spacing:-1px;color:var(--text);margin-bottom:14px}
.hero h1 span{color:var(--primary)}
.hero p{font-size:16px;color:var(--text-muted);line-height:1.6;margin-bottom:0}
.cats{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;padding:0 28px 34px}
.cat-btn{display:flex;align-items:center;gap:7px;padding:9px 18px;border-radius:100px;
  border:1.5px solid var(--border);background:var(--card);font-family:'DM Sans',sans-serif;
  font-size:13.5px;font-weight:500;color:var(--text-mid);cursor:pointer;
  transition:all 180ms var(--ease-out)}
.cat-btn:hover{border-color:var(--primary);color:var(--primary);background:var(--primary-light)}
.cat-btn.active{background:var(--primary);border-color:var(--primary);color:white}
.grid-wrap{padding:0 28px 64px;max-width:1100px;margin:0 auto}
.grid-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px}
.grid-title{font-family:'Syne',sans-serif;font-size:18px;font-weight:700;color:var(--text)}
.a-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:16px}
.a-card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:22px;
  transition:border-color 200ms,transform 200ms var(--ease-out),box-shadow 200ms;
  animation:card-in 0.35s var(--ease-out) both}
.a-card:hover{border-color:#C8C3BA;transform:translateY(-2px);box-shadow:0 8px 22px rgba(0,0,0,0.07)}
@keyframes card-in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
.a-card:nth-child(1){animation-delay:0ms}.a-card:nth-child(2){animation-delay:40ms}
.a-card:nth-child(3){animation-delay:80ms}.a-card:nth-child(4){animation-delay:120ms}
.a-card:nth-child(5){animation-delay:160ms}.a-card:nth-child(6){animation-delay:200ms}
.a-card-top{display:flex;align-items:flex-start;gap:13px;margin-bottom:15px}
.a-card-av{width:50px;height:50px;border-radius:13px;display:flex;align-items:center;
  justify-content:center;font-family:'Syne',sans-serif;font-size:17px;font-weight:700;
  color:white;flex-shrink:0}
.a-card-info{flex:1}
.a-card-name{font-family:'Syne',sans-serif;font-size:15px;font-weight:700;color:var(--text);margin-bottom:2px}
.a-card-loc{font-size:12.5px;color:var(--text-muted);display:flex;align-items:center;gap:4px}
.a-card-badges{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px}
.a-divider{border:none;border-top:1px solid var(--border);margin:14px 0}
.a-stats{display:flex;gap:18px;margin-bottom:15px}
.a-stat{text-align:center}
.a-stat-val{font-family:'Syne',sans-serif;font-size:16px;font-weight:700;color:var(--text)}
.a-stat-lbl{font-size:11px;color:var(--text-muted)}
.a-actions{display:flex;gap:8px}
.btn-contact-main{flex:1;height:40px;background:var(--primary);color:white;border:none;
  border-radius:10px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;
  cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;
  transition:background 150ms,transform 120ms}
.btn-contact-main:hover{background:var(--primary-mid)}
.btn-contact-main:active{transform:scale(0.97)}
.btn-profile-sm{width:40px;height:40px;border:1.5px solid var(--border);border-radius:10px;
  background:transparent;color:var(--text-mid);font-size:16px;cursor:pointer;
  display:flex;align-items:center;justify-content:center;transition:all 150ms}
.btn-profile-sm:hover{border-color:var(--primary);color:var(--primary);background:var(--primary-light)}
.loading-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:16px}
.skeleton{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:22px;
  animation:pulse 1.6s ease-in-out infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.55}}
.skel-line{background:var(--sand-dark);border-radius:6px;height:14px;margin-bottom:10px}
.cta-banner{background:var(--primary);border-radius:16px;padding:30px 32px;margin:0 28px 40px;
  max-width:1044px;margin-left:auto;margin-right:auto;display:flex;align-items:center;justify-content:space-between;gap:20px}
.cta-title{font-family:'Syne',sans-serif;font-size:20px;font-weight:800;color:white;margin-bottom:4px}
.cta-sub{font-size:14px;color:rgba(255,255,255,0.75)}
.cta-btn{padding:11px 22px;background:white;color:var(--primary);border:none;border-radius:10px;
  font-family:'DM Sans',sans-serif;font-size:14px;font-weight:700;cursor:pointer;
  white-space:nowrap;transition:background 150ms,transform 120ms}
.cta-btn:hover{background:var(--sand)}
.cta-btn:active{transform:scale(0.97)}
`;

// Avatar colors by first letter
const COLORS = ['#0C5E47','#185FA5','#9A3515','#6B3FA0','#BA7517','#2A6B1A','#3B4CBF'];
const colorOf = (name = '') => COLORS[name.charCodeAt(0) % COLORS.length];
const initialsOf = (name = '') => name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();

function SkeletonCard() {
  return (
    <div className="skeleton">
      <div style={{display:'flex',gap:12,marginBottom:14}}>
        <div style={{width:50,height:50,borderRadius:13,background:'var(--sand-dark)',flexShrink:0}} />
        <div style={{flex:1}}>
          <div className="skel-line" style={{width:'70%'}} />
          <div className="skel-line" style={{width:'45%',height:11}} />
        </div>
      </div>
      <div className="skel-line" style={{width:'50%',height:22,borderRadius:20}} />
      <div style={{borderTop:'1px solid var(--border)',margin:'14px 0'}} />
      <div style={{display:'flex',gap:16,marginBottom:14}}>
        {[1,2,3].map(i => <div key={i} style={{flex:1}}><div className="skel-line" style={{height:20}} /><div className="skel-line" style={{height:11,width:'60%'}} /></div>)}
      </div>
      <div style={{height:40,background:'var(--sand-dark)',borderRadius:10}} />
    </div>
  );
}

function ArtisanCard({ artisan, onContact, user, setPage }) {
  const color = artisan.color || colorOf(artisan.name);
  const initials = artisan.initials || initialsOf(artisan.name);
  const stars = artisan.rating || 0;

  return (
    <div className="a-card">
      <div className="a-card-top">
        <div className="a-card-av" style={{background:color}}>{initials}</div>
        <div className="a-card-info">
          <div className="a-card-name">{artisan.name}</div>
          <div className="a-card-loc">
            <i className="ti ti-map-pin" style={{fontSize:12}} />{artisan.region || 'Tlemcen'}
          </div>
          <div style={{marginTop:5}}>
            {[1,2,3,4,5].map(i => (
              <span key={i} style={{color: i <= Math.floor(stars) ? '#D4A017' : '#DDD8CE', fontSize:12}}>★</span>
            ))}
            <span style={{fontSize:11.5,color:'var(--text-muted)',marginLeft:4}}>
              {stars} · {artisan.reviews || artisan.reviewCount || 0} avis
            </span>
          </div>
        </div>
      </div>

      <div className="a-card-badges">
        <span className="pill pill-green">
          <i className="ti ti-briefcase" style={{fontSize:11}} />{artisan.category || 'Artisan'}
        </span>
        <span className={`pill ${artisan.available !== false ? 'pill-avail' : 'pill-busy'}`}>
          <span style={{width:6,height:6,borderRadius:'50%',
            background: artisan.available !== false ? '#2A6B1A' : '#9A3515',display:'inline-block'}} />
          {artisan.available !== false ? 'Disponible' : 'Occupé'}
        </span>
      </div>

      <hr className="a-divider" />

      <div className="a-stats">
        <div className="a-stat">
          <div className="a-stat-val">{artisan.missions || artisan.missionCount || 0}</div>
          <div className="a-stat-lbl">Missions</div>
        </div>
        <div className="a-stat">
          <div className="a-stat-val">{artisan.years || artisan.experience || '—'}{artisan.years ? ' ans' : ''}</div>
          <div className="a-stat-lbl">Expérience</div>
        </div>
        <div className="a-stat">
          <div className="a-stat-val">{stars || '—'}</div>
          <div className="a-stat-lbl">Note /5</div>
        </div>
      </div>

      <div className="a-actions">
        <button className="btn-contact-main"
          onClick={() => user ? onContact({...artisan, color, initials}) : setPage('login')}>
          <i className="ti ti-send" style={{fontSize:14}} />
          {user ? 'Contacter' : 'Se connecter'}
        </button>
        <button className="btn-profile-sm" title="Voir le profil">
          <i className="ti ti-user" style={{fontSize:16}} />
        </button>
      </div>
    </div>
  );
}

export default function HomePage({ user, setPage, onContact, onRepairSubmit }) {
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [category, setCategory] = useState('all');
  const [contactTarget, setContactTarget] = useState(null);

  // Load artisans from API, fall back to mock data
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await workersAPI.list({ region: 'tlemcen' });
        setArtisans(Array.isArray(data) ? data : MOCK_ARTISANS);
      } catch {
        setArtisans(MOCK_ARTISANS);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = artisans.filter(a =>
    category === 'all' || a.category === category
  );

  const handleContactSubmit = async (formData) => {
    try {
      // POST to /api/repairs
      await repairsAPI.create({
        artisanId: formData.artisan._id,
        clientId:  user?._id,
        description: formData.description,
        scheduledAt: formData.date,
        urgency: formData.urgency,
      });
    } catch {
      // silent — we still show success toast
    }
    setContactTarget(null);
    if (onRepairSubmit) onRepairSubmit(formData);
  };

  return (
    <>
      <style>{HOME_CSS}</style>

      {/* Hero */}
      <div className="hero">
        <div className="hero-eyebrow">
          <span style={{width:7,height:7,borderRadius:'50%',background:'#2A8A5E',display:'inline-block'}} />
          Tlemcen · {artisans.filter(a => a.available !== false).length} artisans disponibles
        </div>
        <h1>L'artisan qu'il vous faut,<br /><span>en quelques clics.</span></h1>
        <p>Trouvez des professionnels vérifiés près de chez vous — plombiers, électriciens, peintres et plus encore.</p>
      </div>

      {/* Categories */}
      <div className="cats">
        {CATEGORIES.map(c => (
          <button key={c.id} className={`cat-btn${category === c.id ? ' active' : ''}`}
            onClick={() => setCategory(c.id)}>
            <i className={`ti ${c.icon}`} />
            {c.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid-wrap">
        <div className="grid-hd">
          <div className="grid-title">
            {category === 'all' ? 'Tous les artisans' : category}
          </div>
          <span className="section-count">{filtered.length} résultat{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {loading ? (
          <div className="loading-grid">
            {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <i className="ti ti-search-off" />
            <h3>Aucun artisan trouvé</h3>
            <p>Essayez une autre catégorie.</p>
          </div>
        ) : (
          <div className="a-grid">
            {filtered.map(a => (
              <ArtisanCard key={a._id} artisan={a} user={user} setPage={setPage}
                onContact={setContactTarget} />
            ))}
          </div>
        )}
      </div>

      {/* CTA Banner */}
      {!user && (
        <div style={{padding:'0 28px 48px',maxWidth:1100,margin:'0 auto'}}>
          <div className="cta-banner">
            <div>
              <div className="cta-title">Vous êtes artisan ?</div>
              <div className="cta-sub">Rejoignez ServiceDZ et recevez des demandes dans votre région.</div>
            </div>
            <button className="cta-btn" onClick={() => setPage('register')}>
              Créer mon profil →
            </button>
          </div>
        </div>
      )}

      {/* Contact modal */}
      {contactTarget && (
        <ContactModal artisan={contactTarget}
          onClose={() => setContactTarget(null)}
          onSubmit={handleContactSubmit} />
      )}
    </>
  );
}
