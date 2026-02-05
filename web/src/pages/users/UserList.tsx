import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, User as UserIcon, Trash2, Edit } from 'lucide-react';
import api from '../../api/axios';
import clsx from 'clsx';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    department?: { name: string };
    section?: string;
}

const roleColors: Record<string, string> = {
    ADMIN: 'text-purple-600 bg-purple-100',
    MANAGER: 'text-blue-600 bg-blue-100',
    TECHNICIAN: 'text-green-600 bg-green-100',
    STAFF: 'text-gray-600 bg-gray-100',
};

export default function UserList() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch users', error);
            alert('Failed to load users. Ensure you have Admin privileges.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await api.delete(`/users/${id}`);
            setUsers(users.filter(u => u.id !== id));
        } catch (error) {
            console.error('Failed to delete user', error);
            alert('Failed to delete user');
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                <Link
                    to="/users/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                    <Plus className="-ml-1 mr-2 h-5 w-5" />
                    Add User
                </Link>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading users...</div>
            ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <ul className="divide-y divide-gray-200">
                        {filteredUsers.map((user) => (
                            <li key={user.id}>
                                <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                            <UserIcon className="h-6 w-6 text-gray-500" />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-6">
                                        <span className={clsx("px-2 inline-flex text-xs leading-5 font-semibold rounded-full", roleColors[user.role] || roleColors.STAFF)}>
                                            {user.role}
                                        </span>
                                        <div className="text-sm text-gray-500">
                                            {user.department?.name || user.section || '-'}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {user.status}
                                        </div>
                                        <div className="flex space-x-2">
                                            <Link to={`/users/${user.id}/edit`} className="text-gray-400 hover:text-blue-600">
                                                <Edit className="h-5 w-5" />
                                            </Link>
                                            <button onClick={() => handleDelete(user.id)} className="text-gray-400 hover:text-red-600">
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                        {filteredUsers.length === 0 && (
                            <li className="px-4 py-10 text-center text-gray-500">No users found.</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}
