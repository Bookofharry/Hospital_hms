export default function LandingTestimonials() {
  return (
    <section className="landing-features">
      <div className="section-head">
        <p className="section-eyebrow">Testimonials</p>
        <h2>Operations teams rely on HMMS every day.</h2>
        <p>Facility leaders use the platform to stay compliant and reduce downtime.</p>
      </div>

      <div className="testimonial-grid">
        <div className="testimonial-card">
          <p>“We cut response times by 40% in the first month and our preventive compliance is finally measurable.”</p>
          <div className="testimonial-meta">
            <span className="avatar">AK</span>
            <div>
              <p className="name">Dr. Amina Kone</p>
              <p className="role">Chief Engineer, Mercy General</p>
            </div>
          </div>
        </div>
        <div className="testimonial-card">
          <p>“The dashboards give me instant visibility. We can justify budgets with real maintenance data.”</p>
          <div className="testimonial-meta">
            <span className="avatar">SO</span>
            <div>
              <p className="name">Samuel Otieno</p>
              <p className="role">Facilities Manager, St. Mary’s</p>
            </div>
          </div>
        </div>
        <div className="testimonial-card">
          <p>“Technicians love the mobile flow. Work orders are closed faster and with better documentation.”</p>
          <div className="testimonial-meta">
            <span className="avatar">LP</span>
            <div>
              <p className="name">Lena Park</p>
              <p className="role">Biomedical Lead, Northbridge</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
