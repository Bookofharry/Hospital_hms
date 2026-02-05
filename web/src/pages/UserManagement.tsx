import { useEffect, useState } from 'react';
import { getUsers, createUser, deleteUser, type User, type CreateUserDto } from '../services/userService';
import { Plus, Trash2, UserCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ROLES = ['ADMIN', 'MANAGER', 'TECHNICIAN', 'STAFF'] as const;

export default function UserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState<CreateUserDto>({
        name: '',
        email: '',
        password: '',
        role: 'TECHNICIAN',
        department: ''
    });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await getUsers();
            setUsers(data);
        } catch {
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createUser(form);
            toast.success('User created');
            setShowModal(false);
            setForm({ name: '', email: '', password: '', role: 'TECHNICIAN', department: '' });
            loadUsers();
        } catch {
            toast.error('Failed to create user');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        try {
            await deleteUser(id);
            toast.success('User deleted');
            loadUsers();
        } catch {
            toast.error('Failed to delete user');
        }
    };

    const getRoleBadge = (role: string) => {
        const colors: Record<string, string> = {
            ADMIN: 'chip chip-indigo',
            MANAGER: 'chip chip-sky',
            TECHNICIAN: 'chip chip-emerald',
            STAFF: 'chip chip-neutral'
        };
        return colors[role] || 'chip chip-neutral';
    };

    if (loading) return <div className="empty-state">Loading users...</div>;

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <p className="page-eyebrow">Admin</p>
                    <h1 className="page-title">User Management</h1>
                    <p className="page-subtitle">Manage roles, departments, and access permissions.</p>
                </div>
                <button onClick={() => setShowModal(true)} className="btn-primary">
                    <Plus size={18} /> Add User
                </button>
            </div>

            <div className="surface-card">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Department</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td className="flex items-center gap-3">
                                    <UserCircle className="text-slate-400" size={28} />
                                    <span className="font-medium text-slate-800">{user.name}</span>
                                </td>
                                <td className="text-slate-600">{user.email}</td>
                                <td>
                                    <span className={getRoleBadge(user.role)}>{user.role}</span>
                                </td>
                                <td className="text-slate-600">{user.department || '-'}</td>
                                <td>
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        className="btn-secondary"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center text-slate-500 py-8">
                                    No users found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2 className="text-xl font-semibold text-slate-800">Add New User</h2>
                        <form onSubmit={handleCreate} className="mt-4 space-y-4">
                            <div>
                                <label className="label">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="input"
                                />
                            </div>
                            <div>
                                <label className="label">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    className="input"
                                />
                            </div>
                            <div>
                                <label className="label">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    className="input"
                                />
                            </div>
                            <div>
                                <label className="label">Role</label>
                                <select
                                    value={form.role}
                                    onChange={(e) => setForm({ ...form, role: e.target.value as typeof form.role })}
                                    className="input"
                                >
                                    {ROLES.map((r) => (
                                        <option key={r} value={r}>{r}</option>
                                    ))}
                                </select>
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
                            <div className="flex gap-2">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                                <button type="submit" className="btn-primary flex-1">Create User</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
