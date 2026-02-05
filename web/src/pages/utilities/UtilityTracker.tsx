import { useEffect, useState } from 'react';
import { getReadings, recordReading, type UtilityReading } from '../../services/oxygenUtilityService';
import { Zap, Droplet, Fuel } from 'lucide-react';
import toast from 'react-hot-toast';

export default function UtilityTracker() {
    const [readings, setReadings] = useState<UtilityReading[]>([]);
    const [formData, setFormData] = useState({ type: 'ELECTRICITY', value: '', unit: 'kWh' });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await getReadings();
            setReadings(data);
        } catch (error) {
            toast.error('Failed to load readings');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await recordReading(formData.type, Number(formData.value), formData.unit);
            toast.success('Reading Recorded');
            setFormData({ ...formData, value: '' });
            loadData();
        } catch (error) {
            toast.error('Failed to record reading');
        }
    };

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <p className="page-eyebrow">Utilities</p>
                    <h1 className="page-title">Utility Tracker</h1>
                    <p className="page-subtitle">Record daily usage for electricity, water, and diesel.</p>
                </div>
            </div>

            <div className="surface-card">
                <h2 className="section-title">Record Reading</h2>
                <p className="section-subtitle">Track consumption and monitor anomalies.</p>
                <form onSubmit={handleSubmit} className="mt-4 grid gap-4 md:grid-cols-3 md:items-end">
                    <div>
                        <label className="label">Utility Type</label>
                        <select
                            className="input"
                            value={formData.type}
                            onChange={e => {
                                const unit = e.target.value === 'ELECTRICITY' ? 'kWh' : 'Liters';
                                setFormData({ ...formData, type: e.target.value, unit });
                            }}
                        >
                            <option value="ELECTRICITY">Electricity</option>
                            <option value="WATER">Water</option>
                            <option value="DIESEL">Diesel</option>
                        </select>
                    </div>
                    <div>
                        <label className="label">Value ({formData.unit})</label>
                        <input
                            type="number"
                            step="0.01"
                            className="input"
                            required
                            value={formData.value}
                            onChange={e => setFormData({ ...formData, value: e.target.value })}
                        />
                    </div>
                    <button type="submit" className="btn-primary">
                        Record Reading
                    </button>
                </form>
            </div>

            <div className="surface-card mt-6">
                <h2 className="section-title">Recent Readings</h2>
                <p className="section-subtitle">Latest entries across all utilities.</p>
                <div className="mt-4 space-y-3">
                    {readings.map(reading => (
                        <div key={reading.id} className="flex items-center justify-between rounded-xl border border-slate-200/70 bg-white/70 p-3">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${reading.type === 'ELECTRICITY' ? 'bg-yellow-100 text-yellow-600' :
                                    reading.type === 'WATER' ? 'bg-sky-100 text-sky-600' :
                                        'bg-slate-200 text-slate-700'
                                    }`}>
                                    {reading.type === 'ELECTRICITY' ? <Zap size={18} /> :
                                        reading.type === 'WATER' ? <Droplet size={18} /> : <Fuel size={18} />}
                                </div>
                                <div>
                                    <div className="font-medium text-slate-900">{reading.type}</div>
                                    <div className="text-xs text-slate-500">{new Date(reading.recordedAt).toLocaleString()}</div>
                                </div>
                            </div>
                            <div className="font-semibold text-slate-800">
                                {reading.value} <span className="text-xs font-normal text-slate-500">{reading.unit}</span>
                            </div>
                        </div>
                    ))}
                    {readings.length === 0 && <p className="text-slate-500 text-center">No readings recorded yet.</p>}
                </div>
            </div>
        </div>
    );
}
