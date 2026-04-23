import { SectionHeading } from '../components/SectionHeading';

export function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 lg:px-6">
      <SectionHeading
        eyebrow="Legal"
        title="Disclaimer"
        description="This Disclaimer explains the limits of responsibility relating to the content published on EM Insights."
      />

      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm space-y-8 text-slate-600 leading-8">
        <section>
          <h2 className="text-2xl font-black text-ink">1. Editorial and Informational Content</h2>
          <p className="mt-3">
            Content on EM Insights is published for news, editorial, informational, research and commentary purposes.
            While we aim for accuracy and professionalism, we do not guarantee that all content is complete, current or error-free.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black text-ink">2. No Professional Advice</h2>
          <p className="mt-3">
            Nothing on this website constitutes legal, financial, diplomatic, media, strategic or other professional advice.
            Readers should seek independent advice before acting on information published on the website.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black text-ink">3. Opinions and Third-Party Material</h2>
          <p className="mt-3">
            Opinions expressed by authors, analysts, contributors or interviewees are their own unless explicitly stated otherwise.
            EM Insights may publish third-party viewpoints for public interest, discussion or editorial purposes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black text-ink">4. External Sources and Links</h2>
          <p className="mt-3">
            We may reference or link to external websites, organizations, platforms or resources.
            We do not control and are not responsible for the accuracy, legality or reliability of third-party content.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black text-ink">5. Limitation of Responsibility</h2>
          <p className="mt-3">
            EM Insights, its parent company, editors and contributors are not responsible for losses, decisions, damages or consequences
            arising from the use of this website or reliance on its published material.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black text-ink">6. Contact</h2>
          <p className="mt-3">
            {/* For clarification about any published material or legal page, please contact us at info@londonpost.news. */}
          </p>
        </section>
      </div>
    </div>
  );
}