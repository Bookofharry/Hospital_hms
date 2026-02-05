import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Filter, Search } from 'lucide-react';
import api from '../../api/axios';
import clsx from 'clsx';

interface WorkOrder {
    id: string;
    title: string;
    priority: string;
    status: string;
    asset?: { name: string; location: string };
    assignedTo?: { name: string };
    createdAt: string;
}

const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    ASSIGNED: 'bg-blue-100 text-blue-800',
    IN_PROGRESS: 'bg-indigo-100 text-indigo-800',
    COMPLETED: 'bg-green-100 text-green-800',
    CLOSED: 'bg-gray-100 text-gray-800',
};

const priorityColors: Record<string, string> = {
    LOW: 'text-gray-500',
    MEDIUM: 'text-blue-500',
    HIGH: 'text-orange-500',
    CRITICAL: 'text-red-600 font-bold',
};

export default function WorkOrderList() {
    const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        fetchWorkOrders();
    }, []);

    const fetchWorkOrders = async () => {
        try {
            const response = await api.get('/work-orders');
            setWorkOrders(response.data);
        } catch (error) {
            console.error('Failed to fetch work orders', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredOrders = workOrders.filter(wo =>
        wo.title.toLowerCase().includes(filter.toLowerCase()) ||
        wo.asset?.name.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Work Orders</h1>
                <Link
                    to="/work-orders/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                    <Plus className="-ml-1 mr-2 h-5 w-5" />
                    Create Request
                </Link>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex gap-4">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Search work orders..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <Filter className="mr-2 h-5 w-5 text-gray-400" />
                    Filter
                </button>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading...</div>
            ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <ul className="divide-y divide-gray-200">
                        {filteredOrders.map((wo) => (
                            <li key={wo.id} className="hover:bg-gray-50">
                                <Link to={`/work-orders/${wo.id}`} className="block px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center truncate">
                                            <p className="text-sm font-medium text-blue-600 truncate">{wo.title}</p>
                                            <span className={clsx("ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full", statusColors[wo.status])}>
                                                {wo.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <div className="ml-2 flex-shrink-0 flex">
                                            <p className={clsx("px-2 inline-flex text-xs leading-5 font-semibold rounded-full", priorityColors[wo.priority])}>
                                                {wo.priority}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-2 sm:flex sm:justify-between">
                                        <div className="sm:flex">
                                            <p className="flex items-center text-sm text-gray-500 mr-6">
                                                Asset: {wo.asset?.name || 'General'}
                                            </p>
                                            <p className="flex items-center text-sm text-gray-500">
                                                Assigned: {wo.assignedTo?.name || 'Unassigned'}
                                            </p>
                                        </div>
                                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                            <p>Created on {new Date(wo.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        ))}
                        {filteredOrders.length === 0 && (
                            <li className="px-4 py-10 text-center text-gray-500">No work orders found.</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}
