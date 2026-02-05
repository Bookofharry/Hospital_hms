import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, Box, Users, Settings, LogOut, Calendar, Package, FileText, Wrench } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';

export default function Sidebar() {
    const location = useLocation();
    const { user, logout } = useAuth();

    const navigation = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard, roles: ['ADMIN', 'MANAGER', 'TECHNICIAN', 'STAFF'] },
        { name: 'Assets', href: '/assets', icon: Box, roles: ['ADMIN', 'MANAGER', 'TECHNICIAN'] },
        { name: 'Work Orders', href: '/work-orders', icon: Wrench, roles: ['ADMIN', 'MANAGER', 'TECHNICIAN', 'STAFF'] },
        { name: 'Preventive', href: '/preventive', icon: ClipboardList, roles: ['ADMIN', 'MANAGER'] },
        { name: 'Calendar', href: '/preventive-calendar', icon: Calendar, roles: ['ADMIN', 'MANAGER'] },
        { name: 'Inventory', href: '/inventory', icon: Package, roles: ['ADMIN', 'MANAGER'] },
        { name: 'Suppliers', href: '/suppliers', icon: Users, roles: ['ADMIN', 'MANAGER'] }, // Re-using User icon for now
        { name: 'Reports', href: '/reports', icon: FileText, roles: ['ADMIN', 'MANAGER'] },
        { name: 'Settings', href: '/settings', icon: Settings, roles: ['ADMIN'] },
        { name: 'Users', href: '/users', icon: Users, roles: ['ADMIN'] },
    ];

    const filteredNavigation = navigation.filter(item => {
        if (!user || !user.role) return false;
        return item.roles.includes(user.role);
    });

    return (
        <div className="flex flex-col w-64 bg-slate-900 min-h-screen text-white">
            <div className="flex items-center justify-center h-16 border-b border-slate-800">
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
                    HMMS Portal
                </span>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-1 px-2">
                    {filteredNavigation.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={clsx(
                                    isActive
                                        ? 'bg-slate-800 text-white'
                                        : 'text-slate-300 hover:bg-slate-800 hover:text-white',
                                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors'
                                )}
                            >
                                <item.icon
                                    className={clsx(
                                        isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-white',
                                        'mr-3 flex-shrink-0 h-6 w-6 transition-colors'
                                    )}
                                    aria-hidden="true"
                                />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={logout}
                    className="flex items-center w-full px-2 py-2 text-sm font-medium text-slate-300 rounded-md hover:bg-slate-800 hover:text-white transition-colors"
                >
                    <LogOut className="mr-3 h-6 w-6 text-slate-400" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}
