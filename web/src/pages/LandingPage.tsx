import LandingNav from '../components/landing/LandingNav';
import LandingHero from '../components/landing/LandingHero';
import LandingFeatures from '../components/landing/LandingFeatures';
import LandingTestimonials from '../components/landing/LandingTestimonials';
import LandingPricing from '../components/landing/LandingPricing';
import LandingFAQ from '../components/landing/LandingFAQ';
import LandingCTA from '../components/landing/LandingCTA';
import LandingFooter from '../components/landing/LandingFooter';

export default function Landing() {
  return (
    <div className="landing">
      <LandingNav />
      <LandingHero />
      <LandingFeatures />
      <LandingTestimonials />
      <LandingPricing />
      <LandingFAQ />
      <LandingCTA />
      <LandingFooter />
    </div>
  );
}
