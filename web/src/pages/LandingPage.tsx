import { Link } from 'react-router-dom';
import { Shield, Activity, Clock, ArrowRight, Sparkles } from 'lucide-react';

export default function Landing() {
    return (
        <div className="landing">
            <nav className="landing-nav">
                <div className="landing-brand">
                    <div className="brand-mark">
                        <Activity className="h-5 w-5" />
                    </div>
                    <span className="brand-title">HMMS</span>
                </div>
                <div className="landing-actions">
                    <Link to="/login" className="btn-ghost-dark">Sign In</Link>
                    <Link to="/login" className="btn-invert">Request Demo</Link>
                </div>
            </nav>

            <section className="landing-hero">
                <div className="landing-hero-content">
                    <div className="hero-pill">
                        <Sparkles size={16} />
                        Hospital Maintenance Command Center
                    </div>
                    <h1>
                        Operational Excellence for<br />
                        <span>Modern Healthcare Teams.</span>
                    </h1>
                    <p>
                        Centralize maintenance, track assets, and optimize workflows. HMMS brings real-time visibility to
                        the people who keep hospitals running.
                    </p>
                    <div className="hero-actions">
                        <Link to="/login" className="btn-invert">
                            Access Portal <ArrowRight className="h-4 w-4" />
                        </Link>
                        <a href="#features" className="btn-ghost-dark">Explore Features</a>
                    </div>
                    <div className="hero-stats">
                        <div>
                            <p className="stat-value">30%</p>
                            <p className="stat-label">Downtime reduction</p>
                        </div>
                        <div>
                            <p className="stat-value">12k+</p>
                            <p className="stat-label">Assets tracked</p>
                        </div>
                        <div>
                            <p className="stat-value">99.5%</p>
                            <p className="stat-label">Audit readiness</p>
                        </div>
                    </div>
                </div>
                <div className="landing-hero-card">
                    <div className="hero-card-header">
                        <h3>Live Maintenance Pulse</h3>
                        <span>Today</span>
                    </div>
                    <div className="hero-card-grid">
                        <div>
                            <p>Open Work Orders</p>
                            <h4>28</h4>
                        </div>
                        <div>
                            <p>Critical Alerts</p>
                            <h4>3</h4>
                        </div>
                        <div>
                            <p>Preventive Due</p>
                            <h4>7</h4>
                        </div>
                        <div>
                            <p>Low Stock</p>
                            <h4>6</h4>
                        </div>
                    </div>
                    <div className="hero-card-footer">
                        <span>Radiology • ICU • Facilities</span>
                        <span>Last sync 2 mins ago</span>
                    </div>
                </div>
            </section>

            <section id="features" className="landing-features">
                <div className="section-head">
                    <p className="section-eyebrow">Capabilities</p>
                    <h2>Everything your maintenance team needs.</h2>
                    <p>Built for hospital operations, from technicians on the floor to facility managers.</p>
                </div>

                <div className="feature-grid">
                    <div className="feature-card">
                        <div className="feature-icon">
                            <Activity className="h-5 w-5" />
                        </div>
                        <h3>Asset Intelligence</h3>
                        <p>Track lifecycle, warranty, and compliance history with QR-enabled equipment profiles.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon feature-icon-green">
                            <Clock className="h-5 w-5" />
                        </div>
                        <h3>Work Order Automation</h3>
                        <p>Prioritize, assign, and close tickets with SLA tracking and escalation workflows.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon feature-icon-purple">
                            <Shield className="h-5 w-5" />
                        </div>
                        <h3>Compliance Readiness</h3>
                        <p>Maintain audit trails, safety checks, and preventive schedules from one dashboard.</p>
                    </div>
                </div>
            </section>

            <footer className="landing-footer">
                <div>
                    <div className="landing-brand">
                        <div className="brand-mark">
                            <Activity className="h-5 w-5" />
                        </div>
                        <span className="brand-title">HMMS</span>
                    </div>
                    <p>© 2026 Hospital Maintenance Management System.</p>
                </div>
                <div className="footer-links">
                    <a href="#features">Features</a>
                    <a href="/login">Portal</a>
                    <a href="mailto:hello@hmms.demo">Contact</a>
                </div>
            </footer>
        </div>
    );
}
