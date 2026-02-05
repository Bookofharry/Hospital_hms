import { useEffect, useState } from 'react';
import { getSuppliers, type Supplier } from '../../services/inventoryService';
import api from '../../services/api'; // Helper to create supplier directly here or move to service
import toast from 'react-hot-toast';

export default function Suppliers() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Form State
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });

    useEffect(() => {
        loadSuppliers();
    }, []);

    const loadSuppliers = async () => {
        try {
            const data = await getSuppliers();
            setSuppliers(data);
        } catch (error) {
            toast.error('Failed to load suppliers');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/inventory/suppliers', formData);
            toast.success('Supplier Created');
            setShowModal(false);
            loadSuppliers();
            setFormData({ name: '', email: '', phone: '', address: '' });
        } catch (error) {
            toast.error('Failed to create supplier');
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Suppliers</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    + Add Supplier
                </button>
            </div>

            {loading ? <p>Loading...</p> : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {suppliers.map(sup => (
                        <div key={sup.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="font-semibold text-lg">{sup.name}</h3>
                            <div className="text-sm text-gray-600 mt-2 space-y-1">
                                {sup.email && <p>📧 {sup.email}</p>}
                                {sup.phone && <p>📞 {sup.phone}</p>}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Add Supplier</h2>
                        <form onSubmit={handleCreate}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input className="w-full border p-2 rounded" required
                                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input className="w-full border p-2 rounded"
                                    value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Phone</label>
                                <input className="w-full border p-2 rounded"
                                    value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
