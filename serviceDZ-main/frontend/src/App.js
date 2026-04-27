import React from 'react'; // Ajoute cette ligne si elle manque
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ServiceDZHome from './components/ServiceDZHome';
import LoginPage from './components/LoginPage'; // Assure-toi que le fichier est dans le dossier components

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Route pour la page d'accueil */}
          <Route path="/" element={<ServiceDZHome />} />
          
          {/* Route pour la page de connexion */}
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;