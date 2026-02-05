import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, QrCode, Edit, Trash2 } from 'lucide-react';
import api from '../../api/axios';

interface Asset {
    id: string;
    name: string;
    model: string;
    serialNumber: string;
    location: string;
}

export default function AssetList() {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchAssets();
    }, []);

    const fetchAssets = async () => {
        try {
            const response = await api.get('/assets');
            setAssets(response.data);
        } catch (error) {
            console.error('Failed to fetch assets', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this asset?')) return;
        try {
            await api.delete(`/assets/${id}`);
            setAssets(assets.filter(a => a.id !== id));
        } catch (error) {
            console.error('Failed to delete asset', error);
        }
    };

    const filteredAssets = assets.filter(asset =>
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Assets</h1>
                <Link
                    to="/assets/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                    <Plus className="-ml-1 mr-2 h-5 w-5" />
                    Add Asset
                </Link>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Search assets..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading assets...</div>
            ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <ul className="divide-y divide-gray-200">
                        {filteredAssets.map((asset) => (
                            <li key={asset.id} className="hover:bg-gray-50">
                                <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-blue-600 truncate">{asset.name}</p>
                                        <div className="mt-1 flex items-center text-sm text-gray-500">
                                            <span className="truncate mr-4">Model: {asset.model || 'N/A'}</span>
                                            <span className="truncate mr-4">S/N: {asset.serialNumber || 'N/A'}</span>
                                            <span className="truncate">Loc: {asset.location || 'N/A'}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <Link to={`/assets/${asset.id}/qr`} className="text-gray-400 hover:text-gray-600">
                                            <QrCode className="h-5 w-5" />
                                        </Link>
                                        <Link to={`/assets/${asset.id}/edit`} className="text-gray-400 hover:text-blue-600">
                                            <Edit className="h-5 w-5" />
                                        </Link>
                                        <button onClick={() => handleDelete(asset.id)} className="text-gray-400 hover:text-red-600">
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                        {filteredAssets.length === 0 && (
                            <li className="px-4 py-10 text-center text-gray-500">No assets found.</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}
