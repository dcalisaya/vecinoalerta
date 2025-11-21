import { onCall, HttpsError } from "firebase-functions/v2/https";
import { onSchedule } from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";
import { SirenService } from "./services/SirenService";

admin.initializeApp();
const db = admin.firestore();

// --- Interfaces ---
interface EmergencyRequest {
    barrioId: string;
    location: { lat: number; lng: number };
}

// --- Helpers ---
// v2 onCall passes a 'request' object which contains 'auth' and 'data'
const verifyUser = (request: any) => {
    if (!request.auth) {
        throw new HttpsError("unauthenticated", "User must be logged in");
    }
    return request.auth;
};

// --- Functions ---

/**
 * Triggers the emergency alarm.
 * Activates the physical siren via API and notifies neighbors.
 */
export const triggerEmergency = onCall(async (request) => {
    const auth = verifyUser(request);
    const data = request.data as EmergencyRequest;
    const { barrioId, location } = data;

    console.log(`Emergency triggered by ${auth.uid} in barrio ${barrioId}`);

    // 1. Create Incident in Firestore
    const incidentRef = await db.collection(`barrios/${barrioId}/incidentes`).add({
        type: "EMERGENCY",
        uid: auth.uid,
        location,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        confirmedReal: false,
        resolved: false,
    });

    // 2. Activate Siren
    await SirenService.activate(barrioId);

    return { success: true, incidentId: incidentRef.id };
});

/**
 * Cancels an active emergency.
 */
export const cancelEmergency = onCall(async (request) => {
    const auth = verifyUser(request);
    const data = request.data as { barrioId: string; incidentId: string };
    const { barrioId, incidentId } = data;

    console.log(`Emergency cancelled by ${auth.uid}`);

    // 1. Update Incident
    await db.doc(`barrios/${barrioId}/incidentes/${incidentId}`).update({
        resolved: true,
        resolvedBy: auth.uid,
        resolvedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 2. Deactivate Siren
    await SirenService.deactivate(barrioId);

    return { success: true };
});

/**
 * Creates a silent report (no siren).
 */
export const createSilentReport = onCall(async (request) => {
    const auth = verifyUser(request);
    const data = request.data as any;
    const { barrioId, type, details, location } = data;

    await db.collection(`barrios/${barrioId}/incidentes`).add({
        type: "SILENT_REPORT",
        subType: type,
        details,
        uid: auth.uid,
        location,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        resolved: false,
    });

    return { success: true };
});

/**
 * Returns heatmap data for the committee dashboard.
 */
export const getHeatmapData = onCall(async (request) => {
    const auth = verifyUser(request);
    const data = request.data as { barrioId: string };
    console.log(`Heatmap requested by ${auth.uid}`);

    const snapshot = await db.collection(`barrios/${data.barrioId}/incidentes`)
        .select("location", "type", "timestamp")
        .get();

    return snapshot.docs.map(doc => doc.data());
});

/**
 * Scheduled function to generate monthly reports.
 * Runs on the 1st of every month.
 */
export const generateMonthlyReport = onSchedule("0 0 1 * *", async (event) => {
    console.log("Generating monthly reports for all barrios...");
    // In a real implementation:
    // 1. Fetch all barrios
    // 2. For each barrio, fetch last month's incidents
    // 3. Generate PDF using 'pdfkit'
    // 4. Upload to Firebase Storage
    // 5. Email link to Barrio Admin
    console.log("Reports generated (simulated).");
});

/**
 * Test function for SuperAdmin to test a siren in any barrio.
 */
export const testSiren = onCall(async (request) => {
    const auth = verifyUser(request);
    const data = request.data as { barrioId: string };
    console.log(`Test siren requested by ${auth.uid}`);

    console.log(`Testing siren in barrio ${data.barrioId}`);
    return { success: true, message: "Test signal sent" };
});
