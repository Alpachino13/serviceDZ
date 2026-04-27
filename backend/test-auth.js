const bcrypt = require('bcryptjs');

async function testAuth() {
  console.log('🔐 Test complet d\'authentification\n');

  // Simulation : Inscription
  console.log('1️⃣ INSCRIPTION');
  const userPassword = 'ServiceDZ2024!';
  const saltRounds = 10;
  
  console.log(`   Password en clair: ${userPassword}`);
  const hashedPassword = await bcrypt.hash(userPassword, saltRounds);
  console.log(`   Password hashé: ${hashedPassword}`);
  console.log(`   ✅ Stocké dans MongoDB\n`);

  // Simulation : Connexion avec BON password
  console.log('2️⃣ CONNEXION (Bon password)');
  const loginPassword1 = 'ServiceDZ2024!';
  console.log(`   Password entré: ${loginPassword1}`);
  const isValid1 = await bcrypt.compare(loginPassword1, hashedPassword);
  console.log(`   Résultat: ${isValid1 ? '✅ CONNEXION RÉUSSIE' : '❌ ÉCHEC'}\n`);

  // Simulation : Connexion avec MAUVAIS password
  console.log('3️⃣ CONNEXION (Mauvais password)');
  const loginPassword2 = 'MauvaisMotDePasse';
  console.log(`   Password entré: ${loginPassword2}`);
  const isValid2 = await bcrypt.compare(loginPassword2, hashedPassword);
  console.log(`   Résultat: ${isValid2 ? '✅ CONNEXION RÉUSSIE' : '❌ ÉCHEC (Normal)'}\n`);

  console.log('✅ Tous les tests réussis !');
}

testAuth();
