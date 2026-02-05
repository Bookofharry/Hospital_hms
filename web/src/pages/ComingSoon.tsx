import { Construction, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ComingSoonProps {
    title: string;
    description: string;
}

export default function ComingSoon({ title, description }: ComingSoonProps) {
    return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] text-center px-4">
            <div className="bg-blue-50 p-6 rounded-full mb-6 animate-pulse">
                <Construction className="h-16 w-16 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
            <p className="text-xl text-gray-500 max-w-md mb-8">
                {description}
            </p>

            <div className="bg-white p-6 rounded-lg shadow border border-gray-100 max-w-lg w-full">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Planned Features</h3>
                <ul className="text-left space-y-3">
                    <li className="flex items-center text-gray-600">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                        Phase 2 Integration
                    </li>
                    <li className="flex items-center text-gray-600">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                        Advanced Workflows
                    </li>
                    <li className="flex items-center text-gray-600">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                        Real-time Sync
                    </li>
                </ul>
            </div>

            <div className="mt-8">
                <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
                </Link>
            </div>
        </div>
    );
}
