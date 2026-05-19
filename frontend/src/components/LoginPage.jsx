import React, { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client');

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Simulation de connexion réussie
    localStorage.setItem('token', 'simulated-jwt-token-12345');
    localStorage.setItem('user', JSON.stringify({ 
      name: email.split('@')[0], 
      role: role 
    }));

    // Redirection propre qui recharge le contexte
    window.location.href = '/dashboard';
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--sand)' }}>
      <div className="dash-card" style={{ maxWidth: '420px', width: '100%' }}>
        <div style={{ fontFamily: 'Syne', fontSize: '24px', fontWeight: '800', color: 'var(--primary)', textAlign: 'center', marginBottom: '24px' }}>
          <i className="ti ti-tool"></i> Service<span style={{ color: 'var(--accent)' }}>DZ</span>
        </div>
        <h2 style={{ fontFamily: 'Syne', textAlign: 'center', marginBottom: '24px' }}>Connexion</h2>

        <div style={{ display: 'flex', background: 'var(--sand)', padding: '4px', borderRadius: '10px', marginBottom: '20px' }}>
          <button type="button" onClick={() => setRole('client')} style={{ flex: 1, border: 'none', padding: '10px', borderRadius: '7px', cursor: 'pointer', fontWeight: '600', background: role === 'client' ? 'var(--card)' : 'transparent', color: role === 'client' ? 'var(--primary)' : 'var(--text-muted)' }}>Client</button>
          <button type="button" onClick={() => setRole('artisan')} style={{ flex: 1, border: 'none', padding: '10px', borderRadius: '7px', cursor: 'pointer', fontWeight: '600', background: role === 'artisan' ? 'var(--card)' : 'transparent', color: role === 'artisan' ? 'var(--primary)' : 'var(--text-muted)' }}>Artisan</button>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-mid)', display: 'block', marginBottom: '6px' }}>Email</label>
            <input type="email" required style={{ width: '100%', padding: '11px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'var(--sand)' }} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-mid)', display: 'block', marginBottom: '6px' }}>Mot de passe</label>
            <input type="password" required style={{ width: '100%', padding: '11px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'var(--sand)' }} onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', marginTop: '8px' }}>
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}