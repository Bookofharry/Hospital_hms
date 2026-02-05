import { useEffect, useState } from 'react';
import { getDashboardStats, getWorkOrderStats, getAssetHealth, getUtilityTrends, type DashboardStats, type ChartData, type UtilityReading } from '../services/reportService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Activity, AlertTriangle, Package, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

const COLORS = ['#0ea5e9', '#22c55e', '#f59e0b', '#f97316', '#6366f1'];

export default function Reports() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [woStats, setWoStats] = useState<ChartData[]>([]);
    const [assetStats, setAssetStats] = useState<ChartData[]>([]);
    const [utilityData, setUtilityData] = useState<UtilityReading[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [s, w, a, u] = await Promise.all([
                getDashboardStats(),
                getWorkOrderStats(),
                getAssetHealth(),
                getUtilityTrends()
            ]);
            setStats(s);
            setWoStats(w);
            setAssetStats(a);
            setUtilityData(u);
        } catch {
            toast.error('Failed to load reports');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="empty-state">Loading reports...</div>;

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <p className="page-eyebrow">Reports</p>
                    <h1 className="page-title">Analytics & Insights</h1>
                    <p className="page-subtitle">Track performance, asset health, and utility trends.</p>
                </div>
                <button className="btn-secondary">Export PDF</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="kpi-card">
                    <div>
                        <div className="kpi-label">Active Work Orders</div>
                        <div className="kpi-value text-sky-600">{stats?.activeWorkOrders}</div>
                    </div>
                    <div className="kpi-icon kpi-icon-sky"><Activity size={20} /></div>
                </div>
                <div className="kpi-card">
                    <div>
                        <div className="kpi-label">Total Assets</div>
                        <div className="kpi-value">{stats?.totalAssets}</div>
                    </div>
                    <div className="kpi-icon kpi-icon-indigo"><Package size={20} /></div>
                </div>
                <div className="kpi-card">
                    <div>
                        <div className="kpi-label">Low Stock Items</div>
                        <div className="kpi-value text-orange-600">{stats?.lowStockItems}</div>
                    </div>
                    <div className="kpi-icon kpi-icon-amber"><AlertTriangle size={20} /></div>
                </div>
                <div className="kpi-card">
                    <div>
                        <div className="kpi-label">Empty Cylinders</div>
                        <div className="kpi-value text-rose-600">{stats?.emptyCylinders}</div>
                    </div>
                    <div className="kpi-icon kpi-icon-rose"><Zap size={20} /></div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="surface-card">
                    <h2 className="section-title">Work Order Status</h2>
                    <div className="h-64 mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={woStats}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#38bdf8" name="Count" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="surface-card">
                    <h2 className="section-title">Asset Health</h2>
                    <div className="h-64 mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={assetStats}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }: { name?: string; percent?: number }) => `${name || ''} ${((percent || 0) * 100).toFixed(0)}%`}
                                    outerRadius={90}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {assetStats.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="surface-card lg:col-span-2">
                    <h2 className="section-title">Utility Trends</h2>
                    <div className="h-64 mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={utilityData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="recordedAt" tickFormatter={(val) => new Date(val).toLocaleDateString()} />
                                <YAxis />
                                <Tooltip labelFormatter={(val) => new Date(val).toLocaleString()} />
                                <Line type="monotone" dataKey="value" stroke="#22c55e" name="Value" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
