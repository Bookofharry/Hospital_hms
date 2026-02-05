import { Link } from 'react-router-dom';

export default function LandingCTA() {
  return (
    <section className="landing-cta">
      <div>
        <p className="section-eyebrow">Ready to Modernize?</p>
        <h2>Bring HMMS to your facility this quarter.</h2>
        <p>Our onboarding team will map your assets, workflows, and SLAs in one week.</p>
      </div>
      <div className="cta-actions">
        <Link to="/login" className="btn-invert">Schedule Implementation</Link>
        <Link to="/login" className="btn-ghost-dark">Download Overview</Link>
      </div>
    </section>
  );
}
