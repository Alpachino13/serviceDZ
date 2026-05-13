const express = require('express');
const mongoose = require('mongoose');
const Redis = require('ioredis');
const cors = require('cors');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('./models/User'); 

const app = express();

// ============================================
// 1. CONFIGURATION
// ============================================
const PORT = process.env.PORT || 5000; // ⚠️ Changé de 3000 à 5000 (ton docker-compose utilise 5000)
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://servicedz:password@servicedz-mongodb:27017/servicedz?authSource=admin';
const REDIS_URL = process.env.REDIS_URL;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// ============================================
// 2. MIDDLEWARES
// ============================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS avec options
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

// Logging middleware (optionnel mais utile)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ============================================
// 3. CONNEXION MONGODB
// ============================================
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB Connecté avec succès"))
  .catch(err => {
    console.error("❌ Erreur de connexion MongoDB:", err.message);
    // Ne pas crasher le serveur, juste logger l'erreur
  });

// Gérer les événements MongoDB
mongoose.connection.on('disconnected', () => {
  console.warn("⚠️ MongoDB déconnecté");
});

mongoose.connection.on('reconnected', () => {
  console.log("🔄 MongoDB reconnecté");
});

// ============================================
// 4. CONNEXION REDIS (UPSTASH)
// ============================================
let redis = null;

if (REDIS_URL) {
  redis = new Redis(REDIS_URL, {
    tls: { 
      rejectUnauthorized: true // ✅ Changé à true pour plus de sécurité
    },
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => {
      if (times > 3) {
        console.error("❌ Redis: Trop de tentatives de reconnexion");
        return null; // Arrêter les tentatives
      }
      const delay = Math.min(times * 200, 2000);
      console.log(`🔄 Redis: Reconnexion dans ${delay}ms...`);
      return delay;
    },
    enableReadyCheck: true,
    lazyConnect: false
  });

  redis.on('connect', () => console.log("✅ Upstash Redis Connecté"));
  redis.on('ready', () => console.log("✅ Redis prêt à recevoir des commandes"));
  redis.on('error', (err) => console.error("❌ Erreur Redis:", err.message));
  redis.on('close', () => console.warn("⚠️ Connexion Redis fermée"));
  redis.on('reconnecting', () => console.log("🔄 Redis reconnexion en cours..."));
} else {
  console.warn("⚠️ REDIS_URL non défini - Redis désactivé");
}

// Helper function pour utiliser Redis en toute sécurité
async function redisGet(key) {
  if (!redis) return null;
  try {
    return await redis.get(key);
  } catch (error) {
    console.error(`Erreur Redis GET ${key}:`, error.message);
    return null;
  }
}

async function redisSet(key, value, expirySeconds = null) {
  if (!redis) return false;
  try {
    if (expirySeconds) {
      await redis.setex(key, expirySeconds, value);
    } else {
      await redis.set(key, value);
    }
    return true;
  } catch (error) {
    console.error(`Erreur Redis SET ${key}:`, error.message);
    return false;
  }
}

// ============================================
// 5. ROUTES
// ============================================

// Route de santé (Health Check)
app.get('/health', (req, res) => {
  res.json({ 
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Route de Statut (plus détaillée)
app.get('/status', async (req, res) => {
  const mongoStatus = mongoose.connection.readyState === 1 ? "Connectée ✅" : "Déconnectée ❌";
  
  let redisStatus = "Non configuré";
  if (redis) {
    try {
      const pong = await redis.ping();
      redisStatus = pong === 'PONG' ? "Connecté ✅" : "Déconnecté ❌";
    } catch (error) {
      redisStatus = "Erreur ❌";
    }
  }

  res.json({ 
    status: "En ligne 🚀",
    services: {
      mongodb: mongoStatus,
      redis: redisStatus
    },
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// ============================================
// 6. ROUTE D'INSCRIPTION (Améliorée)
// ============================================
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const user = new User({
      name,
      email: email.toLowerCase().trim(),
      password, // Le hachage est géré par le middleware pre-save dans ton modèle User
      role: role || 'worker'
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: "Compte créé avec succès ! 🇩🇿",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token
    });

  } catch (err) {
    console.error("❌ Erreur Register:", err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        error: "Données invalides", 
        details: Object.values(err.errors).map(e => e.message) 
      });
    }
    res.status(500).json({ error: "Une erreur est survenue lors de la création du compte" });
  }
});

// ============================================
// 7. ROUTE DE CONNEXION (LOGIN)
// ============================================
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email et mot de passe requis" });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

    // Comparaison robuste (on force en String pour éviter les bugs de types)
    const isPasswordValid = await bcrypt.compare(String(password), user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

    // Génération du token JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Mettre en cache la session dans Redis (si redis est connecté)
    if (typeof redis !== 'undefined' && redis) {
      await redis.set(
        `session:${user._id}`,
        JSON.stringify({ lastLogin: new Date() }),
        'EX', 604800
      );
    }

    res.json({
      message: "Connexion réussie ! 🎉",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token
    });

  } catch (err) {
    console.error("❌ Erreur Login:", err);
    res.status(500).json({ error: "Erreur lors de la connexion" });
  }
});

// ============================================
// 8. MIDDLEWARE D'AUTHENTIFICATION (pour routes protégées)
// ============================================
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // "Bearer TOKEN"
    
    if (!token) {
      return res.status(401).json({ error: "Token manquant" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Ajouter les infos user à la requête
    next();

  } catch (err) {
    return res.status(401).json({ error: "Token invalide ou expiré" });
  }
};

// Exemple de route protégée
app.get('/api/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ============================================
// 9. GESTION DES ERREURS 404
// ============================================
app.use((req, res) => {
  res.status(404).json({ 
    error: "Route non trouvée",
    path: req.path 
  });
});

// ============================================
// 10. GESTION DES ERREURS GLOBALES
// ============================================
app.use((err, req, res, next) => {
  console.error("❌ Erreur non gérée:", err);
  res.status(500).json({ 
    error: "Erreur interne du serveur",
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ============================================
// 11. DÉMARRAGE DU SERVEUR
// ============================================
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔════════════════════════════════════════╗
║   🚀 ServiceDZ API Server Started     ║
╠════════════════════════════════════════╣
║  Port:        ${PORT}                      ║
║  Environment: ${process.env.NODE_ENV || 'development'}         ║
║  MongoDB:     ${MONGO_URI ? '✅' : '❌'}                      ║
║  Redis:       ${REDIS_URL ? '✅' : '❌'}                      ║
╚════════════════════════════════════════╝
  `);
});

// ============================================
// 12. GESTION DE L'ARRÊT GRACIEUX
// ============================================
// ============================================
// 12. GESTION DE L'ARRÊT GRACIEUX
// ============================================

const gracefulShutdown = async (signal) => {
  console.log(`\n⚠️ ${signal} reçu, arrêt en cours...`);
  
  try {
    if (typeof redis !== 'undefined' && redis) {
      await redis.quit();
      console.log('✅ Redis déconnecté');
    }
    
    await mongoose.connection.close();
    console.log('✅ MongoDB déconnecté');
    
    console.log('👋 Bye bye!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur pendant la fermeture:', err);
    process.exit(1);
  }
};

// Écoute des signaux d'arrêt
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
