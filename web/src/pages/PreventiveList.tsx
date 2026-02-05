import { useEffect, useState } from 'react';
import { getPreventivePlans, type PreventivePlan, createPreventivePlan } from '../services/preventiveService';
import { Plus, Calendar, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PreventiveList() {
    const [plans, setPlans] = useState<PreventivePlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState<{
        name: string;
        frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
        assetId: string;
        assignedToId: string;
    }>({
        name: '',
        frequency: 'WEEKLY',
        assetId: '',
        assignedToId: ''
    });

    useEffect(() => {
        loadPlans();
    }, []);

    const loadPlans = async () => {
        try {
            const data = await getPreventivePlans();
            setPlans(data);
        } catch (error) {
            toast.error('Failed to load plans');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createPreventivePlan(formData);
            toast.success('Plan Created');
            setShowModal(false);
            loadPlans();
        } catch (error) {
            toast.error('Failed to create plan');
        }
    };

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <p className="page-eyebrow">Preventive Maintenance</p>
                    <h1 className="page-title">Scheduled Plans</h1>
                    <p className="page-subtitle">Stay ahead of compliance with recurring inspections and task templates.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn-primary"
                >
                    <Plus size={18} />
                    New Plan
                </button>
            </div>

            {loading ? (
                <div className="empty-state">Loading plans...</div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {plans.map(plan => (
                        <div key={plan.id} className="surface-card surface-card-hover">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="card-title">{plan.name}</h3>
                                <span className="chip chip-sky">{plan.frequency}</span>
                            </div>
                            <p className="text-sm text-slate-500 mb-4">{plan.description || 'No description'}</p>

                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Settings size={16} />
                                <span>{plan.asset?.name || 'No Asset'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
                                <Calendar size={16} />
                                <span>Next Due: {new Date(plan.nextDue).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2 className="text-xl font-semibold text-slate-800">Create Preventive Plan</h2>
                        <form onSubmit={handleCreate} className="mt-4 space-y-4">
                            <div>
                                <label className="label">Plan Name</label>
                                <input
                                    type="text"
                                    required
                                    className="input"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="label">Frequency</label>
                                <select
                                    className="input"
                                    value={formData.frequency}
                                    onChange={e => setFormData({ ...formData, frequency: e.target.value as any })}
                                >
                                    <option value="DAILY">Daily</option>
                                    <option value="WEEKLY">Weekly</option>
                                    <option value="MONTHLY">Monthly</option>
                                    <option value="YEARLY">Yearly</option>
                                </select>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="btn-secondary flex-1"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary flex-1"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
