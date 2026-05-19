import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, getStoredUser } from "../hooks/useAuth";

// ... (Conservez vos variables FONTS, CSS, ARTISANS, CATEGORIES, INIT_NOTIFS, Stars, ArtisanCard, ContactModal, NotifPanel, Toast ici exactement comme dans votre code d'origine) ...
// Pour la concision de cette réponse, insérez le bloc de données et de composants (ArtisanCard, etc.) ici.

export default function ServiceDZ() {
  const navigate = useNavigate();
  const token = getToken();
  const user = getStoredUser();

  const [notifs, setNotifs] = useState([]); // Remplacer par INIT_NOTIFS si désiré
  const [showNotif, setShowNotif] = useState(false);
  const [contactArtisan, setContactArtisan] = useState(null);
  const [toast, setToast] = useState(null);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");

  const handleProfileClick = () => {
    if (!token || !user) {
      navigate("/login");
    } else {
      navigate("/dashboard");
    }
  };

  // Reste de votre logique (filtered, handleSubmit, etc.)...
  
  return (
    <div className="sdz-app">
      {/* Reste de votre JSX d'origine pour la NavBar, le Héro, la Grille... */}
      
      {/* Remplacez simplement la div sdz-avatar par ceci dans votre NavBar : */}
      <div className="sdz-nav-actions">
          {token && user ? (
            <div className="sdz-avatar" onClick={handleProfileClick} style={{ cursor: "pointer" }} title="Mon Tableau de Bord">
              {user.name ? user.name.substring(0, 2).toUpperCase() : "DZ"}
            </div>
          ) : (
            <button 
              onClick={() => navigate("/login")}
              style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
            >
              Connexion
            </button>
          )}
      </div>
      
      {/* ... */}
    </div>
  );
}