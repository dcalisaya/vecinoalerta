import axios from "axios";

export class SirenService {
    private static readonly SIREN_API_URL = process.env.SIREN_API_URL || "https://api.mock-siren.com";
    private static readonly API_KEY = process.env.SIREN_API_KEY || "mock-key";

    /**
     * Activates the siren for a specific barrio.
     * @param barrioId The ID of the barrio to activate.
     */
    static async activate(barrioId: string): Promise<void> {
        try {
            console.log(`[SirenService] Activating siren for ${barrioId}...`);
            // In a real scenario, you might look up the specific device ID for the barrio
            // const deviceId = await getDeviceIdForBarrio(barrioId);

            await axios.post(`${this.SIREN_API_URL}/commands`, {
                barrioId,
                command: "ON",
                duration: 60 // seconds
            }, {
                headers: { "Authorization": `Bearer ${this.API_KEY}` },
                timeout: 5000
            });
            console.log(`[SirenService] Activation successful.`);
        } catch (error) {
            console.error(`[SirenService] Failed to activate siren:`, error);
            // We don't throw here to avoid failing the entire Cloud Function
            // But in production, you might want to alert an admin
        }
    }

    /**
     * Deactivates the siren.
     */
    static async deactivate(barrioId: string): Promise<void> {
        try {
            console.log(`[SirenService] Deactivating siren for ${barrioId}...`);
            await axios.post(`${this.SIREN_API_URL}/commands`, {
                barrioId,
                command: "OFF"
            }, {
                headers: { "Authorization": `Bearer ${this.API_KEY}` },
                timeout: 5000
            });
            console.log(`[SirenService] Deactivation successful.`);
        } catch (error) {
            console.error(`[SirenService] Failed to deactivate siren:`, error);
        }
    }
}
