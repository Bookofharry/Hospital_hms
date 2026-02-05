import { useEffect, useState } from 'react';
import { getInventoryItems, adjustStock, type InventoryItem } from '../../services/inventoryService';
import { AlertTriangle, ArrowUp, ArrowDown } from 'lucide-react';
import toast from 'react-hot-toast';

export default function InventoryList() {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [adjustItem, setAdjustItem] = useState<InventoryItem | null>(null);
    const [adjustment, setAdjustment] = useState({ quantity: 0, type: 'IN' as 'IN' | 'OUT', notes: '' });

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        try {
            const data = await getInventoryItems();
            setItems(data);
        } catch (error) {
            toast.error('Failed to load inventory');
        } finally {
            setLoading(false);
        }
    };

    const handleAdjust = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!adjustItem) return;
        try {
            await adjustStock(adjustItem.id, adjustment.quantity, adjustment.type, adjustment.notes);
            toast.success('Stock updated');
            setAdjustItem(null);
            loadItems();
        } catch (error) {
            toast.error('Failed to update stock');
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Inventory Management</h1>

            {loading ? <p>Loading...</p> : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-4 font-semibold text-gray-600">Name</th>
                                <th className="p-4 font-semibold text-gray-600">SKU</th>
                                <th className="p-4 font-semibold text-gray-600">Stock</th>
                                <th className="p-4 font-semibold text-gray-600">Supplier</th>
                                <th className="p-4 font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item => (
                                <tr key={item.id} className="border-b hover:bg-gray-50">
                                    <td className="p-4">
                                        <div className="font-medium">{item.name}</div>
                                        <div className="text-xs text-gray-500">{item.description}</div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">{item.sku}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`font-bold ${item.quantity <= item.minimumStock ? 'text-red-600' : 'text-gray-800'}`}>
                                                {item.quantity} {item.unit}
                                            </span>
                                            {item.quantity <= item.minimumStock && (
                                                <AlertTriangle size={16} className="text-red-500" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">{item.supplier?.name || '-'}</td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => setAdjustItem(item)}
                                            className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                                        >
                                            Adjust
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Adjust Modal */}
            {adjustItem && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-sm">
                        <h2 className="text-xl font-bold mb-4">Adjust Stock: {adjustItem.name}</h2>
                        <form onSubmit={handleAdjust}>
                            <div className="flex gap-4 mb-4">
                                <button
                                    type="button"
                                    onClick={() => setAdjustment({ ...adjustment, type: 'IN' })}
                                    className={`flex-1 p-2 rounded border flex justify-center items-center gap-2 ${adjustment.type === 'IN' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-gray-50'}`}
                                >
                                    <ArrowUp size={16} /> Add (IN)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setAdjustment({ ...adjustment, type: 'OUT' })}
                                    className={`flex-1 p-2 rounded border flex justify-center items-center gap-2 ${adjustment.type === 'OUT' ? 'bg-red-50 border-red-500 text-red-700' : 'bg-gray-50'}`}
                                >
                                    <ArrowDown size={16} /> Use (OUT)
                                </button>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Quantity</label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    className="w-full border p-2 rounded"
                                    value={adjustment.quantity}
                                    onChange={e => setAdjustment({ ...adjustment, quantity: Number(e.target.value) })}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Notes</label>
                                <input
                                    type="text"
                                    className="w-full border p-2 rounded"
                                    value={adjustment.notes}
                                    onChange={e => setAdjustment({ ...adjustment, notes: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setAdjustItem(null)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Confirm
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
