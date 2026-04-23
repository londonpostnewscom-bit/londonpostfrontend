import { SectionHeading } from '../components/SectionHeading';

export function TermsAndConditionsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 lg:px-6">
      <SectionHeading
        eyebrow="Legal"
        title="Terms & Conditions"
        description="These Terms & Conditions govern the use of the EM Insights website and its content."
      />

      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm space-y-8 text-slate-600 leading-8">
        <section>
          <h2 className="text-2xl font-black text-ink">1. Acceptance of Terms</h2>
          <p className="mt-3">
            By accessing or using this website, you agree to be bound by these Terms & Conditions.
            If you do not agree, you should not use the website.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black text-ink">2. Use of Content</h2>
          <p className="mt-3">
            All editorial material, articles, videos, graphics, branding and website content are provided for lawful personal,
            informational and professional use unless otherwise stated.
          </p>
          <p className="mt-3">
            You may not reproduce, republish, distribute, alter or commercially exploit website material without prior written permission.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black text-ink">3. Editorial Independence</h2>
          <p className="mt-3">
            EM Insights publishes reporting, analysis, commentary and multimedia content. Views expressed in certain opinion pieces,
            interviews or external contributions may belong to the respective authors or contributors.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black text-ink">4. Website Availability</h2>
          <p className="mt-3">
            We aim to keep the website available and up to date, but we do not guarantee uninterrupted access, complete accuracy,
            or that all information will always be current or error-free.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black text-ink">5. External Links</h2>
          <p className="mt-3">
            The website may include links to third-party websites or services. EM Insights is not responsible for the content,
            policies or practices of external sites.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black text-ink">6. User Conduct</h2>
          <p className="mt-3">
            Users must not misuse the website, attempt unauthorized access, distribute harmful code,
            or use the platform in any way that violates law or harms the website, its services or its reputation.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black text-ink">7. Limitation of Liability</h2>
          <p className="mt-3">
            To the maximum extent permitted by law, EM Insights and its operators shall not be liable for any direct,
            indirect, incidental or consequential loss arising from use of the website or reliance on its content.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black text-ink">8. Changes to Terms</h2>
          <p className="mt-3">
            We may revise these Terms & Conditions from time to time. Continued use of the website after updates
            constitutes acceptance of the revised terms.
          </p>
        </section>
      </div>
    </div>
  );
}