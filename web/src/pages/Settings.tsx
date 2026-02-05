import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Settings as SettingsIcon, Save, Bell } from 'lucide-react';
import toast from 'react-hot-toast';

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
        await new Promise((resolve) => setTimeout(resolve, 600));
        toast.success('Profile updated successfully');
        setSaving(false);
    };

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <p className="page-eyebrow">Settings</p>
                    <h1 className="page-title">Profile & Preferences</h1>
                    <p className="page-subtitle">Manage your personal details and notification preferences.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="surface-card">
                    <h2 className="section-title flex items-center gap-2"><User size={18} /> Profile</h2>
                    <form onSubmit={handleSave} className="mt-4 space-y-4">
                        <div>
                            <label className="label">Name</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="input"
                            />
                        </div>
                        <div>
                            <label className="label">Email</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="input"
                            />
                        </div>
                        <div>
                            <label className="label">Department</label>
                            <input
                                type="text"
                                value={form.department}
                                onChange={(e) => setForm({ ...form, department: e.target.value })}
                                className="input"
                            />
                        </div>
                        <div>
                            <label className="label">Role</label>
                            <input
                                type="text"
                                value={user?.role || ''}
                                disabled
                                className="input bg-slate-100 text-slate-500"
                            />
                            <p className="text-xs text-slate-500 mt-1">Contact an admin to change your role.</p>
                        </div>
                        <button
                            type="submit"
                            disabled={saving}
                            className="btn-primary"
                        >
                            <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </div>

                <div className="surface-card">
                    <h2 className="section-title flex items-center gap-2"><SettingsIcon size={18} /> System Preferences</h2>
                    <div className="mt-4 space-y-4">
                        <div className="rounded-xl border border-slate-200/70 bg-white/70 p-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="font-medium text-slate-700">Escalation Alerts</p>
                                    <p className="text-sm text-slate-500">Notify on SLA breaches and critical priorities.</p>
                                </div>
                                <input type="checkbox" className="h-4 w-4" defaultChecked />
                            </div>
                        </div>
                        <div className="rounded-xl border border-slate-200/70 bg-white/70 p-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="font-medium text-slate-700">Daily Digest</p>
                                    <p className="text-sm text-slate-500">Email summary every morning at 8:00 AM.</p>
                                </div>
                                <input type="checkbox" className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="rounded-xl border border-slate-200/70 bg-white/70 p-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="font-medium text-slate-700">In-app Notifications</p>
                                    <p className="text-sm text-slate-500">Show updates for work order changes.</p>
                                </div>
                                <Bell className="text-slate-400" size={18} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
