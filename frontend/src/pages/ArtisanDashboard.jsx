import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, getStoredUser } from '../hooks/useAuth';

export default function ArtisanDashboard() {
  const navigate = useNavigate();
  const user = getStoredUser();

  return (
    <div className="dash-app">
      <nav className="dash-nav">
        <div style={{ fontFamily: 'Syne', fontWeight: '700', color: 'var(--primary)', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <i className="ti ti-arrow-left"></i> Accueil
        </div>
        <button onClick={logout} style={{ background: 'transparent', border: '1px solid var(--border)', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer' }}>Déconnexion</button>
      </nav>

      <div className="dash-content">
        <h1 style={{ fontFamily: 'Syne', fontSize: '32px', marginBottom: '8px' }}>Bonjour, {user?.name || 'Artisan'}</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Voici un résumé de votre activité.</p>

        {/* Métriques */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          <div className="dash-card">
            <h3 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>Missions terminées</h3>
            <div style={{ fontFamily: 'Syne', fontSize: '28px', fontWeight: '800' }}>142</div>
          </div>
          <div className="dash-card">
            <h3 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>Revenus (Mois)</h3>
            <div style={{ fontFamily: 'Syne', fontSize: '28px', fontWeight: '800', color: 'var(--primary)' }}>45 000 DA</div>
          </div>
        </div>

        {/* ========================================= */}
        {/* EMPLACEMENT POUR VOTRE COMPOSANT DE CHART */}
        {/* ========================================= */}
        <h2 style={{ fontFamily: 'Syne', fontSize: '22px', marginBottom: '16px' }}>Statistiques et Graphiques</h2>
        <div className="dash-card" style={{ minHeight: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border)', background: 'var(--sand)' }}>
          
          <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
             <i className="ti ti-chart-bar" style={{ fontSize: '32px', marginBottom: '8px' }}></i>
             <p>Intégrez votre composant graphique ici (Recharts, Chart.js, etc.)</p>
             {/* <MyCustomChartComponent data={data} /> */}
          </div>

        </div>
      </div>
    </div>
  );
}