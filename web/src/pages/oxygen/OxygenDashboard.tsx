import { useEffect, useState } from 'react';
import { getCylinders, createCylinder, logCylinderMovement, type OxygenCylinder } from '../../services/oxygenUtilityService';
import { Plus, Activity, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function OxygenDashboard() {
    const [cylinders, setCylinders] = useState<OxygenCylinder[]>([]);
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
            setStats({
                full: data.filter(c => c.status === 'FULL').length,
                empty: data.filter(c => c.status === 'EMPTY').length,
                inUse: data.filter(c => c.status === 'IN_USE').length
            });
        } catch (error) {
            toast.error('Failed to load cylinders');
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
        <div className="page">
            <div className="page-header">
                <div>
                    <p className="page-eyebrow">Oxygen Management</p>
                    <h1 className="page-title">Cylinder Tracking</h1>
                    <p className="page-subtitle">Monitor oxygen availability and log movements across departments.</p>
                </div>
                <button onClick={() => setShowModal(true)} className="btn-primary">
                    <Plus size={18} /> Register Cylinder
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="kpi-card">
                    <div>
                        <p className="kpi-label">Total Full</p>
                        <p className="kpi-value text-emerald-600">{stats.full}</p>
                    </div>
                    <div className="kpi-icon kpi-icon-emerald">
                        <ArrowUpCircle size={20} />
                    </div>
                </div>
                <div className="kpi-card">
                    <div>
                        <p className="kpi-label">In Use</p>
                        <p className="kpi-value text-sky-600">{stats.inUse}</p>
                    </div>
                    <div className="kpi-icon kpi-icon-sky">
                        <Activity size={20} />
                    </div>
                </div>
                <div className="kpi-card">
                    <div>
                        <p className="kpi-label">Empty</p>
                        <p className="kpi-value text-rose-600">{stats.empty}</p>
                    </div>
                    <div className="kpi-icon kpi-icon-rose">
                        <ArrowDownCircle size={20} />
                    </div>
                </div>
            </div>

            <div className="surface-card mt-6">
                <h2 className="section-title">Cylinder Inventory</h2>
                <p className="section-subtitle">Track location, status, and movement actions.</p>
                <div className="mt-4 overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Serial #</th>
                                <th>Size</th>
                                <th>Location</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cylinders.map(c => (
                                <tr key={c.id}>
                                    <td className="font-medium text-slate-800">{c.serialNumber}</td>
                                    <td className="text-slate-600">{c.size}</td>
                                    <td className="text-slate-600">{c.location}</td>
                                    <td>
                                        <span className={`chip ${c.status === 'FULL' ? 'chip-emerald' : c.status === 'IN_USE' ? 'chip-sky' : 'chip-rose'}`}>
                                            {c.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="space-x-2">
                                        {c.status === 'FULL' && (
                                            <button onClick={() => handleMove(c.id, 'ISSUED', 'Ward', 'IN_USE')} className="btn-secondary">Issue</button>
                                        )}
                                        {c.status === 'IN_USE' && (
                                            <button onClick={() => handleMove(c.id, 'RETURNED_EMPTY', 'Main Store', 'EMPTY')} className="btn-secondary">Empty</button>
                                        )}
                                        {c.status === 'EMPTY' && (
                                            <button onClick={() => handleMove(c.id, 'RECEIVED', 'Main Store', 'FULL')} className="btn-secondary">Refill</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2 className="text-xl font-semibold text-slate-800">New Cylinder</h2>
                        <form onSubmit={handleCreate} className="mt-4 space-y-4">
                            <input className="input" placeholder="Serial Number" required value={formData.serialNumber} onChange={e => setFormData({ ...formData, serialNumber: e.target.value })} />
                            <select className="input" value={formData.size} onChange={e => setFormData({ ...formData, size: e.target.value })}>
                                <option value="Jumbo">Jumbo (D-Type)</option>
                                <option value="Small">Small (B-Type)</option>
                            </select>
                            <input className="input" placeholder="Location" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                                <button type="submit" className="btn-primary">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
