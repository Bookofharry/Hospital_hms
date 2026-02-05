export default function LandingFAQ() {
  return (
    <section className="landing-features">
      <div className="section-head">
        <p className="section-eyebrow">FAQ</p>
        <h2>Answers for hospital leadership teams.</h2>
        <p>Everything you need to evaluate HMMS confidently.</p>
      </div>

      <div className="faq-grid">
        <div className="faq-card">
          <h3>How fast can we go live?</h3>
          <p>Most hospitals onboard within 2–4 weeks, depending on asset data quality and integrations.</p>
        </div>
        <div className="faq-card">
          <h3>Do you support compliance audits?</h3>
          <p>Yes. HMMS keeps a full audit trail with preventive schedules, approvals, and export-ready reports.</p>
        </div>
        <div className="faq-card">
          <h3>Is the system mobile friendly?</h3>
          <p>Technicians can use the Expo mobile app for assignments, QR scans, and offline updates.</p>
        </div>
        <div className="faq-card">
          <h3>Can we integrate with our ERP?</h3>
          <p>Enterprise plans include custom API integrations and SSO support.</p>
        </div>
      </div>
    </section>
  );
}
