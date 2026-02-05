import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

export default function LandingNav() {
  return (
    <nav className="landing-nav">
      <div className="landing-brand">
        <div className="brand-mark">
          <Activity className="h-5 w-5" />
        </div>
        <span className="brand-title">HMMS</span>
      </div>
      <div className="landing-actions">
        <Link to="/login" className="nav-btn">Sign In</Link>
        <Link to="/login" className="nav-btn">Request Demo</Link>
      </div>
    </nav>
  );
}
