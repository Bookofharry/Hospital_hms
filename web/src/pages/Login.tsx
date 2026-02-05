import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, Lock, Mail, ArrowRight, Loader2, Sparkles } from 'lucide-react';

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
            await new Promise(resolve => setTimeout(resolve, 800));

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
                email: email || 'demo@hmms.demo',
                role: role,
                department: { name: 'Facilities' }
            };

            login('mock-jwt-token', mockUser);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login">
            <div className="login-panel">
                <div className="login-brand">
                    <div className="brand-mark">
                        <Activity className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="brand-title">HMMS Portal</p>
                        <p className="brand-subtitle">Maintenance & Compliance</p>
                    </div>
                </div>
                <div className="login-hero">
                    <div className="hero-pill">
                        <Sparkles size={16} />
                        Secure Operations Access
                    </div>
                    <h2>Welcome back.</h2>
                    <p>Sign in to manage work orders, assets, and critical facility operations.</p>
                    <div className="login-metrics">
                        <div>
                            <span>28</span>
                            <p>Active work orders</p>
                        </div>
                        <div>
                            <span>7</span>
                            <p>Preventive checks due</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="login-form">
                <div>
                    <h2>Sign in</h2>
                    <p>Use any email with manager/tech/staff to switch roles.</p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="label">Email address</label>
                        <div className="relative">
                            <Mail className="icon-input" />
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="input input-with-icon"
                                placeholder="you@hospital.org"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="label">Password</label>
                        <div className="relative">
                            <Lock className="icon-input" />
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="input input-with-icon"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-slate-600">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" className="h-4 w-4" />
                            Remember me
                        </label>
                        <a href="#" className="hover:text-slate-900">Forgot password?</a>
                    </div>

                    {error && (
                        <div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">
                            {error}
                        </div>
                    )}

                    <button type="submit" disabled={isLoading} className="btn-primary w-full">
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin h-4 w-4" />
                                Signing in...
                            </>
                        ) : (
                            <>
                                Sign in <ArrowRight className="h-4 w-4" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link to="/" className="text-sm text-slate-500 hover:text-slate-800">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
