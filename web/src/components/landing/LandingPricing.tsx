import { Link } from 'react-router-dom';

export default function LandingPricing() {
  return (
    <section className="landing-features">
      <div className="section-head">
        <p className="section-eyebrow">Get Started</p>
        <h2>Launch in weeks, not months.</h2>
        <p>Choose a rollout path that matches your hospital size and compliance requirements.</p>
      </div>

      <div className="pricing-grid">
        <div className="pricing-card">
          <h3>Starter</h3>
          <p className="pricing-price">₦0</p>
          <p className="pricing-note">For pilot teams and demo environments.</p>
          <ul className="pricing-list">
            <li>Up to 3 departments</li>
            <li>Work orders + assets</li>
            <li>Basic dashboards</li>
          </ul>
          <div className="pricing-action">
            <Link to="/login" className="btn-invert w-full">Start Pilot</Link>
          </div>
        </div>

        <div className="pricing-card pricing-card-highlight">
          <div className="pricing-badge">Most Popular</div>
          <h3>Operations</h3>
          <p className="pricing-price">₦379,000 / mo</p>
          <p className="pricing-note">For multi-department hospital operations.</p>
          <ul className="pricing-list">
            <li>Unlimited work orders</li>
            <li>Preventive schedules</li>
            <li>Inventory + requisitions</li>
            <li>Analytics & exports</li>
          </ul>
          <div className="pricing-action">
            <Link to="/login" className="btn-invert w-full">Book a Demo</Link>
          </div>
        </div>

        <div className="pricing-card">
          <h3>Enterprise</h3>
          <p className="pricing-price">Custom</p>
          <p className="pricing-note">For multi-site hospital networks.</p>
          <ul className="pricing-list">
            <li>SSO + advanced audit</li>
            <li>Custom integrations</li>
            <li>24/7 support</li>
          </ul>
          <div className="pricing-action">
            <Link to="/login" className="btn-invert w-full">Talk to Sales</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
