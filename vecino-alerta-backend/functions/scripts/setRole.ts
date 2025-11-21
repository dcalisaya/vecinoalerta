import * as admin from 'firebase-admin';

// Initialize Admin SDK
// Ensure you have GOOGLE_APPLICATION_CREDENTIALS set or run this locally with `firebase functions:shell` context if possible, 
// or simpler: use a service account key.
// For this script, we'll assume it's run in an environment where admin can initialize (e.g. locally with key or via functions shell).

// Try to load service account, fallback to default credentials
let serviceAccount;
try {
    serviceAccount = require('../../serviceAccountKey.json');
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
} catch (e) {
    console.log('⚠️  serviceAccountKey.json not found. Trying Application Default Credentials...');
    admin.initializeApp();
}

async function setRole(email: string, role: 'superadmin' | 'comite', barrioId?: string) {
    try {
        const user = await admin.auth().getUserByEmail(email);
        const claims: any = { role };
        if (barrioId) claims.barrioId = barrioId;

        await admin.auth().setCustomUserClaims(user.uid, claims);
        console.log(`✅ Success! User ${email} is now a ${role}.`);
        if (barrioId) console.log(`   Barrio ID: ${barrioId}`);
    } catch (error) {
        console.error('❌ Error setting role:', error);
    }
}

// Usage: ts-node setRole.ts <email> <role> [barrioId]
const args = process.argv.slice(2);
if (args.length < 2) {
    console.log('Usage: ts-node setRole.ts <email> <role> [barrioId]');
    process.exit(1);
}

setRole(args[0], args[1] as any, args[2]);
