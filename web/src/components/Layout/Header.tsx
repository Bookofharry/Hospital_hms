import { useAuth } from '../../context/AuthContext';
import { User } from 'lucide-react';

export default function Header() {
    const { user } = useAuth();

    return (
        <header className="bg-white border-b border-gray-200 h-16 px-6 flex items-center justify-between shadow-sm">
            <div className="flex items-center">
                {/* Breadcrumb or Page Title can go here */}
            </div>

            <div className="flex items-center space-x-4">
                <div className="text-right hidden md:block">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500 uppercase">{user?.role}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center ring-2 ring-white shadow-sm">
                    <User className="h-6 w-6 text-blue-600" />
                </div>
            </div>
        </header>
    );
}
