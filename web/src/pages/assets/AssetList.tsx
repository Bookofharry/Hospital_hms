import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, QrCode, Edit, ShieldCheck, MapPin } from 'lucide-react';
import { demoStore } from '../../data/demoStore';
import clsx from 'clsx';

interface Asset {
    id: string;
    name: string;
    model: string;
    serialNumber: string;
    location: string;
    department?: string;
    status?: string;
    warrantyEndDate?: string;
}

const statusStyles: Record<string, string> = {
    Operational: 'chip-emerald',
    'In Service': 'chip-indigo',
    'Under Review': 'chip-amber'
};

export default function AssetList() {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const load = async () => {
            const data = await demoStore.getAssets();
            setAssets(data as Asset[]);
            setLoading(false);
        };
        load();
    }, []);

    const filteredAssets = useMemo(() => (
        assets.filter(asset =>
            asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            asset.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            asset.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    ), [assets, searchTerm]);

    const assetSummary = useMemo(() => {
        const total = assets.length;
        const needsReview = assets.filter(a => a.status === 'Under Review').length;
        const operational = assets.filter(a => a.status === 'Operational' || a.status === 'In Service').length;
        return { total, operational, needsReview };
    }, [assets]);

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <p className="page-eyebrow">Asset Registry</p>
                    <h1 className="page-title">Assets & Equipment</h1>
                    <p className="page-subtitle">Track mission-critical equipment across departments with warranty and service visibility.</p>
                </div>
                <Link
                    to="/assets/new"
                    className="btn-primary"
                >
                    <Plus className="h-5 w-5" />
                    Add Asset
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="kpi-card">
                    <div>
                        <p className="kpi-label">Total Assets</p>
                        <p className="kpi-value">{assetSummary.total}</p>
                    </div>
                    <div className="kpi-icon kpi-icon-indigo">
                        <ShieldCheck size={22} />
                    </div>
                </div>
                <div className="kpi-card">
                    <div>
                        <p className="kpi-label">Operational</p>
                        <p className="kpi-value">{assetSummary.operational}</p>
                    </div>
                    <div className="kpi-icon kpi-icon-emerald">
                        <ShieldCheck size={22} />
                    </div>
                </div>
                <div className="kpi-card">
                    <div>
                        <p className="kpi-label">Needs Review</p>
                        <p className="kpi-value">{assetSummary.needsReview}</p>
                    </div>
                    <div className="kpi-icon kpi-icon-amber">
                        <ShieldCheck size={22} />
                    </div>
                </div>
            </div>

            <div className="surface-card mt-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="section-title">Equipment Overview</h2>
                        <p className="section-subtitle">Search by name, model, or serial number.</p>
                    </div>
                    <div className="relative w-full md:max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            className="input input-with-icon"
                            placeholder="Search assets..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="empty-state">Loading assets...</div>
            ) : (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {filteredAssets.map((asset) => (
                        <div key={asset.id} className="surface-card surface-card-hover">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="card-title">{asset.name}</h3>
                                    <p className="card-subtitle">{asset.model}</p>
                                </div>
                                <span className={clsx('chip', statusStyles[asset.status || 'Operational'])}>
                                    {asset.status || 'Operational'}
                                </span>
                            </div>
                            <div className="mt-4 grid gap-3 text-sm text-slate-600">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-slate-400" />
                                    <span>{asset.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-slate-400">Serial</span>
                                    <span className="font-medium text-slate-700">{asset.serialNumber}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-slate-400">Warranty</span>
                                    <span>{asset.warrantyEndDate ? new Date(asset.warrantyEndDate).toLocaleDateString() : 'N/A'}</span>
                                </div>
                            </div>
                            <div className="mt-6 flex items-center justify-between">
                                <span className="text-xs text-slate-500">Department: {asset.department || 'General'}</span>
                                <div className="flex items-center gap-3">
                                    <button className="icon-button" title="QR">
                                        <QrCode className="h-4 w-4" />
                                    </button>
                                    <Link to={`/assets/${asset.id}/edit`} className="icon-button" title="Edit">
                                        <Edit className="h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredAssets.length === 0 && (
                        <div className="empty-state">No assets found.</div>
                    )}
                </div>
            )}
        </div>
    );
}
