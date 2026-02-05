import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import { ArrowLeft, User, Box, Paperclip, Upload, Clock, Plus, CheckCircle, Play, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Attachment {
    id: string;
    url: string;
    fileName: string;
    fileType: string;
    createdAt: string;
}

interface TimeLog {
    id: string;
    minutes: number;
    description: string;
    user: { name: string };
    createdAt: string;
}

interface WorkOrder {
    id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    createdAt: string;
    asset?: { id: string; name: string; location: string };
    assignedTo?: { id: string; name: string };
    createdBy: { name: string };
    attachments?: Attachment[];
    timeLogs?: TimeLog[];
}

export default function WorkOrderDetail() {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const [wo, setWo] = useState<WorkOrder | null>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Time Log State
    const [minutes, setMinutes] = useState('');
    const [logDescription, setLogDescription] = useState('');
    const [loggingTime, setLoggingTime] = useState(false);

    const fetchWO = async () => {
        try {
            const response = await api.get(`/work-orders/${id}`);
            setWo(response.data);
        } catch (error) {
            console.error('Error fetching work order', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWO();
    }, [id]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            await handleUpload(file);
        }
    };

    const handleUpload = async (file: File) => {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            await api.post(`/work-orders/${id}/attachments`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            // Refresh WO to show new attachment
            fetchWO();
        } catch (error) {
            console.error('Failed to upload file', error);
            alert('Failed to upload file');
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleAddTimeLog = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoggingTime(true);
        try {
            await api.post(`/work-orders/${id}/time-logs`, {
                minutes: parseInt(minutes),
                description: logDescription
            });
            setMinutes('');
            setLogDescription('');
            fetchWO();
        } catch (error) {
            console.error('Failed to log time', error);
            alert('Failed to log time');
        } finally {
            setLoggingTime(false);
        }
    };

    const handleStatusUpdate = async (newStatus: string) => {
        if (!confirm('Are you sure you want to update the status?')) return;
        setUpdatingStatus(true);
        try {
            await api.patch(`/work-orders/${id}`, { status: newStatus });
            fetchWO();
        } catch (error) {
            console.error('Failed to update status', error);
            alert('Failed to update status');
        } finally {
            setUpdatingStatus(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!wo) return <div>Work order not found</div>;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800';
            case 'ASSIGNED': return 'bg-blue-100 text-blue-800';
            case 'IN_PROGRESS': return 'bg-purple-100 text-purple-800';
            case 'COMPLETED': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    }

    return (
        <div>
            <div className="mb-6">
                <Link to="/work-orders" className="text-gray-500 hover:text-gray-900 flex items-center">
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back to List
                </Link>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-start">
                    <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            {wo.title}
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            ID: {wo.id}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(wo.status)}`}>
                            {wo.status.replace('_', ' ')}
                        </span>

                        {/* Status Actions */}
                        {wo.status === 'PENDING' && (
                            <button
                                onClick={() => handleStatusUpdate('IN_PROGRESS')}
                                disabled={updatingStatus}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <Play className="-ml-1 mr-2 h-5 w-5" />
                                Start Work
                            </button>
                        )}

                        {wo.status === 'IN_PROGRESS' && (
                            <button
                                onClick={() => handleStatusUpdate('COMPLETED')}
                                disabled={updatingStatus}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                <CheckCircle className="-ml-1 mr-2 h-5 w-5" />
                                Mark Completed
                            </button>
                        )}

                        {wo.status === 'COMPLETED' && (user?.role === 'ADMIN' || user?.role === 'MANAGER') && (
                            <button
                                onClick={() => handleStatusUpdate('CLOSED')}
                                disabled={updatingStatus}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                            >
                                <ShieldCheck className="-ml-1 mr-2 h-5 w-5" />
                                Approve & Close
                            </button>
                        )}

                        {wo.status === 'COMPLETED' && user?.role === 'TECHNICIAN' && (
                            <span className="text-sm text-gray-500 italic">Waiting for Manager Approval</span>
                        )}
                    </div>
                </div>
                <div className="border-t border-gray-200">
                    <dl>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Description</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {wo.description}
                            </dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Priority</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-semibold">
                                {wo.priority}
                            </dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500 flex items-center">
                                <Box className="h-4 w-4 mr-2" /> Asset
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {wo.asset ? wo.asset.name : 'General Issue'}
                                {wo.asset?.location && <span className="text-gray-500 ml-2">({wo.asset.location})</span>}
                            </dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500 flex items-center">
                                <User className="h-4 w-4 mr-2" /> Assigned To
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {wo.assignedTo ? wo.assignedTo.name : 'Unassigned'}
                            </dd>
                        </div>

                        {/* Attachments Section */}
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500 flex items-center">
                                <Paperclip className="h-4 w-4 mr-2" /> Attachments
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                                    {wo.attachments?.map((attachment) => (
                                        <li key={attachment.id} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                                            <div className="w-0 flex-1 flex items-center">
                                                <Paperclip className="flex-shrink-0 h-5 w-5 text-gray-400" />
                                                <span className="ml-2 flex-1 w-0 truncate">
                                                    {attachment.fileName}
                                                </span>
                                            </div>
                                            <div className="ml-4 flex-shrink-0">
                                                <a href={`http://localhost:3000${attachment.url}`} target="_blank" rel="noreferrer" className="font-medium text-blue-600 hover:text-blue-500">
                                                    View
                                                </a>
                                            </div>
                                        </li>
                                    ))}
                                    {(!wo.attachments || wo.attachments.length === 0) && (
                                        <li className="pl-3 pr-4 py-3 text-sm text-gray-500">No attachments yet.</li>
                                    )}
                                </ul>

                                <div className="mt-4">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        onChange={handleFileChange}
                                        accept="image/*"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploading}
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        <Upload className="-ml-1 mr-2 h-5 w-5 text-gray-400" />
                                        {uploading ? 'Uploading...' : 'Upload Photo'}
                                    </button>
                                </div>
                            </dd>
                        </div>

                        {/* Time Logs Section */}
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500 flex items-center">
                                <Clock className="h-4 w-4 mr-2" /> Time Logs
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <div className="bg-gray-50 rounded-md p-4 mb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-medium text-gray-700">Total Time Spent</span>
                                        <span className="font-bold text-blue-600 text-lg">
                                            {wo.timeLogs?.reduce((acc, log) => acc + log.minutes, 0) || 0} mins
                                        </span>
                                    </div>
                                    <ul className="space-y-2">
                                        {wo.timeLogs?.map((log) => (
                                            <li key={log.id} className="text-sm text-gray-600 border-b border-gray-200 pb-2 last:border-0">
                                                <div className="flex justify-between">
                                                    <span className="font-medium">{log.user.name}</span>
                                                    <span>{new Date(log.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex justify-between mt-1">
                                                    <span>{log.description || 'No description'}</span>
                                                    <span className="font-semibold">{log.minutes} mins</span>
                                                </div>
                                            </li>
                                        ))}
                                        {(!wo.timeLogs || wo.timeLogs.length === 0) && (
                                            <li className="text-sm text-gray-500 italic">No time logged yet.</li>
                                        )}
                                    </ul>
                                </div>

                                <form onSubmit={handleAddTimeLog} className="flex gap-2 items-end">
                                    <div className="flex-1">
                                        <label htmlFor="minutes" className="sr-only">Minutes</label>
                                        <input
                                            type="number"
                                            id="minutes"
                                            placeholder="Mins"
                                            required
                                            min="1"
                                            value={minutes}
                                            onChange={(e) => setMinutes(e.target.value)}
                                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        />
                                    </div>
                                    <div className="flex-[2]">
                                        <label htmlFor="description" className="sr-only">Description</label>
                                        <input
                                            type="text"
                                            id="description"
                                            placeholder="What did you do?"
                                            required
                                            value={logDescription}
                                            onChange={(e) => setLogDescription(e.target.value)}
                                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loggingTime}
                                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </form>
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
}
