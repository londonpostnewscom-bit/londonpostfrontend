import { useEffect, useState } from 'react';
import { SectionHeading } from '../components/SectionHeading';
import { PageSkeleton } from '../components/PageSkeleton';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

type TeamMember = {
  _id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  countries?: { name: string; code: string }[];
};

type TeamSection = {
  title: string;
  members: TeamMember[];
};

let teamCache: TeamSection[] | null = null;

const flagUrl = (code: string) => `https://flagcdn.com/w40/${code.toLowerCase()}.png`;

function FlagBadges({ countries }: { countries?: { name: string; code: string }[] }) {
  if (!countries?.length) return null;

  return (
    <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
      {countries.map((country) => (
        <span
          key={`${country.code}-${country.name}`}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700"
        >
          <img
            src={flagUrl(country.code)}
            alt={country.name}
            className="h-3.5 w-5 rounded-[2px] object-cover shadow-sm"
          />
          <span>{country.name}</span>
        </span>
      ))}
    </div>
  );
}

// Bios vary a lot in length — some (the original seeded team) are a
// couple of sentences, others added later run much longer and would
// otherwise stretch cards to very different heights and break the grid's
// visual rhythm.
//
// Truncated by CHARACTER COUNT in plain JS rather than with a CSS
// line-clamp utility. line-clamp-N depends on either Tailwind 3.3+'s
// built-in support or the separate @tailwindcss/line-clamp plugin being
// installed and active — if either isn't the case in this project, the
// class silently does nothing (no error, no visual effect at all), which
// is exactly the "still shows the full bio" symptom. Slicing the string
// directly has no such dependency: it either shows the whole bio or a
// shortened one, unconditionally, regardless of Tailwind config.
const BIO_TRUNCATE_LENGTH = 220;

function Bio({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);

  if (!text) return null;

  const needsTruncation = text.length > BIO_TRUNCATE_LENGTH;
  const shown = expanded || !needsTruncation
    ? text
    : text.slice(0, BIO_TRUNCATE_LENGTH).trimEnd() + '…';

  return (
    <div>
      <p className="mt-4 text-sm leading-7 text-slate-600">{shown}</p>
      {needsTruncation && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 text-xs font-bold uppercase tracking-wide text-accent hover:underline"
        >
          {expanded ? 'Read Less' : 'Read More'}
        </button>
      )}
    </div>
  );
}

function MemberCard({ member }: { member: TeamMember }) {
  return (
    <article className="group h-full rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex flex-col items-center text-center">
        {member.imageUrl ? (
          <img
            src={member.imageUrl}
            alt={member.name}
            className="h-28 w-28 rounded-full object-cover ring-4 ring-white shadow-lg"
          />
        ) : (
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-slate-100 text-2xl font-bold text-slate-400 ring-4 ring-white shadow-lg">
            {member.name.charAt(0)}
          </div>
        )}

        <FlagBadges countries={member.countries} />

        <div className="mt-5">
          <h3 className="text-xl font-bold text-ink">{member.name}</h3>
          <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.28em] text-accent">
            {member.role}
          </p>
          <Bio text={member.bio} />
        </div>
      </div>
    </article>
  );
}

export function TeamPage() {
  const [sections, setSections] = useState<TeamSection[]>(teamCache || []);
  const [loading, setLoading] = useState(teamCache === null);

  useEffect(() => {
    if (teamCache) return;
    fetch(`${API_URL}/team`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        teamCache = data;
        setSections(data);
      })
      .catch(() => { if (!teamCache) setSections([]); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageSkeleton />;

  return (
    <div className="bg-gradient-to-b from-white to-slate-50">
      <section className="mx-auto max-w-7xl px-4 py-14 lg:px-6 lg:py-16">
        {/* Centered per request — was left-aligned before */}
        <div className="mx-auto max-w-3xl text-center">
          <SectionHeading eyebrow="About Us" title="Our Team" description="" />
        </div>

        <div className="mt-12 space-y-10">
          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:p-8"
            >
              <div className="mx-auto max-w-3xl text-center">
                <div className="text-[11px] font-bold uppercase tracking-[0.34em] text-accent">
                  London Post Team
                </div>
                <h2 className="mt-3 text-2xl font-bold text-ink lg:text-3xl">
                  {section.title}
                </h2>
              </div>

              <div
                className={`mt-8 grid gap-6 ${
                  section.members.length === 1
                    ? 'mx-auto max-w-md grid-cols-1'
                    : section.members.length === 2
                    ? 'mx-auto max-w-4xl grid-cols-1 md:grid-cols-2'
                    : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                }`}
              >
                {section.members.map((member) => (
                  <MemberCard key={member._id} member={member} />
                ))}
              </div>
            </section>
          ))}

          {sections.length === 0 && (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 p-16 text-center text-slate-400">
              <p className="text-lg font-semibold">No team members yet</p>
              <p className="mt-2 text-sm">Add members from Admin → Team members Record</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
