import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Box, ClipboardList, CheckCircle, AlertTriangle } from 'lucide-react';
import api from '../api/axios';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface DashboardStats {
    totalAssets: number;
    totalWorkOrders: number;
    statusData: { name: string; count: number }[];
    priorityData: { name: string; count: number }[];
}

export default function Dashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await api.get('/reports/dashboard-stats');
            setStats(response.data);
        } catch (error) {
            console.error('Failed to fetch dashboard stats', error);
            console.warn('Backend unavailable, using mock data for dashboard.');
            setStats({
                totalAssets: 124,
                totalWorkOrders: 45,
                statusData: [
                    { name: 'PENDING', count: 12 },
                    { name: 'ASSIGNED', count: 8 },
                    { name: 'IN_PROGRESS', count: 15 },
                    { name: 'COMPLETED', count: 10 },
                ],
                priorityData: [
                    { name: 'LOW', count: 20 },
                    { name: 'MEDIUM', count: 15 },
                    { name: 'HIGH', count: 8 },
                    { name: 'CRITICAL', count: 2 },
                ]
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;
    }

    if (!stats) {
        return <div className="p-8 text-center text-red-500">Failed to load data.</div>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                        <Box size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Assets</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalAssets}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
                    <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                        <ClipboardList size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Work Orders</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalWorkOrders}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
                    <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Completed Jobs</p>
                        <p className="text-2xl font-bold text-gray-900">
                            {stats.statusData.find(s => s.name === 'COMPLETED')?.count || 0}
                        </p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
                    <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Critical Issues</p>
                        <p className="text-2xl font-bold text-gray-900">
                            {stats.priorityData.find(s => s.name === 'CRITICAL')?.count || 0}
                        </p>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Work Order Status</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.statusData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Request Priority</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.priorityData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="count"
                                >
                                    {stats.priorityData.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
