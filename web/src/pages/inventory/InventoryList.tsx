import { useEffect, useState } from 'react';
import { getInventoryItems, adjustStock, type InventoryItem } from '../../services/inventoryService';
import { AlertTriangle, ArrowUp, ArrowDown } from 'lucide-react';
import toast from 'react-hot-toast';

export default function InventoryList() {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [adjustItem, setAdjustItem] = useState<InventoryItem | null>(null);
    const [adjustment, setAdjustment] = useState({ quantity: 1, type: 'IN' as 'IN' | 'OUT', notes: '' });

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
        <div className="page">
            <div className="page-header">
                <div>
                    <p className="page-eyebrow">Inventory</p>
                    <h1 className="page-title">Stock Control</h1>
                    <p className="page-subtitle">Monitor consumables, track usage, and avoid critical shortages.</p>
                </div>
            </div>

            {loading ? (
                <div className="empty-state">Loading inventory...</div>
            ) : (
                <div className="surface-card">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>SKU</th>
                                <th>Stock</th>
                                <th>Supplier</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item => (
                                <tr key={item.id}>
                                    <td>
                                        <div className="font-medium text-slate-800">{item.name}</div>
                                        <div className="text-xs text-slate-500">{item.description}</div>
                                    </td>
                                    <td className="text-sm text-slate-600">{item.sku}</td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <span className={`font-semibold ${item.quantity <= item.minimumStock ? 'text-rose-600' : 'text-slate-800'}`}>
                                                {item.quantity} {item.unit}
                                            </span>
                                            {item.quantity <= item.minimumStock && (
                                                <AlertTriangle size={16} className="text-rose-500" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="text-sm text-slate-600">{item.supplier?.name || '-'}</td>
                                    <td>
                                        <button
                                            onClick={() => setAdjustItem(item)}
                                            className="btn-secondary"
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

            {adjustItem && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2 className="text-xl font-semibold text-slate-800">Adjust Stock</h2>
                        <p className="text-sm text-slate-500">{adjustItem.name}</p>
                        <form onSubmit={handleAdjust} className="mt-4 space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setAdjustment({ ...adjustment, type: 'IN' })}
                                    className={`toggle-button ${adjustment.type === 'IN' ? 'toggle-active-success' : ''}`}
                                >
                                    <ArrowUp size={16} /> Add (IN)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setAdjustment({ ...adjustment, type: 'OUT' })}
                                    className={`toggle-button ${adjustment.type === 'OUT' ? 'toggle-active-danger' : ''}`}
                                >
                                    <ArrowDown size={16} /> Use (OUT)
                                </button>
                            </div>
                            <div>
                                <label className="label">Quantity</label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    className="input"
                                    value={adjustment.quantity}
                                    onChange={e => setAdjustment({ ...adjustment, quantity: Number(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="label">Notes</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={adjustment.notes}
                                    onChange={e => setAdjustment({ ...adjustment, notes: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setAdjustItem(null)}
                                    className="btn-secondary flex-1"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary flex-1"
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
