import { Link } from 'react-router-dom';
import { Shield, Activity, Clock, ArrowRight } from 'lucide-react';

export default function Landing() {
    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 flex items-center">
                                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2">
                                    <Activity className="h-5 w-5 text-white" />
                                </div>
                                <span className="font-bold text-xl text-gray-900 tracking-tight">HMMS</span>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <Link
                                to="/login"
                                className="ml-8 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative overflow-hidden pt-16 pb-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="lg:text-center">
                        <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Hospital Maintenance Management System</h2>
                        <p className="mt-2 text-4xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                            Operational Excellence for <br className="hidden sm:block" />
                            <span className="text-blue-600">Modern Healthcare.</span>
                        </p>
                        <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                            Centralize maintenance, track assets, and optimize workflows. Ensure compliance and reduce downtime with a unified platform for hospital operations.
                        </p>
                        <div className="mt-8 flex justify-center">
                            <div className="inline-flex rounded-md shadow">
                                <Link
                                    to="/login"
                                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    Access Portal <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </div>
                            <div className="ml-3 inline-flex">
                                <a
                                    href="#features"
                                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                                >
                                    Learn more
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Abstract Background Decoration */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-full z-0 opacity-30 pointer-events-none">
                    <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 left-0 w-full h-full">
                        <path fill="#EEF2FF" d="M928,321.5Q947,443,865.5,528.5Q784,614,688,675.5Q592,737,476.5,752.5Q361,768,272.5,684Q184,600,165.5,482Q147,364,244.5,274.5Q342,185,471,152Q600,119,742,159.5Q884,200,928,321.5Z" />
                    </svg>
                </div>
            </div>

            {/* Feature Section */}
            <div id="features" className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center mb-16">
                        <h3 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Everything you need to manage operations</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                                <Activity className="h-6 w-6 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Asset Management</h3>
                            <p className="text-gray-500">Track equipment lifecycles, maintenance history, and generate QR codes for instant access to digital records.</p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                                <Clock className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Work Orders</h3>
                            <p className="text-gray-500">Streamline requests, assignments, and approvals. Reduce MTTR with efficient workflows and real-time updates.</p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                                <Shield className="h-6 w-6 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Compliance & Safety</h3>
                            <p className="text-gray-500">Maintain audit trails, manage user roles securely, and ensure operational standards are met across departments.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex items-center">
                        <Activity className="h-6 w-6 text-blue-500 mr-2" />
                        <span className="text-xl font-bold">HMMS</span>
                    </div>
                    <p className="text-gray-400 text-sm">© 2026 Hospital Maintenance Management System.</p>
                </div>
            </footer>
        </div>
    );
}
