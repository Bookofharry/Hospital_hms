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
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Utility Tracker</h1>

            {/* Input Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                <h2 className="text-lg font-semibold mb-4">Record Daily Reading</h2>
                <form onSubmit={handleSubmit} className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-medium mb-1">Utility Type</label>
                        <select
                            className="w-full border p-2 rounded"
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
                    <div className="flex-1">
                        <label className="block text-sm font-medium mb-1">Value ({formData.unit})</label>
                        <input
                            type="number"
                            step="0.01"
                            className="w-full border p-2 rounded"
                            required
                            value={formData.value}
                            onChange={e => setFormData({ ...formData, value: e.target.value })}
                        />
                    </div>
                    <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 h-10">
                        Record
                    </button>
                </form>
            </div>

            {/* Recent Readings List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold mb-4">Recent Readings</h2>
                <div className="space-y-3">
                    {readings.map(reading => (
                        <div key={reading.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${reading.type === 'ELECTRICITY' ? 'bg-yellow-100 text-yellow-600' :
                                    reading.type === 'WATER' ? 'bg-blue-100 text-blue-600' :
                                        'bg-gray-200 text-gray-700'
                                    }`}>
                                    {reading.type === 'ELECTRICITY' ? <Zap size={18} /> :
                                        reading.type === 'WATER' ? <Droplet size={18} /> : <Fuel size={18} />}
                                </div>
                                <div>
                                    <div className="font-medium text-gray-900">{reading.type}</div>
                                    <div className="text-xs text-gray-500">{new Date(reading.recordedAt).toLocaleString()}</div>
                                </div>
                            </div>
                            <div className="font-bold text-gray-800">
                                {reading.value} <span className="text-sm font-normal text-gray-500">{reading.unit}</span>
                            </div>
                        </div>
                    ))}
                    {readings.length === 0 && <p className="text-gray-500 text-center">No readings recorded yet.</p>}
                </div>
            </div>
        </div>
    );
}
