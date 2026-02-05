import { useEffect, useState } from 'react';
import { getCylinders, createCylinder, logCylinderMovement, type OxygenCylinder } from '../../services/oxygenUtilityService';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function OxygenDashboard() {
    const [cylinders, setCylinders] = useState<OxygenCylinder[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ full: 0, empty: 0, inUse: 0 });
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ serialNumber: '', size: 'Jumbo', location: 'Main Store' });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await getCylinders();
            setCylinders(data);
            // Calculate Stats
            setStats({
                full: data.filter(c => c.status === 'FULL').length,
                empty: data.filter(c => c.status === 'EMPTY').length,
                inUse: data.filter(c => c.status === 'IN_USE').length,
            });
        } catch (error) {
            toast.error('Failed to load cylinders');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createCylinder(formData);
            toast.success('Cylinder Registered');
            setShowModal(false);
            loadData();
            setFormData({ serialNumber: '', size: 'Jumbo', location: 'Main Store' });
        } catch (error) {
            toast.error('Failed to create cylinder');
        }
    };

    const handleMove = async (id: string, action: string, newLocation: string, newStatus: string) => {
        try {
            await logCylinderMovement(id, action, newLocation, newStatus);
            toast.success('Movement Logged');
            loadData();
        } catch (error) {
            toast.error('Failed to log movement');
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Oxygen Management</h1>
                <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                    <Plus size={18} /> Register Cylinder
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                    <div className="text-green-600 font-medium mb-2">Total Full</div>
                    <div className="text-3xl font-bold text-green-700">{stats.full}</div>
                </div>
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                    <div className="text-blue-600 font-medium mb-2">In Use (Wards)</div>
                    <div className="text-3xl font-bold text-blue-700">{stats.inUse}</div>
                </div>
                <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                    <div className="text-red-600 font-medium mb-2">Empty (Needs Refill)</div>
                    <div className="text-3xl font-bold text-red-700">{stats.empty}</div>
                </div>
            </div>

            {/* Cylinder List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">Serial #</th>
                            <th className="p-4 font-semibold text-gray-600">Size</th>
                            <th className="p-4 font-semibold text-gray-600">Location</th>
                            <th className="p-4 font-semibold text-gray-600">Status</th>
                            <th className="p-4 font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cylinders.map(c => (
                            <tr key={c.id} className="border-b hover:bg-gray-50">
                                <td className="p-4 font-medium">{c.serialNumber}</td>
                                <td className="p-4 text-gray-600">{c.size}</td>
                                <td className="p-4 text-gray-600">{c.location}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${c.status === 'FULL' ? 'bg-green-100 text-green-700' :
                                        c.status === 'IN_USE' ? 'bg-blue-100 text-blue-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                        {c.status}
                                    </span>
                                </td>
                                <td className="p-4 flex gap-2">
                                    {c.status === 'FULL' && (
                                        <button onClick={() => handleMove(c.id, 'ISSUED', 'Ward', 'IN_USE')} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded border border-blue-200">
                                            Issue
                                        </button>
                                    )}
                                    {c.status === 'IN_USE' && (
                                        <button onClick={() => handleMove(c.id, 'RETURNED_EMPTY', 'Main Store', 'EMPTY')} className="text-xs bg-orange-50 text-orange-600 px-2 py-1 rounded border border-orange-200">
                                            Empty
                                        </button>
                                    )}
                                    {c.status === 'EMPTY' && (
                                        <button onClick={() => handleMove(c.id, 'RECEIVED', 'Main Store', 'FULL')} className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded border border-green-200">
                                            Refill
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal - Basic Implementation */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-xl font-bold mb-4">New Cylinder</h2>
                        <form onSubmit={handleCreate}>
                            <input className="w-full border p-2 rounded mb-4" placeholder="Serial Number" required value={formData.serialNumber} onChange={e => setFormData({ ...formData, serialNumber: e.target.value })} />
                            <select className="w-full border p-2 rounded mb-4" value={formData.size} onChange={e => setFormData({ ...formData, size: e.target.value })}>
                                <option value="Jumbo">Jumbo (D-Type)</option>
                                <option value="Small">Small (B-Type)</option>
                            </select>
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
