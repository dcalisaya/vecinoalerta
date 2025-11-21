/**
 * Script para asignar custom claims (role, barrioId) a un usuario de Firebase Auth.
 *
 * Uso:
 *   export GOOGLE_APPLICATION_CREDENTIALS="/ruta/a/.secrets/serviceAccount.json"
 *   cd vecino-alerta-backend/functions
 *   node scripts/set-claims.js user@example.com comite barrio123
 */
const fs = require('fs');
const admin = require('firebase-admin');

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error('Falta GOOGLE_APPLICATION_CREDENTIALS apuntando al service account');
  process.exit(1);
}

const [email, role, barrioId] = process.argv.slice(2);

if (!email || !role || !barrioId) {
  console.error('Uso: node scripts/set-claims.js <email> <role> <barrioId>');
  process.exit(1);
}

// Carga projectId explícito para evitar el error de configuración.
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
let projectId = 'vecinoalerta-2e0de';
try {
  const svc = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
  projectId = svc.project_id || projectId;
} catch (err) {
  console.warn('No se pudo leer project_id del service account, usando valor por defecto:', projectId);
}

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId,
});

async function main() {
  try {
    const user = await admin.auth().getUserByEmail(email);
    const currentClaims = user.customClaims || {};
    const newClaims = { ...currentClaims, role, barrioId };
    await admin.auth().setCustomUserClaims(user.uid, newClaims);
    console.log(`Claims actualizados para ${email}:`, newClaims);
  } catch (err) {
    console.error('Error asignando claims:', err.message);
    process.exit(1);
  }
}

main();
