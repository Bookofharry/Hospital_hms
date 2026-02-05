import { useEffect, useState } from 'react';
import { getDashboardStats, getWorkOrderStats, getAssetHealth, getUtilityTrends, type DashboardStats, type ChartData, type UtilityReading } from '../services/reportService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Activity, AlertTriangle, Package, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

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
        } catch (error) {
            toast.error('Failed to load reports');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-6">Loading reports...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Reports & Analytics</h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <div className="text-sm text-gray-500">Active Work Orders</div>
                        <div className="text-2xl font-bold text-blue-600">{stats?.activeWorkOrders}</div>
                    </div>
                    <Activity className="text-blue-100 bg-blue-600 p-2 rounded-lg" size={40} />
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <div className="text-sm text-gray-500">Total Assets</div>
                        <div className="text-2xl font-bold text-gray-800">{stats?.totalAssets}</div>
                    </div>
                    <Package className="text-gray-100 bg-gray-600 p-2 rounded-lg" size={40} />
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <div className="text-sm text-gray-500">Low Stock Items</div>
                        <div className="text-2xl font-bold text-orange-600">{stats?.lowStockItems}</div>
                    </div>
                    <AlertTriangle className="text-orange-100 bg-orange-600 p-2 rounded-lg" size={40} />
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <div className="text-sm text-gray-500">Empty Cylinders</div>
                        <div className="text-2xl font-bold text-red-600">{stats?.emptyCylinders}</div>
                    </div>
                    <Zap className="text-red-100 bg-red-600 p-2 rounded-lg" size={40} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Work Order Breakdown */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold mb-4">Work Order Status</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={woStats}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill="#3b82f6" name="Count" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Asset Health */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold mb-4">Asset Health</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={assetStats}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }: any) => `${name || ''} ${((percent || 0) * 100).toFixed(0)}%`}
                                    outerRadius={80}
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

                {/* Utility Trends (Simplified) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
                    <h2 className="text-lg font-semibold mb-4">Recent Utility Readings</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={utilityData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="recordedAt" tickFormatter={(val) => new Date(val).toLocaleDateString()} />
                                <YAxis />
                                <Tooltip labelFormatter={(val) => new Date(val).toLocaleString()} />
                                <Legend />
                                <Line type="monotone" dataKey="value" stroke="#82ca9d" name="Value" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
