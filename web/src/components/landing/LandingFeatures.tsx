import { Activity, Clock, Shield } from 'lucide-react';
import LandingLogos from './LandingLogos';

export default function LandingFeatures() {
  return (
    <section id="features" className="landing-features">
      <div className="section-head">
        <p className="section-eyebrow">Capabilities</p>
        <h2>Everything your maintenance team needs.</h2>
        <p>Built for hospital operations, from technicians on the floor to facility managers.</p>
      </div>

      <LandingLogos />

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
  );
}
