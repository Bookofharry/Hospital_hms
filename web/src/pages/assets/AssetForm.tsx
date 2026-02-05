import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { demoStore } from '../../data/demoStore';

type AssetData = {
    id: string;
    name: string;
    model?: string;
    serialNumber?: string;
    location?: string;
    department?: string;
    status?: string;
    warrantyEndDate?: string;
    purchaseDate?: string;
};

export default function AssetForm() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        name: '',
        model: '',
        serialNumber: '',
        location: '',
        purchaseDate: '',
        warrantyExpiry: ''
    });

    useEffect(() => {
        const fetchAsset = async () => {
            if (!id) return;
            const assets = (await demoStore.getAssets()) as AssetData[];
            const asset = assets.find((a) => a.id === id);
            if (!asset) return;
            setFormData({
                name: asset.name,
                model: asset.model || '',
                serialNumber: asset.serialNumber || '',
                location: asset.location || '',
                purchaseDate: asset.purchaseDate ? asset.purchaseDate.split('T')[0] : '',
                warrantyExpiry: asset.warrantyEndDate ? asset.warrantyEndDate.split('T')[0] : ''
            });
        };
        fetchAsset();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newAsset: AssetData = {
            id: id || `a-${Date.now()}`,
            name: formData.name,
            model: formData.model,
            serialNumber: formData.serialNumber,
            location: formData.location,
            warrantyEndDate: formData.warrantyExpiry,
            department: 'Facilities',
            status: 'Operational'
        };
        await demoStore.addAsset(newAsset);
        navigate('/assets');
    };

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <p className="page-eyebrow">Assets</p>
                    <h1 className="page-title">{isEditMode ? 'Edit Asset' : 'New Asset'}</h1>
                    <p className="page-subtitle">Capture equipment details for tracking and compliance.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="surface-card max-w-3xl">
                <div className="grid gap-5">
                    <div>
                        <label className="label">Asset Name</label>
                        <input
                            type="text"
                            required
                            className="input"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="label">Model</label>
                            <input
                                type="text"
                                className="input"
                                value={formData.model}
                                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="label">Serial Number</label>
                            <input
                                type="text"
                                className="input"
                                value={formData.serialNumber}
                                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="label">Location</label>
                        <input
                            type="text"
                            className="input"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="label">Purchase Date</label>
                            <input
                                type="date"
                                className="input"
                                value={formData.purchaseDate}
                                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="label">Warranty Expiry</label>
                            <input
                                type="date"
                                className="input"
                                value={formData.warrantyExpiry}
                                onChange={(e) => setFormData({ ...formData, warrantyExpiry: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => navigate('/assets')}
                            className="btn-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                        >
                            Save Asset
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
