// Ensure these imports are at the very top of ServiceDZ.jsx
import { useState, useEffect, useRef } from "react";
import { getStoredUser, getToken } from "../hooks/useAuth";
import { authAPI } from "../api"; // Your connection to server.js
import ClientDashboard from "../pages/ClientDashboard";
import ArtisanDashboard from "../pages/ArtisanDashboard";
import LoginPage from "./LoginPage";
import RoleSelection from "../pages/RoleSelection";
import ArtisanProfile from "../pages/ArtisanProfile";
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@500;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');`;

const CSS = `
* { box-sizing: border-box; margin: 0; padding: 0; }
.sdz-app {
  font-family: 'DM Sans', system-ui, sans-serif;
  background: #F5F2EC;
  color: #1C1C1A;
  min-height: 100vh;
}
:root {
  --primary: #0C5E47;
  --primary-mid: #1A7A5E;
  --primary-light: #E6F5F0;
  --accent: #D4572A;
  --accent-light: #FAF0EB;
  --sand: #F5F2EC;
  --sand-dark: #EBE7DF;
  --card: #FFFFFF;
  --text: #1C1C1A;
  --text-mid: #4A4A45;
  --text-muted: #8A8A82;
  --border: #E2DDD5;
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* NAV */
.sdz-nav {
  position: sticky; top: 0; z-index: 50;
  background: rgba(245,242,236,0.92);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  height: 60px;
  display: flex; align-items: center;
  padding: 0 28px;
  gap: 16px;
}
.sdz-logo {
  font-family: 'Syne', sans-serif;
  font-size: 19px; font-weight: 800;
  color: var(--primary);
  letter-spacing: -0.5px;
  white-space: nowrap;
  display: flex; align-items: center; gap: 8px;
}
.sdz-logo-dot { color: var(--accent); }
.sdz-search-wrap {
  flex: 1; max-width: 420px;
  position: relative;
}
.sdz-search-wrap i {
  position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
  font-size: 16px; color: var(--text-muted); pointer-events: none;
}
.sdz-search {
  width: 100%;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 0 14px 0 38px;
  height: 38px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px; color: var(--text);
  outline: none;
  transition: border-color 180ms, box-shadow 180ms;
}
.sdz-search:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(12,94,71,0.1); }
.sdz-nav-actions { display: flex; align-items: center; gap: 10px; margin-left: auto; }

/* NOTIF BELL */
.sdz-notif-btn {
  position: relative; width: 38px; height: 38px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--card);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  color: var(--text-mid);
  transition: background 150ms, border-color 150ms, transform 120ms;
  font-size: 18px;
}
.sdz-notif-btn:hover { background: var(--primary-light); border-color: var(--primary); color: var(--primary); }
.sdz-notif-btn:active { transform: scale(0.95); }
.sdz-badge {
  position: absolute; top: -5px; right: -5px;
  background: var(--accent); color: white;
  font-size: 10px; font-weight: 700;
  min-width: 18px; height: 18px;
  border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
  padding: 0 4px;
  border: 2px solid var(--sand);
  font-family: 'DM Sans', sans-serif;
  animation: badge-pop 0.3s var(--ease-spring);
}
@keyframes badge-pop { from { transform: scale(0); } to { transform: scale(1); } }

/* AVATAR */
.sdz-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-mid), var(--primary));
  display: flex; align-items: center; justify-content: center;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px; font-weight: 600; color: white;
  cursor: pointer;
  border: 2px solid var(--primary-light);
}

/* HERO */
.sdz-hero {
  padding: 52px 28px 40px;
  max-width: 760px; margin: 0 auto;
  text-align: center;
}
.sdz-hero-eyebrow {
  display: inline-flex; align-items: center; gap: 6px;
  background: var(--primary-light);
  color: var(--primary);
  font-size: 12px; font-weight: 600;
  padding: 4px 12px; border-radius: 20px;
  margin-bottom: 18px;
  letter-spacing: 0.3px;
}
.sdz-hero h1 {
  font-family: 'Syne', sans-serif;
  font-size: 42px; font-weight: 800;
  line-height: 1.1; letter-spacing: -1px;
  color: var(--text);
  margin-bottom: 14px;
}
.sdz-hero h1 span { color: var(--primary); }
.sdz-hero p { font-size: 16px; color: var(--text-muted); line-height: 1.6; margin-bottom: 32px; }

/* CATEGORIES */
.sdz-cats {
  display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;
  padding: 0 28px 36px;
}
.sdz-cat {
  display: flex; align-items: center; gap: 7px;
  padding: 9px 18px;
  border-radius: 100px;
  border: 1.5px solid var(--border);
  background: var(--card);
  font-family: 'DM Sans', sans-serif;
  font-size: 13.5px; font-weight: 500;
  color: var(--text-mid);
  cursor: pointer;
  transition: all 180ms var(--ease-out);
}
.sdz-cat:hover { border-color: var(--primary); color: var(--primary); background: var(--primary-light); }
.sdz-cat.active {
  background: var(--primary); border-color: var(--primary);
  color: white;
}
.sdz-cat i { font-size: 16px; }

/* GRID */
.sdz-grid-wrap { padding: 0 28px 60px; max-width: 1120px; margin: 0 auto; }
.sdz-grid-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 20px;
}
.sdz-grid-title {
  font-family: 'Syne', sans-serif;
  font-size: 18px; font-weight: 700; color: var(--text);
}
.sdz-count {
  font-size: 13px; color: var(--text-muted);
  background: var(--sand-dark);
  padding: 3px 10px; border-radius: 20px;
}
.sdz-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(288px, 1fr));
  gap: 16px;
}

/* ARTISAN CARD */
.sdz-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 22px;
  transition: border-color 200ms, transform 200ms var(--ease-out), box-shadow 200ms;
  animation: card-in 0.35s var(--ease-out) both;
  cursor: default;
}
.sdz-card:hover {
  border-color: #C8C3BA;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.07);
}
@keyframes card-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
.sdz-card:nth-child(1) { animation-delay: 0ms; }
.sdz-card:nth-child(2) { animation-delay: 40ms; }
.sdz-card:nth-child(3) { animation-delay: 80ms; }
.sdz-card:nth-child(4) { animation-delay: 120ms; }
.sdz-card:nth-child(5) { animation-delay: 160ms; }
.sdz-card:nth-child(6) { animation-delay: 200ms; }

.sdz-card-top { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 16px; }
.sdz-card-avatar {
  width: 52px; height: 52px; border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Syne', sans-serif;
  font-size: 18px; font-weight: 700; color: white;
  flex-shrink: 0;
}
.sdz-card-info { flex: 1; }
.sdz-card-name {
  font-family: 'Syne', sans-serif;
  font-size: 15px; font-weight: 700; color: var(--text);
  margin-bottom: 3px;
}
.sdz-card-meta { font-size: 13px; color: var(--text-muted); display: flex; align-items: center; gap: 5px; }
.sdz-card-badges { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 14px; }
.sdz-pill {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 11.5px; font-weight: 600; padding: 3px 10px;
  border-radius: 20px; letter-spacing: 0.2px;
}
.sdz-pill-cat { background: var(--primary-light); color: var(--primary); }
.sdz-pill-avail { background: #EAF5E6; color: #2A6B1A; }
.sdz-pill-busy { background: #FAF0EB; color: #9A3515; }
.sdz-stars { display: flex; align-items: center; gap: 3px; }
.sdz-star { color: #D4A017; font-size: 13px; }
.sdz-rating-text { font-size: 12px; color: var(--text-muted); margin-left: 4px; }
.sdz-card-divider { border: none; border-top: 1px solid var(--border); margin: 14px 0; }
.sdz-card-stats { display: flex; gap: 20px; margin-bottom: 16px; }
.sdz-stat-item { text-align: center; }
.sdz-stat-val { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; color: var(--text); }
.sdz-stat-label { font-size: 11px; color: var(--text-muted); }
.sdz-card-actions { display: flex; gap: 8px; }
.sdz-btn-contact {
  flex: 1; height: 40px;
  background: var(--primary);
  color: white; border: none;
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px; font-weight: 600;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 7px;
  transition: background 150ms, transform 120ms;
}
.sdz-btn-contact:hover { background: var(--primary-mid); }
.sdz-btn-contact:active { transform: scale(0.97); }
.sdz-btn-profile {
  width: 40px; height: 40px;
  border: 1.5px solid var(--border);
  border-radius: 10px;
  background: transparent;
  color: var(--text-mid); font-size: 16px;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 150ms;
}
.sdz-btn-profile:hover { border-color: var(--primary); color: var(--primary); background: var(--primary-light); }

/* NOTIFICATION PANEL */
.sdz-notif-overlay {
  position: fixed; inset: 0; z-index: 80;
  background: rgba(28,28,26,0.18);
  animation: fade-in 200ms var(--ease-out);
}
.sdz-notif-panel {
  position: fixed; top: 0; right: 0; bottom: 0;
  width: 360px; z-index: 81;
  background: var(--card);
  border-left: 1px solid var(--border);
  display: flex; flex-direction: column;
  animation: slide-in-right 250ms var(--ease-out);
  overflow: hidden;
}
@keyframes slide-in-right { from { transform: translateX(100%); } to { transform: translateX(0); } }
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
.sdz-notif-header {
  padding: 20px 20px 16px;
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between;
}
.sdz-notif-title {
  font-family: 'Syne', sans-serif;
  font-size: 16px; font-weight: 700; color: var(--text);
  display: flex; align-items: center; gap: 10px;
}
.sdz-notif-close {
  width: 32px; height: 32px; border-radius: 8px;
  border: 1px solid var(--border); background: transparent;
  color: var(--text-muted); cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: 17px;
  transition: background 150ms;
}
.sdz-notif-close:hover { background: var(--sand-dark); color: var(--text); }
.sdz-notif-list { flex: 1; overflow-y: auto; padding: 10px 0; }
.sdz-notif-item {
  display: flex; align-items: flex-start; gap: 12px;
  padding: 14px 20px;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  transition: background 150ms;
  animation: notif-item-in 0.3s var(--ease-out) both;
}
@keyframes notif-item-in { from { opacity: 0; transform: translateX(16px); } to { opacity: 1; transform: translateX(0); } }
.sdz-notif-item:hover { background: var(--sand); }
.sdz-notif-item.unread { background: rgba(12,94,71,0.04); }
.sdz-notif-icon {
  width: 36px; height: 36px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; flex-shrink: 0; margin-top: 1px;
}
.sdz-notif-icon.type-demande { background: var(--primary-light); color: var(--primary); }
.sdz-notif-icon.type-message { background: #EEF0FA; color: #3B4CBF; }
.sdz-notif-icon.type-status { background: #EAF5E6; color: #2A6B1A; }
.sdz-notif-icon.type-review { background: #FFF8E8; color: #9A7012; }
.sdz-notif-content { flex: 1; }
.sdz-notif-ntitle { font-size: 13.5px; font-weight: 600; color: var(--text); margin-bottom: 2px; line-height: 1.4; }
.sdz-notif-ndesc { font-size: 12.5px; color: var(--text-muted); line-height: 1.4; }
.sdz-notif-time { font-size: 11px; color: var(--text-muted); margin-top: 4px; }
.sdz-notif-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--primary); flex-shrink: 0; margin-top: 6px; }
.sdz-notif-empty { padding: 40px 20px; text-align: center; color: var(--text-muted); font-size: 14px; }
.sdz-notif-actions {
  padding: 14px 20px;
  border-top: 1px solid var(--border);
  display: flex; gap: 8px;
}
.sdz-btn-mark-read {
  flex: 1; height: 36px;
  background: var(--primary-light); color: var(--primary);
  border: none; border-radius: 8px;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px; font-weight: 600;
  cursor: pointer;
  transition: background 150ms;
}
.sdz-btn-mark-read:hover { background: #D0EDE6; }

/* CONTACT MODAL */
.sdz-modal-overlay {
  position: fixed; inset: 0; z-index: 90;
  background: rgba(28,28,26,0.5);
  display: flex; align-items: flex-end; justify-content: center;
  animation: fade-in 200ms var(--ease-out);
  padding-bottom: 0;
}
@media (min-width: 640px) {
  .sdz-modal-overlay { align-items: center; padding: 24px; }
}
.sdz-modal {
  background: var(--card);
  border-radius: 20px 20px 0 0;
  width: 100%; max-width: 520px;
  max-height: 92vh; overflow-y: auto;
  animation: slide-up 300ms var(--ease-out);
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
@media (min-width: 640px) {
  .sdz-modal { border-radius: 20px; max-height: 86vh; }
}
@keyframes slide-up { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
.sdz-modal-header {
  padding: 22px 24px 16px;
  border-bottom: 1px solid var(--border);
  display: flex; align-items: flex-start; gap: 14px;
}
.sdz-modal-avatar {
  width: 46px; height: 46px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Syne', sans-serif;
  font-size: 17px; font-weight: 700; color: white; flex-shrink: 0;
}
.sdz-modal-info { flex: 1; }
.sdz-modal-pretitle { font-size: 12px; color: var(--text-muted); margin-bottom: 3px; }
.sdz-modal-name {
  font-family: 'Syne', sans-serif;
  font-size: 17px; font-weight: 700; color: var(--text);
}
.sdz-modal-cat { font-size: 13px; color: var(--text-muted); margin-top: 2px; display: flex; align-items: center; gap: 5px; }
.sdz-modal-close-btn {
  width: 32px; height: 32px; border-radius: 8px;
  border: 1px solid var(--border); background: transparent;
  color: var(--text-muted); cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; flex-shrink: 0;
  transition: background 150ms;
}
.sdz-modal-close-btn:hover { background: var(--sand-dark); color: var(--text); }
.sdz-modal-body { padding: 24px; }
.sdz-field { margin-bottom: 18px; }
.sdz-label {
  display: block; font-size: 13px; font-weight: 600;
  color: var(--text-mid); margin-bottom: 8px;
}
.sdz-label span { color: var(--accent); margin-left: 2px; }
.sdz-input, .sdz-textarea, .sdz-select {
  width: 100%;
  background: var(--sand);
  border: 1.5px solid var(--border);
  border-radius: 10px;
  padding: 11px 14px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px; color: var(--text);
  outline: none;
  transition: border-color 180ms, background 180ms;
}
.sdz-input:focus, .sdz-textarea:focus, .sdz-select:focus {
  border-color: var(--primary);
  background: white;
}
.sdz-textarea { resize: vertical; min-height: 90px; line-height: 1.5; }
.sdz-urgency-group { display: flex; gap: 10px; }
.sdz-urgency-opt {
  flex: 1; padding: 10px 14px;
  border: 1.5px solid var(--border);
  border-radius: 10px;
  cursor: pointer;
  display: flex; align-items: center; gap: 9px;
  transition: all 160ms;
  background: var(--sand);
}
.sdz-urgency-opt.selected { border-color: var(--primary); background: var(--primary-light); }
.sdz-urgency-opt.selected.urgent { border-color: var(--accent); background: var(--accent-light); }
.sdz-urgency-opt i { font-size: 18px; }
.sdz-urgency-opt .opt-label { font-size: 13px; font-weight: 600; color: var(--text-mid); }
.sdz-urgency-opt.selected .opt-label { color: var(--primary); }
.sdz-urgency-opt.selected.urgent .opt-label { color: var(--accent); }
.sdz-modal-footer {
  padding: 16px 24px 24px;
  border-top: 1px solid var(--border);
  display: flex; gap: 10px;
}
.sdz-btn-cancel {
  flex: 0; padding: 0 20px; height: 44px;
  border: 1.5px solid var(--border);
  border-radius: 11px; background: transparent;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px; font-weight: 600;
  color: var(--text-mid); cursor: pointer;
  transition: background 150ms;
  white-space: nowrap;
}
.sdz-btn-cancel:hover { background: var(--sand-dark); }
.sdz-btn-submit {
  flex: 1; height: 44px;
  background: var(--primary); color: white;
  border: none; border-radius: 11px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14.5px; font-weight: 600;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  transition: background 150ms, transform 120ms;
}
.sdz-btn-submit:hover { background: var(--primary-mid); }
.sdz-btn-submit:active { transform: scale(0.98); }
.sdz-btn-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
.sdz-spinner {
  width: 18px; height: 18px;
  border: 2.5px solid rgba(255,255,255,0.35);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* TOAST */
.sdz-toast {
  position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%);
  z-index: 100;
  background: #1C1C1A; color: white;
  padding: 13px 20px;
  border-radius: 14px;
  display: flex; align-items: center; gap: 12px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px; font-weight: 500;
  white-space: nowrap;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
  animation: toast-in 0.35s var(--ease-spring) both;
}
@keyframes toast-in { from { opacity: 0; transform: translateX(-50%) translateY(20px) scale(0.95); } to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); } }
.sdz-toast-icon {
  width: 24px; height: 24px; border-radius: 50%;
  background: #2A8A5E;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; flex-shrink: 0;
}

/* EMPTY STATE */
.sdz-empty {
  text-align: center; padding: 60px 20px;
  color: var(--text-muted);
}
.sdz-empty i { font-size: 40px; margin-bottom: 12px; display: block; opacity: 0.4; }
.sdz-empty h3 { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; color: var(--text-mid); margin-bottom: 6px; }
`;

