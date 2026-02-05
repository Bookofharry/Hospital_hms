import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { demoStore } from '../../data/demoStore';

interface Asset {
    id: string;
    name: string;
}

export default function WorkOrderForm() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const preselectedAssetId = searchParams.get('assetId');

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('MEDIUM');
    const [assetId, setAssetId] = useState(preselectedAssetId || '');
    const [assets, setAssets] = useState<Asset[]>([]);

    useEffect(() => {
        const loadAssets = async () => {
            const data = await demoStore.getAssets();
            setAssets(data as Asset[]);
        };
        loadAssets();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const selectedAsset = assets.find((asset) => asset.id === assetId);
        await demoStore.addWorkOrder({
            title,
            description,
            priority,
            asset: selectedAsset ? { id: selectedAsset.id, name: selectedAsset.name, location: 'On Site' } : undefined,
            createdBy: { name: 'Current User' }
        });
        navigate('/work-orders');
    };

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <p className="page-eyebrow">Work Orders</p>
                    <h1 className="page-title">New Work Order</h1>
                    <p className="page-subtitle">Log a maintenance request for review and assignment.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="surface-card max-w-3xl">
                <div className="grid gap-5">
                    <div>
                        <label className="label">Issue Title</label>
                        <input
                            type="text"
                            required
                            className="input"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., AC Unit Leaking"
                        />
                    </div>

                    <div>
                        <label className="label">Description</label>
                        <textarea
                            required
                            rows={4}
                            className="input"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe the issue in detail..."
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="label">Priority</label>
                            <select
                                className="input"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                                <option value="CRITICAL">Critical</option>
                            </select>
                        </div>

                        <div>
                            <label className="label">Affected Asset (Optional)</label>
                            <select
                                className="input"
                                value={assetId}
                                onChange={(e) => setAssetId(e.target.value)}
                            >
                                <option value="">-- General / No Asset --</option>
                                {assets.map((asset) => (
                                    <option key={asset.id} value={asset.id}>
                                        {asset.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={() => navigate('/work-orders')}
                            className="btn-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                        >
                            Submit Request
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
