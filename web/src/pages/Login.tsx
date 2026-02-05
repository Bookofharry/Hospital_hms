import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// import api from '../api/axios';
import { Activity, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Mock Login for Demo (Bypassing Backend)
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay

            // Mock Login based on Email
            let role = 'ADMIN';
            let name = 'Demo Admin';
            const lowerEmail = email.toLowerCase();

            if (lowerEmail.includes('manager')) {
                role = 'MANAGER';
                name = 'Facility Manager';
            } else if (lowerEmail.includes('tech')) {
                role = 'TECHNICIAN';
                name = 'John Technician';
            } else if (lowerEmail.includes('staff')) {
                role = 'STAFF';
                name = 'Sarah Staff';
            }

            const mockUser = {
                id: '1',
                name: name,
                email: email,
                role: role,
                department: { name: 'IT' }
            };

            login('mock-jwt-token', mockUser);
            navigate('/dashboard');

            // Original API call (Commented out for now)
            // const response = await api.post('/auth/login', { email, password });
            // const { token, user } = response.data;
            // login(token, user);
            // navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side - Visual */}
            <div className="hidden lg:flex lg:w-1/2 bg-blue-900 relative overflow-hidden items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-blue-800 opacity-90"></div>

                {/* Decorative Circles */}
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

                <div className="relative z-10 px-12 text-center text-white">
                    <div className="mb-6 flex justify-center">
                        <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                            <Activity className="h-10 w-10 text-white" />
                        </div>
                    </div>
                    <h2 className="text-4xl font-bold mb-4 tracking-tight">HMMS Portal</h2>
                    <p className="text-blue-100 text-lg max-w-md mx-auto leading-relaxed">
                        Streamline your hospital maintenance operations with powerful asset tracking, work order management, and real-time analytics.
                    </p>

                    <div className="mt-12 space-y-4">
                        <div className="flex items-center justify-center space-x-2 text-sm text-blue-200">
                            <div className="flex -space-x-2 overflow-hidden">
                                <img src="/images/professional1.png" alt="Healthcare Professional" className="inline-block h-8 w-8 rounded-full ring-2 ring-blue-900 object-cover" />
                                <img src="/images/professional2.png" alt="Healthcare Professional" className="inline-block h-8 w-8 rounded-full ring-2 ring-blue-900 object-cover" />
                                <img src="/images/professional3.png" alt="Healthcare Professional" className="inline-block h-8 w-8 rounded-full ring-2 ring-blue-900 object-cover" />
                            </div>
                            <span>Trusted by leading healthcare facilities</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div className="mb-10">
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome back</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Please sign in to access your dashboard.
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                                    Forgot password?
                                </a>
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-md bg-red-50 p-4 animate-fade-in-up">
                                <div className="flex">
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800">{error}</h3>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign in <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <Link to="/" className="text-sm font-medium text-gray-500 hover:text-gray-900">
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
