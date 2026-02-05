import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Settings as SettingsIcon, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function Settings() {
    const { user } = useAuth();
    const [form, setForm] = useState({
        name: '',
        email: '',
        department: ''
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (user) {
            setForm({
                name: user.name || '',
                email: user.email || '',
                department: (user as any).department || ''
            });
        }
    }, [user]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.patch(`/users/${user?.id}`, form);
            toast.success('Profile updated successfully');
        } catch {
            toast.error('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-6 max-w-2xl">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <SettingsIcon className="text-gray-600" /> Settings
            </h1>

            {/* Profile Section */}
            <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <User size={20} /> Profile
                </h2>
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full border rounded-lg p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="w-full border rounded-lg p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                        <input
                            type="text"
                            value={form.department}
                            onChange={(e) => setForm({ ...form, department: e.target.value })}
                            className="w-full border rounded-lg p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <input
                            type="text"
                            value={user?.role || ''}
                            disabled
                            className="w-full border rounded-lg p-2 bg-gray-100 text-gray-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Contact an admin to change your role.</p>
                    </div>
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>

            {/* System Preferences Placeholder */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold mb-4">System Preferences</h2>
                <p className="text-gray-500">Notification preferences and theme customization coming soon.</p>
            </div>
        </div>
    );
}
