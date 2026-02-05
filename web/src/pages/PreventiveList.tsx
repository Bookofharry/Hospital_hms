import { useEffect, useState } from 'react';
import { getPreventivePlans, type PreventivePlan, createPreventivePlan } from '../services/preventiveService';
import { Plus, Calendar, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PreventiveList() {
    const [plans, setPlans] = useState<PreventivePlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Form State
    const [formData, setFormData] = useState<{
        name: string;
        frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
        assetId: string;
        assignedToId: string;
    }>({
        name: '',
        frequency: 'WEEKLY',
        assetId: '', // Ideally a select dropdown
        assignedToId: '' // Ideally a select dropdown
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
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Preventive Maintenance</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    <Plus size={20} />
                    New Plan
                </button>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {plans.map(plan => (
                        <div key={plan.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-lg">{plan.name}</h3>
                                <span className="text-xs font-bold px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                                    {plan.frequency}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 mb-4">{plan.description || 'No description'}</p>

                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Settings size={16} />
                                <span>{plan.asset?.name || 'No Asset'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                <Calendar size={16} />
                                <span>Next Due: {new Date(plan.nextDue).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Simple Modal for MVP */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Create Preventive Plan</h2>
                        <form onSubmit={handleCreate}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Plan Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full border p-2 rounded"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Frequency</label>
                                <select
                                    className="w-full border p-2 rounded"
                                    value={formData.frequency}
                                    onChange={e => setFormData({ ...formData, frequency: e.target.value as any })}
                                >
                                    <option value="DAILY">Daily</option>
                                    <option value="WEEKLY">Weekly</option>
                                    <option value="MONTHLY">Monthly</option>
                                    <option value="YEARLY">Yearly</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
