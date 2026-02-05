import { useEffect, useState } from 'react';
import { getRequisitions, createRequisition, approveRequisition, rejectRequisition, type Requisition } from '../services/requisitionService';
import { useAuth } from '../context/AuthContext';
import { Plus, Check, X, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Requisitions() {
    const { user } = useAuth();
    const [requisitions, setRequisitions] = useState<Requisition[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ title: '', description: '' });

    const isAdmin = user?.role === 'ADMIN' || user?.role === 'MANAGER';

    useEffect(() => {
        loadRequisitions();
    }, []);

    const loadRequisitions = async () => {
        try {
            const data = await getRequisitions();
            setRequisitions(data);
        } catch {
            toast.error('Failed to load requisitions');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createRequisition(form);
            toast.success('Requisition submitted');
            setShowModal(false);
            setForm({ title: '', description: '' });
            loadRequisitions();
        } catch {
            toast.error('Failed to create requisition');
        }
    };

    const handleApprove = async (id: string) => {
        try {
            await approveRequisition(id);
            toast.success('Requisition approved');
            loadRequisitions();
        } catch {
            toast.error('Failed to approve');
        }
    };

    const handleReject = async (id: string) => {
        try {
            await rejectRequisition(id);
            toast.success('Requisition rejected');
            loadRequisitions();
        } catch {
            toast.error('Failed to reject');
        }
    };

    const getStatusBadge = (status: string) => {
        const colors: Record<string, string> = {
            PENDING: 'bg-yellow-100 text-yellow-800',
            APPROVED: 'bg-green-100 text-green-800',
            REJECTED: 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    if (loading) return <div className="p-6">Loading requisitions...</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Requisitions</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    <Plus size={20} /> New Request
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="text-left p-4 font-medium text-gray-600">Title</th>
                            <th className="text-left p-4 font-medium text-gray-600">Requester</th>
                            <th className="text-left p-4 font-medium text-gray-600">Status</th>
                            <th className="text-left p-4 font-medium text-gray-600">Date</th>
                            {isAdmin && <th className="text-left p-4 font-medium text-gray-600">Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {requisitions.map((req) => (
                            <tr key={req.id} className="border-b hover:bg-gray-50">
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <FileText className="text-gray-400" size={18} />
                                        <div>
                                            <div className="font-medium">{req.title}</div>
                                            {req.description && (
                                                <div className="text-sm text-gray-500">{req.description}</div>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-gray-600">{req.requester.name}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(req.status)}`}>
                                        {req.status}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-600">
                                    {new Date(req.createdAt).toLocaleDateString()}
                                </td>
                                {isAdmin && (
                                    <td className="p-4">
                                        {req.status === 'PENDING' && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleApprove(req.id)}
                                                    className="text-green-600 hover:text-green-800"
                                                    title="Approve"
                                                >
                                                    <Check size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleReject(req.id)}
                                                    className="text-red-600 hover:text-red-800"
                                                    title="Reject"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        )}
                                        {req.status !== 'PENDING' && req.approver && (
                                            <span className="text-sm text-gray-500">
                                                by {req.approver.name}
                                            </span>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                        {requisitions.length === 0 && (
                            <tr>
                                <td colSpan={isAdmin ? 5 : 4} className="p-8 text-center text-gray-500">
                                    No requisitions found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Create Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">New Requisition</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    className="w-full border rounded-lg p-2"
                                    placeholder="e.g., Request for new AC unit"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    className="w-full border rounded-lg p-2"
                                    rows={3}
                                    placeholder="Provide details..."
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
