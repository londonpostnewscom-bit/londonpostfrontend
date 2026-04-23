import { Link } from 'react-router-dom';
import { SectionHeading } from '../components/SectionHeading';

const cards = [
  ['Our Team', '/about/team', 'Leadership, editorial, advisory and growth teams.'],
  ['Our Researchers', '/about/researchers', 'Specialists driving briefings, explainers and regional expertise.'],
  ['What We Do', '/about/what-we-do', 'How journalism, research and events come together.'],
];

export function AboutLandingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 lg:px-6">
      <SectionHeading eyebrow="About" title="A modern editorial institution with global focus" description="Use this landing page to introduce your publication, editorial values and specialist teams." />
      <div className="grid gap-6 md:grid-cols-3">
        {cards.map(([title, href, description]) => (
          <Link key={title} to={href} className="rounded-[2rem] border border-slate-200 p-8 transition hover:-translate-y-1 hover:shadow-soft">
            <div className="text-2xl font-bold text-ink">{title}</div>
            <p className="mt-3 text-slate-600">{description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
