// ─── ServiceDZ API Client ────────────────────────────────────────────────────
// Reads REACT_APP_API_URL from your .env.local / Vercel dashboard
// e.g.  REACT_APP_API_URL=http://100.y.y.y:5000

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  };
  const res = await fetch(`${BASE}${endpoint}`, config);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Erreur ${res.status}`);
  }
  return res.json();
}

const get  = (url, o)    => request(url, { ...o, method: 'GET' });
const post = (url, d, o) => request(url, { ...o, method: 'POST',  body: JSON.stringify(d) });
const put  = (url, d, o) => request(url, { ...o, method: 'PUT',   body: JSON.stringify(d) });
const del  = (url, o)    => request(url, { ...o, method: 'DELETE' });

// ── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  login:    (email, password) => post('/api/login',    { email, password }),
  register: (data)            => post('/api/register', data),
  me:       ()                => get('/api/users/me'),
};

// ── Workers / Artisans ────────────────────────────────────────────────────────
export const workersAPI = {
  list:   (params = {}) => get('/api/users/workers?' + new URLSearchParams(params)),
  getById:(id)          => get(`/api/users/workers/${id}`),
  update: (id, data)    => put(`/api/users/${id}`, data),
};

// ── Repairs / Missions ────────────────────────────────────────────────────────
export const repairsAPI = {
  create:     (data) => post('/api/repairs', data),
  list:       ()     => get('/api/repairs'),
  getById:    (id)   => get(`/api/repairs/${id}`),
  updateStatus:(id, status) => put(`/api/repairs/${id}`, { status }),
  myRepairs:  ()     => get('/api/repairs/mine'),        // client side
  myMissions: ()     => get('/api/repairs/artisan'),     // artisan side
};

// ── Search ────────────────────────────────────────────────────────────────────
export const searchAPI = {
  query: (params) => get('/api/recherche?' + new URLSearchParams(params)),
};

// ── Health ────────────────────────────────────────────────────────────────────
export const health = () => get('/api/health');
