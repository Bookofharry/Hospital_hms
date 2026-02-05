import { useAuth } from '../../context/AuthContext';
import { Bell, Search } from 'lucide-react';

export default function Header() {
    const { user } = useAuth();

    return (
        <header className="topbar">
            <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search assets, work orders..."
                    className="topbar-search"
                />
            </div>

            <div className="topbar-actions">
                <button className="icon-button" aria-label="Notifications">
                    <Bell className="h-4 w-4" />
                </button>
                <div className="topbar-user">
                    <div className="topbar-avatar">{user?.name?.[0] || 'U'}</div>
                    <div className="hidden md:block">
                        <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                        <p className="text-xs text-slate-500 uppercase">{user?.role}</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