const ARTISANS = [
  { id: 1, name: "Khaled Bouras", initials: "KB", category: "Plomberie", region: "Tlemcen", rating: 4.9, reviews: 142, missions: 218, available: true, years: 12, color: "#0C5E47" },
  { id: 2, name: "Amine Ziani", initials: "AZ", category: "Électricité", region: "Tlemcen", rating: 4.8, reviews: 98, missions: 176, available: true, years: 9, color: "#185FA5" },
  { id: 3, name: "Rachid Benmoussa", initials: "RB", category: "Peinture", region: "Mansourah", rating: 4.7, reviews: 73, missions: 134, available: false, years: 7, color: "#9A3515" },
  { id: 4, name: "Sofiane Hadj", initials: "SH", category: "Maçonnerie", region: "Tlemcen", rating: 4.6, reviews: 61, missions: 109, available: true, years: 14, color: "#6B3FA0" },
  { id: 5, name: "Yacine Khelil", initials: "YK", category: "Plomberie", region: "Chetouane", rating: 4.8, reviews: 87, missions: 152, available: true, years: 6, color: "#0C5E47" },
  { id: 6, name: "Billal Tahar", initials: "BT", category: "Électricité", region: "Tlemcen", rating: 4.5, reviews: 54, missions: 91, available: false, years: 4, color: "#185FA5" },
];

