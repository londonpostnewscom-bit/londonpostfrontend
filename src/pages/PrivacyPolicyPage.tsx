import { SectionHeading } from '../components/SectionHeading';

export function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 lg:px-6">
      <SectionHeading
        eyebrow="Legal"
        title="Privacy Policy"
        description="This Privacy Policy explains how EM Insights collects, uses and protects information provided by users of the website."
      />

      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm space-y-8 text-slate-600 leading-8">
        <section>
          <h2 className="text-2xl font-black text-ink">1. Who We Are</h2>
          <p className="mt-3">
            EM Insights is a news, analysis and media platform operating under Independent Media Group UK Limited.
            We publish editorial reporting, analysis, interviews, media content and related communications material.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black text-ink">2. Information We Collect</h2>
          <p className="mt-3">
            We may collect information you provide directly, such as your name, email address, contact details
            and any information submitted through contact forms, subscriptions or membership enquiries.
          </p>
          <p className="mt-3">
            We may also collect technical information such as browser type, device information, pages visited,
            referral information and website usage data for analytics, security and service improvement.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black text-ink">3. How We Use Information</h2>
          <p className="mt-3">
            We use collected information to operate the website, respond to enquiries, improve services,
            communicate with users, manage subscriptions or memberships, and maintain website security and functionality.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black text-ink">4. Cookies and Analytics</h2>
          <p className="mt-3">
            EM Insights may use cookies or similar technologies to enhance user experience, understand website performance
            and improve content delivery. You may control cookies through your browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black text-ink">5. Data Sharing</h2>
          <p className="mt-3">
            We do not sell personal data. Information may be shared with trusted service providers only where necessary
            for hosting, analytics, communications, payment support or website operations, subject to appropriate safeguards.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black text-ink">6. Data Security</h2>
          <p className="mt-3">
            We take reasonable technical and organizational measures to protect information against unauthorized access,
            misuse, disclosure or loss. However, no online system can guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black text-ink">7. Your Rights</h2>
          <p className="mt-3">
            Depending on applicable law, you may have rights to request access to, correction of, or deletion of your personal data.
            You may contact us regarding privacy-related requests.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black text-ink">8. Contact</h2>
          <p className="mt-3">
            For privacy questions, please contact us at info@londonpost.news or write to:
            201 Flaxton Road, London, SE18 2EY, United Kingdom.
          </p>
        </section>
      </div>
    </div>
  );
}