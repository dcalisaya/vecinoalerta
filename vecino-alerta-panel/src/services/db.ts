import { collection, getDocs, addDoc, query, orderBy, limit, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

export interface Barrio {
    id: string;
    name: string;
    adminEmail?: string;
}

export interface Incident {
    id: string;
    type: string;
    subType?: string;
    details?: string;
    uid: string;
    location: { lat: number; lng: number };
    timestamp: Timestamp;
    resolved: boolean;
}

// --- Barrios ---

export const getBarrios = async (): Promise<Barrio[]> => {
    const snapshot = await getDocs(collection(db, 'barrios'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Barrio));
};

export const createBarrio = async (name: string, adminEmail: string) => {
    await addDoc(collection(db, 'barrios'), {
        name,
        adminEmail,
        createdAt: Timestamp.now()
    });
};

// --- Incidents ---

export const getRecentIncidents = async (barrioId: string, limitCount = 10): Promise<Incident[]> => {
    const q = query(
        collection(db, `barrios/${barrioId}/incidentes`),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Incident));
};

export const getAllIncidents = async (barrioId: string): Promise<Incident[]> => {
    const snapshot = await getDocs(collection(db, `barrios/${barrioId}/incidentes`));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Incident));
};

// --- Metrics ---

export const getGlobalMetrics = async () => {
    // Note: For large datasets, use aggregation queries or counters. 
    // For now, client-side counting is acceptable for MVP.
    const barrios = await getBarrios();

    // This is expensive, in production use Cloud Functions to aggregate stats
    // For MVP/Demo, we'll just return mock or partial real data
    // Or fetch all incidents if dataset is small.

    return {
        totalBarrios: barrios.length,
        totalIncidents: 0, // Placeholder to avoid too many reads
        activeSirens: 0
    };
};
