import { Activity } from 'lucide-react';

export default function LandingFooter() {
  return (
    <footer className="landing-footer">
      <div>
        <div className="landing-brand">
          <div className="brand-mark">
            <Activity className="h-5 w-5 brand-icon-glow" />
          </div>
          <span className="brand-title brand-title-glow">HMMS</span>
        </div>
        <p>© 2026 Hospital Maintenance Management System.</p>
      </div>
      <div className="footer-links">
        <a href="#features">Features</a>
        <a href="/login">Portal</a>
        <a href="mailto:hello@hmms.demo">Contact</a>
      </div>
    </footer>
  );
}
