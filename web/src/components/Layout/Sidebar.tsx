import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    ClipboardList,
    Box,
    Users,
    Settings,
    LogOut,
    Calendar,
    Package,
    FileText,
    Wrench,
    Activity,
    Zap,
    Droplet
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';

export default function Sidebar() {
    const location = useLocation();
    const { user, logout } = useAuth();

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'MANAGER', 'TECHNICIAN'] },
        { name: 'Work Orders', href: '/work-orders', icon: Wrench, roles: ['ADMIN', 'MANAGER', 'TECHNICIAN', 'STAFF'] },
        { name: 'Assets', href: '/assets', icon: Box, roles: ['ADMIN', 'MANAGER', 'TECHNICIAN'] },
        { name: 'Preventive', href: '/preventive', icon: ClipboardList, roles: ['ADMIN', 'MANAGER'] },
        { name: 'Calendar', href: '/preventive-calendar', icon: Calendar, roles: ['ADMIN', 'MANAGER'] },
        { name: 'Inventory', href: '/inventory', icon: Package, roles: ['ADMIN', 'MANAGER'] },
        { name: 'Suppliers', href: '/suppliers', icon: Users, roles: ['ADMIN', 'MANAGER'] },
        { name: 'Oxygen', href: '/oxygen', icon: Activity, roles: ['ADMIN', 'MANAGER', 'TECHNICIAN'] },
        { name: 'Utilities', href: '/utilities', icon: Droplet, roles: ['ADMIN', 'MANAGER'] },
        { name: 'Requisitions', href: '/requisitions', icon: FileText, roles: ['ADMIN', 'MANAGER', 'STAFF'] },
        { name: 'Reports', href: '/reports', icon: Zap, roles: ['ADMIN', 'MANAGER'] },
        { name: 'Users', href: '/users', icon: Users, roles: ['ADMIN'] },
        { name: 'Settings', href: '/settings', icon: Settings, roles: ['ADMIN'] }
    ];

    const filteredNavigation = navigation.filter(item => {
        if (!user || !user.role) return false;
        return item.roles.includes(user.role);
    });

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <div className="brand-mark">
                    <Activity className="h-6 w-6" />
                </div>
                <div>
                    <p className="brand-title">HMMS</p>
                    <p className="brand-subtitle">Maintenance Portal</p>
                </div>
            </div>

            <nav className="sidebar-nav">
                {filteredNavigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={clsx('sidebar-link', isActive && 'sidebar-link-active')}
                        >
                            <item.icon className="h-5 w-5" aria-hidden="true" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="sidebar-footer">
                <div className="sidebar-user">
                    <div className="sidebar-avatar">
                        {user?.name?.[0] || 'U'}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-white">{user?.name || 'User'}</p>
                        <p className="text-xs text-slate-300 uppercase tracking-wide">{user?.role || 'ROLE'}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="sidebar-logout"
                >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
