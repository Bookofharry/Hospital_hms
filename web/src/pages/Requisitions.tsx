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
            PENDING: 'chip-amber',
            APPROVED: 'chip-emerald',
            REJECTED: 'chip-rose'
        };
        return `chip ${colors[status] || 'chip-neutral'}`;
    };

    if (loading) return <div className="empty-state">Loading requisitions...</div>;

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <p className="page-eyebrow">Requisitions</p>
                    <h1 className="page-title">Requests & Approvals</h1>
                    <p className="page-subtitle">Track purchase and repair requests with clear approvals.</p>
                </div>
                <button onClick={() => setShowModal(true)} className="btn-primary">
                    <Plus size={18} /> New Request
                </button>
            </div>

            <div className="surface-card">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Requester</th>
                            <th>Status</th>
                            <th>Date</th>
                            {isAdmin && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {requisitions.map((req) => (
                            <tr key={req.id}>
                                <td>
                                    <div className="flex items-center gap-2">
                                        <FileText className="text-slate-400" size={18} />
                                        <div>
                                            <div className="font-medium text-slate-800">{req.title}</div>
                                            {req.description && (
                                                <div className="text-sm text-slate-500">{req.description}</div>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="text-slate-600">{req.requester.name}</td>
                                <td>
                                    <span className={getStatusBadge(req.status)}>{req.status}</span>
                                </td>
                                <td className="text-slate-600">
                                    {new Date(req.createdAt).toLocaleDateString()}
                                </td>
                                {isAdmin && (
                                    <td>
                                        {req.status === 'PENDING' && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleApprove(req.id)}
                                                    className="btn-secondary"
                                                    title="Approve"
                                                >
                                                    <Check size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleReject(req.id)}
                                                    className="btn-secondary"
                                                    title="Reject"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        )}
                                        {req.status !== 'PENDING' && req.approver && (
                                            <span className="text-sm text-slate-500">by {req.approver.name}</span>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                        {requisitions.length === 0 && (
                            <tr>
                                <td colSpan={isAdmin ? 5 : 4} className="text-center text-slate-500 py-8">
                                    No requisitions found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2 className="text-xl font-semibold text-slate-800">New Requisition</h2>
                        <form onSubmit={handleCreate} className="mt-4 space-y-4">
                            <div>
                                <label className="label">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    className="input"
                                    placeholder="e.g., Request for new AC unit"
                                />
                            </div>
                            <div>
                                <label className="label">Description</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    className="input"
                                    rows={3}
                                    placeholder="Provide details..."
                                />
                            </div>
                            <div className="flex gap-2">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                                <button type="submit" className="btn-primary flex-1">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
