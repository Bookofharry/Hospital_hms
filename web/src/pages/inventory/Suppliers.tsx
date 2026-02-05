import { useEffect, useState } from 'react';
import { getSuppliers, type Supplier } from '../../services/inventoryService';
import { demoStore } from '../../data/demoStore';
import toast from 'react-hot-toast';

export default function Suppliers() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });

    useEffect(() => {
        loadSuppliers();
    }, []);

    const loadSuppliers = async () => {
        try {
            const data = await getSuppliers();
            setSuppliers(data);
        } catch {
            toast.error('Failed to load suppliers');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await demoStore.addSupplier(formData);
            toast.success('Supplier Created');
            setShowModal(false);
            loadSuppliers();
            setFormData({ name: '', email: '', phone: '', address: '' });
        } catch {
            toast.error('Failed to create supplier');
        }
    };

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <p className="page-eyebrow">Inventory</p>
                    <h1 className="page-title">Suppliers</h1>
                    <p className="page-subtitle">Vendors that keep inventory flowing across departments.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn-primary"
                >
                    + Add Supplier
                </button>
            </div>

            {loading ? (
                <div className="empty-state">Loading suppliers...</div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {suppliers.map(sup => (
                        <div key={sup.id} className="surface-card surface-card-hover">
                            <h3 className="card-title">{sup.name}</h3>
                            <div className="text-sm text-slate-600 mt-3 space-y-1">
                                {sup.email && <p>📧 {sup.email}</p>}
                                {sup.phone && <p>📞 {sup.phone}</p>}
                            </div>
                            <div className="mt-4 text-xs text-slate-500">
                                Primary vendor for consumables and parts.
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2 className="text-xl font-semibold text-slate-800">Add Supplier</h2>
                        <form onSubmit={handleCreate} className="mt-4 space-y-4">
                            <div>
                                <label className="label">Name</label>
                                <input
                                    className="input"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="label">Email</label>
                                <input
                                    className="input"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="label">Phone</label>
                                <input
                                    className="input"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="label">Address</label>
                                <input
                                    className="input"
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-2">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                                <button type="submit" className="btn-primary flex-1">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
