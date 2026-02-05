import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Filter, Search, Clock, MapPin } from 'lucide-react';
import clsx from 'clsx';
import { demoStore } from '../../data/demoStore';

interface WorkOrder {
    id: string;
    title: string;
    priority: string;
    status: string;
    asset?: { name: string; location: string };
    assignedTo?: { name: string };
    createdAt: string;
}

const statusClasses: Record<string, string> = {
    PENDING: 'chip-amber',
    ASSIGNED: 'chip-indigo',
    IN_PROGRESS: 'chip-sky',
    COMPLETED: 'chip-emerald',
    CLOSED: 'chip-neutral'
};

const priorityClasses: Record<string, string> = {
    LOW: 'text-slate-500',
    MEDIUM: 'text-sky-600',
    HIGH: 'text-orange-600',
    CRITICAL: 'text-rose-600 font-semibold'
};

export default function WorkOrderList() {
    const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        const load = async () => {
            const data = await demoStore.getWorkOrders();
            setWorkOrders(data as WorkOrder[]);
            setLoading(false);
        };
        load();
    }, []);

    const filteredOrders = useMemo(() => (
        workOrders.filter(wo =>
            wo.title.toLowerCase().includes(filter.toLowerCase()) ||
            wo.asset?.name.toLowerCase().includes(filter.toLowerCase())
        )
    ), [workOrders, filter]);

    const stats = useMemo(() => {
        const pending = workOrders.filter(wo => wo.status === 'PENDING').length;
        const inProgress = workOrders.filter(wo => wo.status === 'IN_PROGRESS').length;
        const critical = workOrders.filter(wo => wo.priority === 'CRITICAL').length;
        return { pending, inProgress, critical };
    }, [workOrders]);

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <p className="page-eyebrow">Work Orders</p>
                    <h1 className="page-title">Requests & Assignments</h1>
                    <p className="page-subtitle">Track every request, prioritize urgent tasks, and keep response times on target.</p>
                </div>
                <Link to="/work-orders/new" className="btn-primary">
                    <Plus className="h-5 w-5" />
                    Create Request
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="kpi-card">
                    <div>
                        <p className="kpi-label">Pending</p>
                        <p className="kpi-value">{stats.pending}</p>
                    </div>
                    <div className="kpi-icon kpi-icon-amber">
                        <Clock size={20} />
                    </div>
                </div>
                <div className="kpi-card">
                    <div>
                        <p className="kpi-label">In Progress</p>
                        <p className="kpi-value">{stats.inProgress}</p>
                    </div>
                    <div className="kpi-icon kpi-icon-sky">
                        <Clock size={20} />
                    </div>
                </div>
                <div className="kpi-card">
                    <div>
                        <p className="kpi-label">Critical</p>
                        <p className="kpi-value">{stats.critical}</p>
                    </div>
                    <div className="kpi-icon kpi-icon-rose">
                        <Clock size={20} />
                    </div>
                </div>
            </div>

            <div className="surface-card mt-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="section-title">Active Queue</h2>
                        <p className="section-subtitle">Search by title or asset.</p>
                    </div>
                    <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row">
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                className="input input-with-icon"
                                placeholder="Search work orders..."
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            />
                        </div>
                        <button className="btn-secondary">
                            <Filter className="h-4 w-4" />
                            Filters
                        </button>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="empty-state">Loading work orders...</div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredOrders.map((wo) => (
                        <Link key={wo.id} to={`/work-orders/${wo.id}`} className="surface-card surface-card-hover">
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="card-title">{wo.title}</h3>
                                        <span className={clsx('chip', statusClasses[wo.status])}>{wo.status.replace('_', ' ')}</span>
                                    </div>
                                    <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-600">
                                        <span className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-slate-400" />
                                            {wo.asset?.name || 'General Issue'}
                                        </span>
                                        <span className="text-slate-500">Assigned: {wo.assignedTo?.name || 'Unassigned'}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-sm">
                                    <span className={clsx(priorityClasses[wo.priority])}>{wo.priority}</span>
                                    <span className="text-slate-500">{new Date(wo.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                    {filteredOrders.length === 0 && (
                        <div className="empty-state">No work orders found.</div>
                    )}
                </div>
            )}
        </div>
    );
}
