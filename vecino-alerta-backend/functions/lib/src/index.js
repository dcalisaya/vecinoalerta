"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testSiren = exports.generateMonthlyReport = exports.getHeatmapData = exports.createSilentReport = exports.cancelEmergency = exports.triggerEmergency = void 0;
const https_1 = require("firebase-functions/v2/https");
const scheduler_1 = require("firebase-functions/v2/scheduler");
const admin = require("firebase-admin");
const axios_1 = require("axios"); // Kept for future use
admin.initializeApp();
const db = admin.firestore();
// --- Helpers ---
// v2 onCall passes a 'request' object which contains 'auth' and 'data'
const verifyUser = (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError("unauthenticated", "User must be logged in");
    }
    return request.auth;
};
// --- Functions ---
/**
 * Triggers the emergency alarm.
 * Activates the physical siren via API and notifies neighbors.
 */
exports.triggerEmergency = (0, https_1.onCall)(async (request) => {
    const auth = verifyUser(request);
    const data = request.data;
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
    // 2. Activate Siren (Placeholder)
    try {
        console.log("Axios would be used here:", axios_1.default.defaults.timeout);
        console.log("Siren activation signal sent (simulated)");
    }
    catch (error) {
        console.error("Failed to activate siren:", error);
    }
    return { success: true, incidentId: incidentRef.id };
});
/**
 * Cancels an active emergency.
 */
exports.cancelEmergency = (0, https_1.onCall)(async (request) => {
    const auth = verifyUser(request);
    const data = request.data;
    const { barrioId, incidentId } = data;
    console.log(`Emergency cancelled by ${auth.uid}`);
    // 1. Update Incident
    await db.doc(`barrios/${barrioId}/incidentes/${incidentId}`).update({
        resolved: true,
        resolvedBy: auth.uid,
        resolvedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    // 2. Deactivate Siren
    console.log("Siren deactivation signal sent (simulated)");
    return { success: true };
});
/**
 * Creates a silent report (no siren).
 */
exports.createSilentReport = (0, https_1.onCall)(async (request) => {
    const auth = verifyUser(request);
    const data = request.data;
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
exports.getHeatmapData = (0, https_1.onCall)(async (request) => {
    const auth = verifyUser(request);
    const data = request.data;
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
exports.generateMonthlyReport = (0, scheduler_1.onSchedule)("0 0 1 * *", async (event) => {
    console.log("Generating monthly reports for all barrios...");
    // Logic here
});
/**
 * Test function for SuperAdmin to test a siren in any barrio.
 */
exports.testSiren = (0, https_1.onCall)(async (request) => {
    const auth = verifyUser(request);
    const data = request.data;
    console.log(`Test siren requested by ${auth.uid}`);
    console.log(`Testing siren in barrio ${data.barrioId}`);
    return { success: true, message: "Test signal sent" };
});
//# sourceMappingURL=index.js.map