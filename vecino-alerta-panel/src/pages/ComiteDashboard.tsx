import { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import { getRecentIncidents, type Incident } from '../services/db';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function ComiteDashboard() {
    const navigate = useNavigate();
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [loading, setLoading] = useState(true);
    const [barrioId, setBarrioId] = useState<string | null>(null);

    useEffect(() => {
        // In a real app, we'd get the user's assigned barrio from their profile/claims
        // For demo, we'll hardcode or fetch the first one available, or check claims
        // Let's assume the user has a claim or we just use a test ID for now if not found
        const fetchData = async () => {
            try {
                // const token = await auth.currentUser?.getIdTokenResult();
                // const bid = token?.claims.barrioId as string || 'test_barrio_1';
                const bid = 'test_barrio_1'; // Hardcoded for MVP/Demo flow
                setBarrioId(bid);

                const data = await getRecentIncidents(bid, 50);
                setIncidents(data);
            } catch (error) {
                console.error("Error fetching incidents:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/');
    };

    // Prepare data for heatmap (ScatterChart)
    // Mapping lat/lng to X/Y. 
    // Note: Lat/Lng are small numbers, might need scaling for better visualization if not using a map
    const heatmapData = incidents.map(inc => ({
        x: inc.location.lng,
        y: inc.location.lat,
        type: inc.type,
        id: inc.id
    }));

    return (
        <div className="min-h-screen bg-gray-900">
            <nav className="bg-gray-800 p-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">Panel del Comité {barrioId && `- ${barrioId}`}</h1>
                <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                >
                    Cerrar Sesión
                </button>
            </nav>
            <div className="p-8">
                {loading ? (
                    <div className="text-white">Cargando datos...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Heatmap Section */}
                        <div className="bg-gray-800 p-6 rounded-lg">
                            <h2 className="text-xl font-bold text-white mb-4">Mapa de Incidentes (Scatter)</h2>
                            <div className="bg-gray-700 h-80 rounded flex items-center justify-center text-gray-400 p-2">
                                {heatmapData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis type="number" dataKey="x" name="Longitude" domain={['auto', 'auto']} />
                                            <YAxis type="number" dataKey="y" name="Latitude" domain={['auto', 'auto']} />
                                            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                            <Scatter name="Incidentes" data={heatmapData} fill="#8884d8">
                                                {heatmapData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.type === 'EMERGENCY' ? '#ef4444' : '#fbbf24'} />
                                                ))}
                                            </Scatter>
                                        </ScatterChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <p>No hay datos para mostrar</p>
                                )}
                            </div>
                            <p className="text-xs text-gray-400 mt-2">* Rojo: Emergencia, Amarillo: Reporte Silencioso</p>
                        </div>

                        {/* Recent Alerts List */}
                        <div className="bg-gray-800 p-6 rounded-lg">
                            <h2 className="text-xl font-bold text-white mb-4">Alertas Recientes</h2>
                            <div className="space-y-2 max-h-80 overflow-y-auto">
                                {incidents.length === 0 && <p className="text-gray-400">No hay alertas recientes.</p>}
                                {incidents.map((incident) => (
                                    <div key={incident.id} className="bg-gray-700 p-3 rounded text-white border-l-4 border-l-red-500">
                                        <div className="flex justify-between">
                                            <p className="font-semibold">{incident.type === 'EMERGENCY' ? '🚨 EMERGENCIA' : '⚠️ REPORTE'}</p>
                                            <span className="text-xs bg-gray-600 px-2 py-1 rounded">
                                                {incident.timestamp?.toDate().toLocaleTimeString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-300 mt-1">
                                            {incident.details || 'Sin detalles'}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">ID: {incident.id}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
