import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Box, ClipboardList, CheckCircle, AlertTriangle, Activity, Wrench } from 'lucide-react';
import { demoStore } from '../data/demoStore';
import { demoPriorityStats, demoStatusStats } from '../data/demo';

const COLORS = ['#0ea5e9', '#22c55e', '#f59e0b', '#f97316', '#6366f1'];

interface DashboardStats {
    totalAssets: number;
    activeWorkOrders: number;
    lowStockItems: number;
    emptyCylinders: number;
}

export default function Dashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await demoStore.getDashboardStats();
            setStats(data as DashboardStats);
            setLoading(false);
        };
        load();
    }, []);

    if (loading) {
        return <div className="empty-state">Loading dashboard...</div>;
    }

    if (!stats) {
        return <div className="empty-state">Failed to load data.</div>;
    }

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <p className="page-eyebrow">Executive Overview</p>
                    <h1 className="page-title">Operations Dashboard</h1>
                    <p className="page-subtitle">Real-time visibility across maintenance, assets, and compliance trends.</p>
                </div>
                <button className="btn-secondary">
                    <Activity className="h-4 w-4" />
                    Export Snapshot
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="kpi-card">
                    <div>
                        <p className="kpi-label">Total Assets</p>
                        <p className="kpi-value">{stats.totalAssets}</p>
                        <p className="kpi-meta">Across all departments</p>
                    </div>
                    <div className="kpi-icon kpi-icon-indigo">
                        <Box size={22} />
                    </div>
                </div>

                <div className="kpi-card">
                    <div>
                        <p className="kpi-label">Active Work Orders</p>
                        <p className="kpi-value">{stats.activeWorkOrders}</p>
                        <p className="kpi-meta">Open & in progress</p>
                    </div>
                    <div className="kpi-icon kpi-icon-sky">
                        <ClipboardList size={22} />
                    </div>
                </div>

                <div className="kpi-card">
                    <div>
                        <p className="kpi-label">Low Stock Items</p>
                        <p className="kpi-value">{stats.lowStockItems}</p>
                        <p className="kpi-meta">Reorder recommended</p>
                    </div>
                    <div className="kpi-icon kpi-icon-amber">
                        <AlertTriangle size={22} />
                    </div>
                </div>

                <div className="kpi-card">
                    <div>
                        <p className="kpi-label">Empty Cylinders</p>
                        <p className="kpi-value">{stats.emptyCylinders}</p>
                        <p className="kpi-meta">Oxygen movement</p>
                    </div>
                    <div className="kpi-icon kpi-icon-rose">
                        <CheckCircle size={22} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="surface-card">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="section-title">Work Order Status</h2>
                            <p className="section-subtitle">Distribution across current queue.</p>
                        </div>
                        <div className="chip chip-neutral">Last 7 days</div>
                    </div>
                    <div className="mt-6 h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={demoStatusStats}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="count" fill="#38bdf8" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="surface-card">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="section-title">Priority Mix</h2>
                            <p className="section-subtitle">Critical workload distribution.</p>
                        </div>
                        <div className="chip chip-neutral">This month</div>
                    </div>
                    <div className="mt-6 h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={demoPriorityStats}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="count"
                                >
                                    {demoPriorityStats.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="surface-card">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="section-title">Today’s Focus</h2>
                        <p className="section-subtitle">Recommended next actions based on SLA targets.</p>
                    </div>
                    <button className="btn-secondary">
                        <Wrench className="h-4 w-4" />
                        View Queue
                    </button>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <div className="rounded-xl border border-slate-200/70 bg-white/80 p-4">
                        <p className="text-sm font-semibold text-slate-700">Escalations due</p>
                        <p className="mt-2 text-2xl font-semibold text-slate-900">3</p>
                        <p className="text-xs text-slate-500">Critical issues within 4 hours</p>
                    </div>
                    <div className="rounded-xl border border-slate-200/70 bg-white/80 p-4">
                        <p className="text-sm font-semibold text-slate-700">Preventive checks</p>
                        <p className="mt-2 text-2xl font-semibold text-slate-900">7</p>
                        <p className="text-xs text-slate-500">Upcoming this week</p>
                    </div>
                    <div className="rounded-xl border border-slate-200/70 bg-white/80 p-4">
                        <p className="text-sm font-semibold text-slate-700">Inventory alerts</p>
                        <p className="mt-2 text-2xl font-semibold text-slate-900">6</p>
                        <p className="text-xs text-slate-500">Below minimum stock</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
