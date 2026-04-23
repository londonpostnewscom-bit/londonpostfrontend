import { SectionHeading } from '../components/SectionHeading';
import { whatWeDo } from '../data/siteData';

const objectives = [
  'Positive image building in print and electronic media.',
  'Positive image building among academia and research scholars in universities and research centres.',
  'Increase and enhance a friendly network of international journalists, writers and researchers.',
  'Provide training and coaching to young as well as existing journalists and media professionals to respond to hostile international media narratives.',
  'Provide training, coaching, mentoring and supervision to journalists and media professionals.',
];

const resources = [
  'A fully functioning news and media platform based in the heart of London to engage journalists and writers.',
  'A neutral and independent media platform for positive image building and international perception shaping.',
  'An opportunity to interact, engage and build a network of professional writers, journalists and commentators.',
  'Published material and interviews that can support researchers, academics, diplomats and policy writers working across international forums.',
  'A platform that helps strengthen credibility, improve public perception and support proactive communication instead of reactive damage control.',
  'A base for developing a network of professional consultants, writers, media specialists and journalists.',
];

export function WhatWeDoPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 lg:px-6">
      <SectionHeading
        eyebrow="About Us"
        title="What We Do"
        description="EM Insights is an editorial, media and strategic communications platform focused on reporting, analysis, research and professional media support."
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="text-sm font-bold uppercase tracking-[0.3em] text-accent">
            EM Insights
          </div>
          <h2 className="mt-4 text-3xl font-black text-ink">
            Independent reporting, analysis and media strategy
          </h2>
          <div className="mt-5 space-y-4 text-slate-600 leading-8">
            <p>
              EM Insights is a modern news and analysis platform formerly operating under
              The London Post identity. The publication is focused on exclusive stories,
              international affairs, strategic communication and region-based reporting.
            </p>
            <p>
              The platform also supports broader media activity including digital journalism,
              interviews, web-based broadcasting, documentary production and communications advisory work.
            </p>
            <p>
              Through its wider media network, EM Insights supports media houses, diplomatic missions,
              governments, institutions and corporate clients with communication strategy, media engagement,
              crisis communication and reputation support.
            </p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm">
          <div className="text-sm font-bold uppercase tracking-[0.3em] text-accent">
            Contact
          </div>
          <h3 className="mt-4 text-2xl font-black text-ink">Further Info</h3>
          <div className="mt-5 space-y-4 text-slate-600">
            <p>201 Flaxton Road, London, SE18 2EY, United Kingdom</p>
            {/* <p>info@londonpost.news</p> */}
            <p>Independent Media Group UK Limited</p>
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="text-sm font-bold uppercase tracking-[0.3em] text-accent">
            Our Media Arms
          </div>
          <div className="mt-6 grid gap-5">
            {whatWeDo.map((item, index) => (
              <div
                key={item}
                className="rounded-[1.5rem] border border-slate-100 bg-slate-50 p-5"
              >
                <div className="text-xs font-bold uppercase tracking-[0.3em] text-accent">
                  0{index + 1}
                </div>
                <p className="mt-2 text-lg font-semibold text-ink">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="text-sm font-bold uppercase tracking-[0.3em] text-accent">
              Aims & Objectives
            </div>
            <div className="mt-6 space-y-4">
              {objectives.map((item, index) => (
                <div key={item} className="flex gap-4">
                  <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent">
                    {index + 1}
                  </div>
                  <p className="text-slate-600 leading-7">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="text-sm font-bold uppercase tracking-[0.3em] text-accent">
              Resources & Impact
            </div>
            <div className="mt-6 space-y-4">
              {resources.map((item, index) => (
                <div key={item} className="flex gap-4">
                  <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {index + 1}
                  </div>
                  <p className="text-slate-600 leading-7">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}