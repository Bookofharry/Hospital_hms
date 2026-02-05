import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function LandingHero() {
  return (
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
  );
}
