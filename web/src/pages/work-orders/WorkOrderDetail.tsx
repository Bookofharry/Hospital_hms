import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Box, Paperclip, Upload, Clock, Plus, CheckCircle, Play, ShieldCheck, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { demoStore } from '../../data/demoStore';
import clsx from 'clsx';

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

const statusChip: Record<string, string> = {
    PENDING: 'chip-amber',
    ASSIGNED: 'chip-indigo',
    IN_PROGRESS: 'chip-sky',
    COMPLETED: 'chip-emerald',
    CLOSED: 'chip-neutral'
};

export default function WorkOrderDetail() {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const [wo, setWo] = useState<WorkOrder | null>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [minutes, setMinutes] = useState('');
    const [logDescription, setLogDescription] = useState('');
    const [loggingTime, setLoggingTime] = useState(false);

    const fetchWO = async () => {
        if (!id) return;
        const data = await demoStore.getWorkOrder(id);
        setWo(data as WorkOrder);
        setLoading(false);
    };

    useEffect(() => {
        fetchWO();
    }, [id]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0] && id) {
            const file = e.target.files[0];
            await handleUpload(file);
        }
    };

    const handleUpload = async (file: File) => {
        if (!id) return;
        setUploading(true);
        await demoStore.addWorkOrderAttachment(id, { fileName: file.name });
        await fetchWO();
        setUploading(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleAddTimeLog = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id || !user) return;
        setLoggingTime(true);
        await demoStore.addWorkOrderTimeLog(id, {
            minutes: parseInt(minutes, 10),
            description: logDescription,
            user: { name: user.name }
        });
        setMinutes('');
        setLogDescription('');
        await fetchWO();
        setLoggingTime(false);
    };

    const handleStatusUpdate = async (newStatus: string) => {
        if (!id) return;
        if (!confirm('Update status for this work order?')) return;
        setUpdatingStatus(true);
        await demoStore.updateWorkOrderStatus(id, newStatus);
        await fetchWO();
        setUpdatingStatus(false);
    };

    if (loading) return <div className="empty-state">Loading...</div>;
    if (!wo) return <div className="empty-state">Work order not found.</div>;

    return (
        <div className="page">
            <div className="mb-4">
                <Link to="/work-orders" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800">
                    <ArrowLeft className="h-4 w-4" /> Back to Work Orders
                </Link>
            </div>

            <div className="surface-card">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                        <p className="page-eyebrow">Work Order</p>
                        <h1 className="page-title text-2xl">{wo.title}</h1>
                        <p className="text-sm text-slate-500">ID: {wo.id} • Created {new Date(wo.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <span className={clsx('chip', statusChip[wo.status])}>{wo.status.replace('_', ' ')}</span>

                        {wo.status === 'PENDING' && (
                            <button
                                onClick={() => handleStatusUpdate('IN_PROGRESS')}
                                disabled={updatingStatus}
                                className="btn-primary"
                            >
                                <Play className="h-4 w-4" />
                                Start Work
                            </button>
                        )}

                        {wo.status === 'IN_PROGRESS' && (
                            <button
                                onClick={() => handleStatusUpdate('COMPLETED')}
                                disabled={updatingStatus}
                                className="btn-success"
                            >
                                <CheckCircle className="h-4 w-4" />
                                Mark Completed
                            </button>
                        )}

                        {wo.status === 'COMPLETED' && (user?.role === 'ADMIN' || user?.role === 'MANAGER') && (
                            <button
                                onClick={() => handleStatusUpdate('CLOSED')}
                                disabled={updatingStatus}
                                className="btn-purple"
                            >
                                <ShieldCheck className="h-4 w-4" />
                                Approve & Close
                            </button>
                        )}

                        {wo.status === 'COMPLETED' && user?.role === 'TECHNICIAN' && (
                            <span className="text-sm text-slate-500 italic">Waiting for Manager Approval</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-4">
                    <div className="surface-card">
                        <h2 className="section-title">Request Details</h2>
                        <p className="section-subtitle">Issue summary and asset context.</p>
                        <div className="mt-4 space-y-4 text-sm text-slate-600">
                            <div className="flex items-start gap-3">
                                <Box className="h-4 w-4 text-slate-400 mt-1" />
                                <div>
                                    <p className="font-medium text-slate-700">Asset</p>
                                    <p>{wo.asset ? wo.asset.name : 'General Issue'} {wo.asset?.location ? `• ${wo.asset.location}` : ''}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <User className="h-4 w-4 text-slate-400 mt-1" />
                                <div>
                                    <p className="font-medium text-slate-700">Assigned To</p>
                                    <p>{wo.assignedTo ? wo.assignedTo.name : 'Unassigned'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="h-4 w-4 text-slate-400 mt-1" />
                                <div>
                                    <p className="font-medium text-slate-700">Description</p>
                                    <p>{wo.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="surface-card">
                        <h2 className="section-title">Attachments</h2>
                        <p className="section-subtitle">Photos and inspection notes.</p>
                        <div className="mt-4 space-y-3">
                            {wo.attachments?.map((attachment) => (
                                <div key={attachment.id} className="flex items-center justify-between rounded-xl border border-slate-200/70 bg-white/70 px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <Paperclip className="h-4 w-4 text-slate-400" />
                                        <div>
                                            <p className="text-sm font-medium text-slate-700">{attachment.fileName}</p>
                                            <p className="text-xs text-slate-500">{new Date(attachment.createdAt).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <button className="btn-secondary" type="button">View</button>
                                </div>
                            ))}
                            {(!wo.attachments || wo.attachments.length === 0) && (
                                <div className="text-sm text-slate-500">No attachments yet.</div>
                            )}
                        </div>
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
                                className="btn-secondary"
                            >
                                <Upload className="h-4 w-4" />
                                {uploading ? 'Uploading...' : 'Upload Photo'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="surface-card">
                        <h2 className="section-title">Time Logs</h2>
                        <p className="section-subtitle">Track effort across the workflow.</p>
                        <div className="mt-4">
                            <div className="rounded-xl border border-slate-200/70 bg-slate-50/80 p-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-500">Total Time</span>
                                    <span className="text-lg font-semibold text-slate-800">
                                        {wo.timeLogs?.reduce((acc, log) => acc + log.minutes, 0) || 0} mins
                                    </span>
                                </div>
                                <ul className="mt-4 space-y-3">
                                    {wo.timeLogs?.map((log) => (
                                        <li key={log.id} className="rounded-lg border border-slate-200/70 bg-white/70 px-3 py-2 text-sm">
                                            <div className="flex items-center justify-between text-slate-600">
                                                <span className="font-medium text-slate-700">{log.user.name}</span>
                                                <span>{new Date(log.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <div className="mt-1 flex items-center justify-between text-slate-500">
                                                <span>{log.description || 'No description'}</span>
                                                <span className="font-semibold text-slate-700">{log.minutes} mins</span>
                                            </div>
                                        </li>
                                    ))}
                                    {(!wo.timeLogs || wo.timeLogs.length === 0) && (
                                        <li className="text-sm text-slate-500">No time logged yet.</li>
                                    )}
                                </ul>
                            </div>

                            <form onSubmit={handleAddTimeLog} className="mt-4 space-y-3">
                                <div>
                                    <label htmlFor="minutes" className="text-xs font-medium text-slate-500">Minutes</label>
                                    <input
                                        type="number"
                                        id="minutes"
                                        placeholder="45"
                                        required
                                        min="1"
                                        value={minutes}
                                        onChange={(e) => setMinutes(e.target.value)}
                                        className="input"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="description" className="text-xs font-medium text-slate-500">Summary</label>
                                    <input
                                        type="text"
                                        id="description"
                                        placeholder="What did you do?"
                                        required
                                        value={logDescription}
                                        onChange={(e) => setLogDescription(e.target.value)}
                                        className="input"
                                    />
                                </div>
                                <button type="submit" disabled={loggingTime} className="btn-primary w-full">
                                    <Plus className="h-4 w-4" />
                                    {loggingTime ? 'Saving...' : 'Add Time Log'}
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="surface-card">
                        <h2 className="section-title">Priority & SLA</h2>
                        <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                            <Clock className="h-4 w-4 text-slate-400" />
                            <span>Priority: <span className="font-semibold text-slate-800">{wo.priority}</span></span>
                        </div>
                        <p className="mt-3 text-xs text-slate-500">SLA target varies by priority tier. Monitor escalation timers in the manager dashboard.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
