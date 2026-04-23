import { SectionHeading } from '../components/SectionHeading';
import { researchers } from '../data/siteData';

export function ResearchersPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 lg:px-6">
      <SectionHeading eyebrow="About Us" title="Our Researchers" description="Use this page to introduce your fellows, contributors and analysts by domain, region or thematic expertise." />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {researchers.map((item, index) => (
          <div key={item} className="rounded-[2rem] border border-slate-200 p-8 shadow-sm">
            <div className="mb-6 h-24 w-24 rounded-full bg-gradient-to-br from-primary to-accent" />
            <div className="text-2xl font-bold text-ink">Researcher {index + 1}</div>
            <div className="mt-2 font-medium text-primary">{item}</div>
            <p className="mt-4 text-slate-600">Replace this with individual bios, publications, region tags and external profile links.</p>
          </div>
        ))}
      </div>
    </div>
  );
}