const CATEGORIES = [
  { id: "all", label: "Tous", icon: "ti-layout-grid" },
  { id: "Plomberie", label: "Plomberie", icon: "ti-droplet" },
  { id: "Électricité", label: "Électricité", icon: "ti-bolt" },
  { id: "Peinture", label: "Peinture", icon: "ti-brush" },
  { id: "Maçonnerie", label: "Maçonnerie", icon: "ti-home-2" },
];

const INIT_NOTIFS = [
  { id: 1, type: "status", title: "Intervention terminée", desc: "Khaled Bouras a marqué votre mission comme complétée.", time: "Il y a 1h", unread: true },
  { id: 2, type: "review", title: "Nouvel avis reçu", desc: "Un client vous a laissé 5 étoiles — Excellent travail !", time: "Il y a 3h", unread: true },
  { id: 3, type: "message", title: "Message de Amine Ziani", desc: "Bonjour, je serai disponible demain à partir de 9h00.", time: "Hier", unread: false },
  { id: 4, type: "demande", title: "Demande acceptée", desc: "Sofiane Hadj a accepté votre demande d'intervention.", time: "Il y a 2 jours", unread: false },
];

function Stars({ rating }) {
  return (
    <div className="sdz-stars">
      {[1,2,3,4,5].map(i => (
        <span key={i} className="sdz-star">
          {i <= Math.floor(rating) ? "★" : i - 0.5 <= rating ? "⯨" : "☆"}
        </span>
      ))}
      <span className="sdz-rating-text">{rating} ({ARTISANS.find(a => a.rating === rating)?.reviews || "—"})</span>
    </div>
  );
}

