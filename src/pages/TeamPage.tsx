import { SectionHeading } from '../components/SectionHeading';

import majidKhanImg from '../assets/majid-khan.jpg';
import ibraheemImg from '../assets/mohammad-ibraheem-abdullah.jpg';
import gevorgImg from '../assets/gevorg-melikyan.jpg';
import belaKoganImg from '../assets/bela-kogan.jpg';
import mariaBatzImg from '../assets/maria-batz.jpg';
import stephenBlandImg from '../assets/stephen-bland.jpg';
import neilWatsonImg from '../assets/neil-watson.jpg';
import razaSyedImg from '../assets/raza-syed.jpg';
import agnieszkaImg from '../assets/agnieszka-kuchnia-wolosiewicz.jpg';
import risolatImg from '../assets/risolat-makhsimova.jpg';
import aliAouicheImg from '../assets/ali-aouiche.jpg';
import samirHumbatovImg from '../assets/samir-humbatov.jpg';
import praveshGuptaImg from '../assets/pravesh-kumar-gupta.jpg';
import sumaiyaAliImg from '../assets/sumaiya-ali.jpg';
import utkirAlimovImg from '../assets/utkir-alimov.jpg';
import katsuhiroAsagiriImg from '../assets/katsuhiro-asagiri.jpg';

type TeamMember = {
  name: string;
  role: string;
  bio: string;
  image: string;
  countries?: { name: string; code: string }[];
};

type TeamSection = {
  title: string;
  members: TeamMember[];
};

const flagUrl = (code: string) =>
  `https://flagcdn.com/w40/${code.toLowerCase()}.png`;

