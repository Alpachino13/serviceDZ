import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, getStoredUser } from '../hooks/useAuth';

export default function ClientDashboard() {
  const navigate = useNavigate();
  const user = getStoredUser();

  return (
    <div className="dash-app">
      <nav className="dash-nav">
        <div style={{ fontFamily: 'Syne', fontWeight: '700', color: 'var(--primary)', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <i className="ti ti-arrow-left"></i> Chercher un artisan
        </div>
        <button onClick={logout} style={{ background: 'transparent', border: '1px solid var(--border)', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer' }}>Déconnexion</button>
      </nav>

      <div className="dash-content">
        <h1 style={{ fontFamily: 'Syne', fontSize: '32px', marginBottom: '8px' }}>Espace Client</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Bienvenue {user?.name}. Gérez vos demandes d'intervention.</p>

        <div className="dash-card" style={{ marginBottom: '32px' }}>
          <h3 style={{ fontFamily: 'Syne', marginBottom: '12px' }}>Demande en cours</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--sand)', borderRadius: '10px' }}>
            <div>
              <strong>Réparation Fuite d'eau</strong>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Plomberie - Khaled Bouras</div>
            </div>
            <span style={{ background: '#EAF5E6', color: '#2A6B1A', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>Confirmé</span>
          </div>
        </div>

        {/* ========================================= */}
        {/* EMPLACEMENT POUR VOTRE COMPOSANT DE CHART */}
        {/* ========================================= */}
        <h2 style={{ fontFamily: 'Syne', fontSize: '22px', marginBottom: '16px' }}>Historique des dépenses</h2>
        <div className="dash-card" style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border)' }}>
          
          <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
             <i className="ti ti-chart-pie" style={{ fontSize: '32px', marginBottom: '8px' }}></i>
             <p>Placez votre composant graphique des dépenses ici</p>
             {/* <MyClientExpenseChart /> */}
          </div>

        </div>
      </div>
    </div>
  );
}