function ArtisanCard({ artisan, onContact }) {
  return (
    <div className="sdz-card">
      <div className="sdz-card-top">
        <div className="sdz-card-avatar" style={{ background: artisan.color }}>
          {artisan.initials}
        </div>
        <div className="sdz-card-info">
          <div className="sdz-card-name">{artisan.name}</div>
          <div className="sdz-card-meta">
            <i className="ti ti-map-pin" style={{ fontSize: 13 }}></i>
            {artisan.region}
          </div>
          <div style={{ marginTop: 7 }}>
            {[1,2,3,4,5].map(i => (
              <span key={i} style={{ color: i <= Math.floor(artisan.rating) ? "#D4A017" : "#DDD8CE", fontSize: 12 }}>★</span>
            ))}
            <span style={{ fontSize: 12, color: "var(--text-muted)", marginLeft: 4 }}>
              {artisan.rating} · {artisan.reviews} avis
            </span>
          </div>
        </div>
      </div>

      <div className="sdz-card-badges">
        <span className="sdz-pill sdz-pill-cat">
          <i className="ti ti-briefcase" style={{ fontSize: 11 }}></i>
          {artisan.category}
        </span>
        <span className={`sdz-pill ${artisan.available ? "sdz-pill-avail" : "sdz-pill-busy"}`}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: artisan.available ? "#2A6B1A" : "#9A3515", display: "inline-block" }}></span>
          {artisan.available ? "Disponible" : "Occupé"}
        </span>
      </div>

      <hr className="sdz-card-divider" />

      <div className="sdz-card-stats">
        <div className="sdz-stat-item">
          <div className="sdz-stat-val">{artisan.missions}</div>
          <div className="sdz-stat-label">Missions</div>
        </div>
        <div className="sdz-stat-item">
          <div className="sdz-stat-val">{artisan.years} ans</div>
          <div className="sdz-stat-label">Expérience</div>
        </div>
        <div className="sdz-stat-item">
          <div className="sdz-stat-val">{artisan.rating}</div>
          <div className="sdz-stat-label">Note /5</div>
        </div>
      </div>

      <div className="sdz-card-actions">
        <button className="sdz-btn-contact" onClick={() => onContact(artisan)}>
          <i className="ti ti-send" style={{ fontSize: 15 }}></i>
          Contacter
        </button>
        
        {/* 👇 Add the onClick right here! 👇 */}
        <button 
          className="sdz-btn-profile" 
          title="Voir le profil"
          onClick={() => onViewProfile(artisan._id || artisan.id)}
        >
          <i className="ti ti-user" style={{ fontSize: 16 }}></i>
        </button>
      </div>
    </div>
  );
}