const teamSections: TeamSection[] = [
  {
    title: 'Managing Editor',
    members: [
      {
        name: 'Raza Syed',
        role: 'Managing Editor',
        image: razaSyedImg,
        countries: [{ name: 'United Kingdom', code: 'gb' }],
        bio: 'A senior British journalist from a Pakistani background with experience in international journalism across several countries. Mr. Raza has strong command of Central Asia and South Asia, maintains over thirty years of experience in journalism, and holds three Master’s-level degrees in different fields of journalism from the UK.',
      },
    ],
  },
  
  {
    title: 'Writers & Analysts',
    members: [
      {
        name: 'Dr. Majid Khan',
        role: 'Bureau Chief (London Post for Australia) / Writer and Analyst',
        image: majidKhanImg,
        countries: [{ name: 'Australia', code: 'au' }],
        bio: 'A PhD scholar of media and international journalism from Australia. He writes on psychological warfare, image warfare, propaganda and image building. He has experience in teaching and journalism in Pakistan, England and Australia.',
      },
      {
        name: 'Dr. Mohammad Ibraheem Abdullah',
        role: 'Writer and Analyst',
        image: ibraheemImg,
        countries: [{ name: 'Iraq', code: 'iq' }],
        bio: 'Iraqi journalist and lecturer at Baghdad University, holding a PhD in media and political communication from RMIT University, Melbourne, Australia.',
      },
      {
        name: 'Dr. Gevorg Melikyan',
        role: 'Writer and Analyst',
        image: gevorgImg,
        countries: [{ name: 'Armenia', code: 'am' }],
        bio: 'Policy analyst and former political advisor to the President of Armenia (2018–22), with expertise in foreign and security policy, international relations, military alliances, post-Soviet studies, conflict management, and hybrid warfare.',
      },
      {
        name: 'Dr. Bela Kogan',
        role: 'Writer and Analyst',
        image: belaKoganImg,
        countries: [{ name: 'Kazakhstan', code: 'kz' }],
        bio: 'A senior journalist from Kazakhstan, currently working as a co-producer at Headlines Pictures, London. She holds a PhD in sociology from Moscow Lomonosov State University and an MBA from the University of Notre Dame, Indiana.',
      },
      {
        name: 'Maria Batz',
        role: 'Writer and Analyst',
        image: mariaBatzImg,
        countries: [{ name: 'Belarus', code: 'by' }],
        bio: 'Maria Batz is from Belarus. She is an interviewer and event manager with international experience and has worked as a journalist and editor-in-chief in local media while also collaborating with press offices.',
      },
      {
        name: 'Stephen M. Bland',
        role: 'Writer and Analyst',
        image: stephenBlandImg,
        bio: 'Freelance journalist, award-winning author, travel writer, researcher and editor specialized in Central Asia and the Caucasus.',
      },
      {
        name: 'Neil Watson',
        role: 'Writer and Analyst',
        image: neilWatsonImg,
        bio: 'Media professional, editor and journalist with 25 years of international experience in interviewing, writing, editing and proofreading, as well as moderating events, conferences, and exhibitions.',
      },
    ],
  },
  {
    title: 'Correspondents',
    members: [
      {
        name: 'Agnieszka Kuchnia Wołosiewicz',
        role: 'Cultural Correspondent',
        image: agnieszkaImg,
        countries: [
          { name: 'Poland', code: 'pl' },
          { name: 'United Kingdom', code: 'gb' },
        ],
        bio: 'Writer, poet, journalist and teacher. She was born in Poland and lives in England.',
      },
      {
        name: 'Risolat Makhsimova',
        role: 'Correspondent',
        image: risolatImg,
        countries: [{ name: 'Uzbekistan', code: 'uz' }],
        bio: 'A dedicated journalist and seasoned media manager from Uzbekistan with strong experience in print and digital media. She currently serves at My5 Television Company and has produced more than 500 media articles.',
      },
      {
        name: 'Ali Aouiche',
        role: 'Correspondent',
        image: aliAouicheImg,
        countries: [{ name: 'Algeria', code: 'dz' }],
        bio: 'A journalist from Tindouf, Algeria, with a master’s degree in public law. Since 2008, he has worked as a newspaper correspondent in Tindouf and the Sahrawi refugee camps and has also produced reports for BBC Arabic.',
      },
    ],
  },
  {
    title: 'Political Analysts & Regional Experts',
    members: [
      {
        name: 'Samir Humbatov',
        role: 'Political Analyst and Expert of CIS Region',
        image: samirHumbatovImg,
        countries: [{ name: 'Azerbaijan', code: 'az' }],
        bio: 'Head of the Center for International Relations and Diplomatic Studies Azerbaijan. He is a doctoral student in Political Sciences and International Relations and has attended more than 70 international conferences, authoring around 90 scientific articles and writings.',
      },
      {
        name: 'Dr. Pravesh Kumar Gupta',
        role: 'Head of Indian Section',
        image: praveshGuptaImg,
        countries: [{ name: 'India', code: 'in' }],
        bio: 'Senior Research Associate at Vivekananda International Foundation, New Delhi, with a doctoral degree in Central Asian Studies from Jawaharlal Nehru University. His interests include Central Asia, South Asia, geopolitics, and energy security.',
      },
      {
        name: 'Sumaiya Ali',
        role: 'South Asia Writer and Analyst',
        image: sumaiyaAliImg,
        countries: [{ name: 'India', code: 'in' }],
        bio: 'A journalist based in New Delhi, India. Her expertise includes minority, gender and human rights reporting. She has previously worked with BBC and has been published across multiple BBC platforms.',
      },
      {
        name: 'UTKIR ALIMOV',
        role: 'Analyst',
        image: utkirAlimovImg,
        countries: [{ name: 'Uzbekistan', code: 'uz' }],
        bio: 'Deputy Editor-in-Chief of the International Department of the Uzbekistan National News Agency (UzA).',
      },
    ],
  },
  {
    title: 'Regional Bureau Leadership',
    members: [
      {
        name: 'Katsuhiro Asagiri',
        role: 'Bureau Chief, Far East Region',
        image: katsuhiroAsagiriImg,
        countries: [{ name: 'Japan', code: 'jp' }],
        bio: 'A senior Japanese journalist and multimedia expert with experience across 47 countries. He holds a Master’s in Development Administration from Western Michigan University, USA, and has contributed to international policy dialogue and development journalism in Japan, the USA and Asia.',
      },
    ],
  },
];

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

function MemberCard({ member }: { member: TeamMember }) {
  return (
    <article className="group h-full rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex flex-col items-center text-center">
        <img
          src={member.image}
          alt={member.name}
          className="h-28 w-28 rounded-full object-cover ring-4 ring-white shadow-lg"
        />

        <FlagBadges countries={member.countries} />

        <div className="mt-5">
          <h3 className="text-xl font-bold text-ink">{member.name}</h3>
          <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.28em] text-accent">
            {member.role}
          </p>
          <p className="mt-4 text-sm leading-7 text-slate-600">{member.bio}</p>
        </div>
      </div>
    </article>
  );
}

export function TeamPage() {
  return (
    <div className="bg-gradient-to-b from-white to-slate-50">
      <section className="mx-auto max-w-7xl px-4 py-14 lg:px-6 lg:py-16">
        <div className="max-w-3xl">
          <SectionHeading eyebrow="About Us" title="Our Team" description="" />
        </div>

        <div className="mt-12 space-y-10">
          {teamSections.map((section) => (
            <section
              key={section.title}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:p-8"
            >
              <div className="mx-auto max-w-3xl text-center">
                <div className="text-[11px] font-bold uppercase tracking-[0.34em] text-accent">
                  Em Insights Post Team
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
                  <MemberCard key={`${section.title}-${member.name}`} member={member} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}
