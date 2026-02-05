import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { Printer, ArrowLeft } from 'lucide-react';
import { demoStore } from '../../data/demoStore';

type AssetQR = {
    id: string;
    name: string;
    serialNumber?: string;
};

export default function AssetQRCallback() {
    const { id } = useParams<{ id: string }>();
    const [asset, setAsset] = useState<AssetQR | null>(null);

    useEffect(() => {
        const fetchAsset = async () => {
            try {
                const assets = (await demoStore.getAssets()) as AssetQR[];
                const found = assets.find((item) => item.id === id) || null;
                setAsset(found);
            } catch {
                setAsset(null);
            }
        };
        fetchAsset();
    }, [id]);

    const handlePrint = () => {
        window.print();
    };

    if (!asset) return <div className="empty-state">Loading...</div>;

    // The QR payload could be a URL scheme or just the ID
    const qrPayload = JSON.stringify({
        type: 'asset',
        id: asset.id,
        name: asset.name
    });

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="mb-8 w-full max-w-md flex justify-between items-center print:hidden">
                <Link to="/assets" className="flex items-center text-gray-600 hover:text-gray-900">
                    <ArrowLeft className="h-5 w-5 mr-1" />
                    Back to Assets
                </Link>
                <button
                    onClick={handlePrint}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    <Printer className="h-5 w-5 mr-2" />
                    Print Label
                </button>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 text-center print:shadow-none print:border-2 print:border-black">
                <h2 className="text-xl font-bold mb-2">{asset.name}</h2>
                <p className="text-sm text-gray-500 mb-6">{asset.serialNumber}</p>

                <div className="flex justify-center mb-6">
                    <QRCodeCanvas value={qrPayload} size={200} />
                </div>

                <p className="text-xs text-gray-400 uppercase tracking-widest">{asset.id}</p>
            </div>
        </div>
    );
}