function ContactModal({ artisan, onClose, onSubmit }) {
  const [form, setForm] = useState({ name: "", phone: "", description: "", date: "", urgency: "normal" });
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = true;
    if (!form.phone.trim()) e.phone = true;
    if (!form.description.trim()) e.description = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSend = async () => {
    if (!validate()) return;
    setSending(true);
    await new Promise(r => setTimeout(r, 1400));
    setSending(false);
    onSubmit({ artisan, ...form });
  };

  return (
    <div className="sdz-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="sdz-modal">
        <div className="sdz-modal-header">
          <div className="sdz-modal-avatar" style={{ background: artisan.color }}>
            {artisan.initials}
          </div>
          <div className="sdz-modal-info">
            <div className="sdz-modal-pretitle">Demande d'intervention</div>
            <div className="sdz-modal-name">{artisan.name}</div>
            <div className="sdz-modal-cat">
              <i className="ti ti-briefcase" style={{ fontSize: 12 }}></i>
              {artisan.category} · {artisan.region}
            </div>
          </div>
          <button className="sdz-modal-close-btn" onClick={onClose}>
            <i className="ti ti-x"></i>
          </button>
        </div>

        <div className="sdz-modal-body">
          <div className="sdz-field">
            <label className="sdz-label">Votre nom<span>*</span></label>
            <input
              className="sdz-input"
              style={errors.name ? { borderColor: "var(--accent)" } : {}}
              placeholder="Ex : Mohammed Benziane"
              value={form.name}
              onChange={e => set("name", e.target.value)}
            />
          </div>
          <div className="sdz-field">
            <label className="sdz-label">Numéro de téléphone<span>*</span></label>
            <input
              className="sdz-input"
              style={errors.phone ? { borderColor: "var(--accent)" } : {}}
              placeholder="Ex : 05 XX XX XX XX"
              value={form.phone}
              onChange={e => set("phone", e.target.value)}
            />
          </div>
          <div className="sdz-field">
            <label className="sdz-label">Description du problème<span>*</span></label>
            <textarea
              className="sdz-textarea"
              style={errors.description ? { borderColor: "var(--accent)" } : {}}
              placeholder="Décrivez votre problème en détail (fuite d'eau, panne électrique, peinture…)"
              value={form.description}
              onChange={e => set("description", e.target.value)}
            />
          </div>
          <div className="sdz-field">
            <label className="sdz-label">Date souhaitée</label>
            <input
              className="sdz-input"
              type="date"
              value={form.date}
              onChange={e => set("date", e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div className="sdz-field">
            <label className="sdz-label">Niveau d'urgence</label>
            <div className="sdz-urgency-group">
              <div
                className={`sdz-urgency-opt${form.urgency === "normal" ? " selected" : ""}`}
                onClick={() => set("urgency", "normal")}
              >
                <i className="ti ti-clock" style={{ fontSize: 20, color: form.urgency === "normal" ? "var(--primary)" : "var(--text-muted)" }}></i>
                <div>
                  <div className="opt-label">Normal</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Sous 72h</div>
                </div>
              </div>
              <div
                className={`sdz-urgency-opt urgent${form.urgency === "urgent" ? " selected urgent" : ""}`}
                onClick={() => set("urgency", "urgent")}
              >
                <i className="ti ti-flame" style={{ fontSize: 20, color: form.urgency === "urgent" ? "var(--accent)" : "var(--text-muted)" }}></i>
                <div>
                  <div className="opt-label">Urgent</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Aujourd'hui</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sdz-modal-footer">
          <button className="sdz-btn-cancel" onClick={onClose}>Annuler</button>
          <button className="sdz-btn-submit" onClick={handleSend} disabled={sending}>
            {sending ? (
              <><div className="sdz-spinner"></div> Envoi en cours…</>
            ) : (
              <><i className="ti ti-send" style={{ fontSize: 16 }}></i> Envoyer la demande</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function NotifPanel({ notifs, onClose, onMarkAllRead }) {
  const icons = { demande: "ti-tool", message: "ti-message-circle", status: "ti-circle-check", review: "ti-star" };
  const unreadCount = notifs.filter(n => n.unread).length;

  return (
    <>
      <div className="sdz-notif-overlay" onClick={onClose} />
      <div className="sdz-notif-panel">
        <div className="sdz-notif-header">
          <div className="sdz-notif-title">
            Notifications
            {unreadCount > 0 && (
              <span style={{ background: "var(--accent)", color: "white", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>
                {unreadCount}
              </span>
            )}
          </div>
          <button className="sdz-notif-close" onClick={onClose}>
            <i className="ti ti-x"></i>
          </button>
        </div>

        <div className="sdz-notif-list">
          {notifs.length === 0 ? (
            <div className="sdz-notif-empty">
              <i className="ti ti-bell-off" style={{ fontSize: 36, display: "block", marginBottom: 10, opacity: 0.3 }}></i>
              Aucune notification
            </div>
          ) : notifs.map((n, i) => (
            <div key={n.id} className={`sdz-notif-item${n.unread ? " unread" : ""}`} style={{ animationDelay: `${i * 40}ms` }}>
              <div className={`sdz-notif-icon type-${n.type}`}>
                <i className={`ti ${icons[n.type]}`}></i>
              </div>
              <div className="sdz-notif-content">
                <div className="sdz-notif-ntitle">{n.title}</div>
                <div className="sdz-notif-ndesc">{n.desc}</div>
                <div className="sdz-notif-time">{n.time}</div>
              </div>
              {n.unread && <div className="sdz-notif-dot"></div>}
            </div>
          ))}
        </div>

        {unreadCount > 0 && (
          <div className="sdz-notif-actions">
            <button className="sdz-btn-mark-read" onClick={onMarkAllRead}>
              <i className="ti ti-checks" style={{ marginRight: 6, fontSize: 15, verticalAlign: -2 }}></i>
              Tout marquer comme lu
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function Toast({ message, type }) {
  return (
    <div className="sdz-toast">
      <div className="sdz-toast-icon">
        <i className="ti ti-check" style={{ fontSize: 13, color: "white" }}></i>
      </div>
      {message}
    </div>
  );
}

export default function ServiceDZ() {
  const [notifs, setNotifs] = useState(INIT_NOTIFS);
  const [showNotif, setShowNotif] = useState(false);
  const [contactArtisan, setContactArtisan] = useState(null);
  const [toast, setToast] = useState(null);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const toastTimer = useRef(null);
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'client-dashboard', 'artisan-dashboard', 'login'
  const [viewingProfileId, setViewingProfileId] = useState(null);
  const unread = notifs.filter(n => n.unread).length;


  const filtered = ARTISANS.filter(a => {
    const matchCat = category === "all" || a.category === category;
    const q = search.toLowerCase();
    const matchSearch = !q || a.name.toLowerCase().includes(q) || a.category.toLowerCase().includes(q) || a.region.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });
  
  

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = ({ artisan, name, urgency }) => {
    const newNotif = {
      id: Date.now(),
      type: "demande",
      title: `Nouvelle demande reçue${urgency === "urgent" ? " 🔴" : ""}`,
      desc: `${name} vous a envoyé une demande d'intervention en ${artisan.category}.`,
      time: "À l'instant",
      unread: true,
    };
    setNotifs(prev => [newNotif, ...prev]);
    setContactArtisan(null);
    showToast(`Demande envoyée à ${artisan.name} avec succès !`);
  };

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, unread: false })));
  
  const handleAvatarClick = async () => {
    const token = getToken();
    const localUser = getStoredUser();

    // Fallback 1: Not signed in? Route to login panel seamlessly
    if (!token) {
      setCurrentPage('login');
      return;
    }

    try {
      // Optional: Ask server.js directly if session is fresh
      // const freshUser = await authAPI.me();
      // const userRole = freshUser.role;

      // Fast role resolution from your active local user session
      const userRole = localUser?.role;

      if (userRole === 'artisan') {
        setCurrentPage('artisan-dashboard');
      } else if (userRole === 'client') {
        setCurrentPage('client-dashboard');
      } else {
        // Safe check if user registers but hasn't picked a role yet
        setCurrentPage('role-selection');
      }
    } catch (error) {
      console.error("Backend validation rejected session. Re-authenticating...", error);
      setCurrentPage('login');
    }
  };
  const handleViewProfile = (id) => {
    setViewingProfileId(id);
    setCurrentPage('artisan-profile');
  };

  return (
    <>
      <style>{FONTS}</style>
      <style>{CSS}</style>
      <div className="sdz-app">
        {/* NAV */}
        <nav className="sdz-nav">
          <div className="sdz-logo">
            <i className="ti ti-tool" style={{ fontSize: 20 }}></i>
            Service<span className="sdz-logo-dot">DZ</span>
          </div>

          <div className="sdz-search-wrap">
            <i className="ti ti-search"></i>
            <input
              className="sdz-search"
              placeholder="Rechercher un artisan, métier, ville…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="sdz-nav-actions">
            <button
              className="sdz-notif-btn"
              onClick={() => setShowNotif(s => !s)}
              aria-label={`Notifications${unread > 0 ? ` (${unread} non lues)` : ""}`}
            >
              <i className="ti ti-bell" style={{ fontSize: 19 }}></i>
              {unread > 0 && <span className="sdz-badge">{unread}</span>}
            </button>
            <div
  className="sdz-avatar"
  onClick={handleAvatarClick}
  style={{ cursor: 'pointer' }}
  title="Mon Espace"
  >
  {/* Dynamically generates initials from the server's session record if logged in */}
  {getStoredUser() ?
    getStoredUser().name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) 
    : "YM"
  }
</div>
          </div>
        </nav>

        {/* HERO */}
        <div className="sdz-hero">
          <div className="sdz-hero-eyebrow">
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#2A8A5E", display: "inline-block" }}></span>
            Tlemcen · {ARTISANS.filter(a => a.available).length} artisans disponibles maintenant
          </div>
          <h1>L'artisan qu'il vous faut,<br /><span>en quelques clics.</span></h1>
          <p>Trouvez des professionnels vérifiés près de chez vous — plombiers, électriciens, peintres et plus encore.</p>
        </div>

        {/* CATEGORIES */}
        <div className="sdz-cats">
          {CATEGORIES.map(c => (
            <button
              key={c.id}
              className={`sdz-cat${category === c.id ? " active" : ""}`}
              onClick={() => setCategory(c.id)}
            >
              <i className={`ti ${c.icon}`}></i>
              {c.label}
            </button>
          ))}
        </div>

{/* Inside your main layout container under the header/nav bar */}
<div className="sdz-main-content">

  {/* 1. HOME LANDING PAGE VIEW */}
{/* 1. HOME LANDING PAGE VIEW */}
        {currentPage === 'home' && (
          <>
            {/* HERO */}
            <div className="sdz-hero">
              <div className="sdz-hero-eyebrow">
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#2A8A5E", display: "inline-block" }}></span>
                Tlemcen · {ARTISANS.filter(a => a.available).length} artisans disponibles maintenant
              </div>
              <h1>L'artisan qu'il vous faut,<br /><span>en quelques clics.</span></h1>
              <p>Trouvez des professionnels vérifiés près de chez vous — plombiers, électriciens, peintres et plus encore.</p>
            </div>

            {/* CATEGORIES */}
            <div className="sdz-cats">
              {CATEGORIES.map(c => (
                <button
                  key={c.id}
                  className={`sdz-cat${category === c.id ? " active" : ""}`}
                  onClick={() => setCategory(c.id)}
                >
                  <i className={`ti ${c.icon}`}></i>
                  {c.label}
                </button>
              ))}
            </div>

            {/* GRID */}
            <div className="sdz-grid-wrap">
              <div className="sdz-grid-header">
                <div className="sdz-grid-title">
                  {category === "all" ? "Tous les artisans" : category}
                </div>
                <span className="sdz-count">{filtered.length} résultat{filtered.length !== 1 ? "s" : ""}</span>
              </div>

              {filtered.length === 0 ? (
                <div className="sdz-empty">
                  <i className="ti ti-search-off"></i>
                  <h3>Aucun artisan trouvé</h3>
                  <p>Essayez de modifier votre recherche ou catégorie.</p>
                </div>
              ) : (
                <div className="sdz-grid">
                  {filtered.map(a => (
                    <ArtisanCard 
                      key={a.id} 
                      artisan={a} 
                      onContact={setContactArtisan}
                      onViewProfile={(id) => {
                        setViewingProfileId(id);
                        setCurrentPage('artisan-profile');
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

 {/* 2. CLIENT DASHBOARD VIEW */}
        {currentPage === 'client-dashboard' && (
          <ClientDashboard 
            user={getStoredUser()} 
            setPage={setCurrentPage} 
          />
        )}

        {/* 3. ARTISAN DASHBOARD VIEW */}
        {currentPage === 'artisan-dashboard' && (
          <ArtisanDashboard 
            user={getStoredUser()} 
            setPage={setCurrentPage} 
          />
        )}

        {/* 4. LOGIN PAGE VIEW */}
        {currentPage === 'login' && (
          <LoginPage 
            onAuth={(user) => {
              // When login succeeds, immediately run the avatar click logic 
              // to figure out which dashboard to send them to!
              handleAvatarClick(); 
            }} 
            initTab="login"
          />
        )}

        {/* 5. ROLE SELECTION VIEW */}
        {currentPage === 'role-selection' && (
          <RoleSelection 
            onRoleConfirmed={() => handleAvatarClick()} 
          />
        )}
  
  {/* 6. ARTISAN PROFILE VIEW */}
        {currentPage === 'artisan-profile' && (
          <ArtisanProfile 
            id={viewingProfileId} 
            setPage={setCurrentPage} 
          />
        )}

</div>
        {/* NOTIFICATION PANEL */}
        {showNotif && (
          <NotifPanel
            notifs={notifs}
            onClose={() => setShowNotif(false)}
            onMarkAllRead={markAllRead}
          />
        )}

        {/* CONTACT MODAL */}
        {contactArtisan && (
          <ContactModal
            artisan={contactArtisan}
            onClose={() => setContactArtisan(null)}
            onSubmit={handleSubmit}
          />
        )}

        {/* TOAST */}
        {toast && <Toast message={toast} />}
      </div>
    </>
  );
}
