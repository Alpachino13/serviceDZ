// src/hooks/useAuth.js
// Remplace useAuth0 — lit le JWT depuis localStorage (ton backend custom)

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// ─── Helpers localStorage ─────────────────────────────────────────────────────
export function getToken() {
  return localStorage.getItem("sdz_token");
}

export function getStoredUser() {
  try { return JSON.parse(localStorage.getItem("sdz_user")); }
  catch { return null; }
}

export function saveSession(token, user) {
  localStorage.setItem("sdz_token", token);
  localStorage.setItem("sdz_user", JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem("sdz_token");
  localStorage.removeItem("sdz_user");
}

// ─── Hook principal ───────────────────────────────────────────────────────────
// Même API que useAuth0 pour compatibilité :
//   isAuthenticated, isLoading, user, logout, loginWithRedirect
export function useAuth() {
  const [user, setUser]               = useState(getStoredUser);
  const [isLoading, setIsLoading]     = useState(false);
  const [isAuthenticated, setIsAuth]  = useState(() => !!getToken() && !!getStoredUser());
  const navigate = useNavigate();

  // Sync si localStorage change (autre onglet)
  useEffect(() => {
    const handleStorage = () => {
      const u = getStoredUser();
      const t = getToken();
      setUser(u);
      setIsAuth(!!t && !!u);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // loginWithRedirect → redirige vers /login
  // Accepte { authorizationParams: { screen_hint: "signup" } } comme Auth0
  const loginWithRedirect = useCallback((opts) => {
    const hint = opts?.authorizationParams?.screen_hint;
    navigate(hint === "signup" ? "/login?mode=register" : "/login");
  }, [navigate]);

  // logout → vide la session et redirige
  const logout = useCallback((opts) => {
    clearSession();
    setUser(null);
    setIsAuth(false);
    const returnTo = opts?.logoutParams?.returnTo || "/";
    window.location.href = returnTo;
  }, []);

  // Appelé après login/register réussi depuis LoginPage
  const setSession = useCallback((token, userData) => {
    saveSession(token, userData);
    setUser(userData);
    setIsAuth(true);
  }, []);

  return {
    isAuthenticated,
    isLoading,
    user,
    logout,
    loginWithRedirect,
    setSession,
    getToken,
  };
}
