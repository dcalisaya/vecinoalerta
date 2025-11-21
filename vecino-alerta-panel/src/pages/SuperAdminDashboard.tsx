import { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import { getGlobalMetrics, getBarrios, createBarrio, type Barrio } from '../services/db';

export default function SuperAdminDashboard() {
    const navigate = useNavigate();
    const [metrics, setMetrics] = useState({ totalBarrios: 0, totalIncidents: 0, activeSirens: 0 });
    const [barrios, setBarrios] = useState<Barrio[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [newBarrioName, setNewBarrioName] = useState('');
    const [newBarrioEmail, setNewBarrioEmail] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const m = await getGlobalMetrics();
        setMetrics(m);
        const b = await getBarrios();
        setBarrios(b);
    };

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/');
    };

    const handleCreateBarrio = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newBarrioName || !newBarrioEmail) return;
        try {
            await createBarrio(newBarrioName, newBarrioEmail);
            setShowModal(false);
            setNewBarrioName('');
            setNewBarrioEmail('');
            loadData(); // Refresh list
        } catch (error) {
            console.error("Error creating barrio:", error);
            alert("Error al crear barrio");
        }
    };

    return (
        <div className="min-h-screen bg-gray-900">
            <nav className="bg-gray-800 p-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">Panel SuperAdmin</h1>
                <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                >
                    Cerrar Sesión
                </button>
            </nav>
            <div className="p-8">
                {/* Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-gray-800 p-6 rounded-lg">
                        <h3 className="text-gray-400 text-sm">Total Barrios</h3>
                        <p className="text-3xl font-bold text-white">{metrics.totalBarrios}</p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-lg">
                        <h3 className="text-gray-400 text-sm">Incidentes (Total)</h3>
                        <p className="text-3xl font-bold text-white">{metrics.totalIncidents}</p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-lg">
                        <h3 className="text-gray-400 text-sm">Sirenas Activas</h3>
                        <p className="text-3xl font-bold text-white">{metrics.activeSirens}</p>
                    </div>
                </div>

                {/* Barrio Management */}
                <div className="bg-gray-800 p-6 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-white">Gestión de Barrios</h2>
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                        >
                            + Crear Nuevo Barrio
                        </button>
                    </div>

                    <div className="space-y-2">
                        {barrios.map(barrio => (
                            <div key={barrio.id} className="bg-gray-700 p-3 rounded text-white flex justify-between items-center">
                                <div>
                                    <span className="font-semibold">{barrio.name}</span>
                                    <span className="text-gray-400 text-sm ml-2">({barrio.adminEmail || 'Sin admin'})</span>
                                </div>
                                <button className="text-blue-400 hover:text-blue-300">Editar</button>
                            </div>
                        ))}
                        {barrios.length === 0 && <p className="text-gray-500">No hay barrios registrados.</p>}
                    </div>
                </div>
            </div>

            {/* Create Barrio Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
                        <h2 className="text-xl font-bold text-white mb-4">Crear Nuevo Barrio</h2>
                        <form onSubmit={handleCreateBarrio}>
                            <div className="mb-4">
                                <label className="block text-gray-400 mb-2">Nombre del Barrio</label>
                                <input
                                    type="text"
                                    value={newBarrioName}
                                    onChange={e => setNewBarrioName(e.target.value)}
                                    className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:border-blue-500 outline-none"
                                    placeholder="Ej. Barrio Las Flores"
                                    required
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-400 mb-2">Email del Administrador</label>
                                <input
                                    type="email"
                                    value={newBarrioEmail}
                                    onChange={e => setNewBarrioEmail(e.target.value)}
                                    className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:border-blue-500 outline-none"
                                    placeholder="admin@barrio.com"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-gray-300 hover:text-white"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                                >
                                    Crear
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
