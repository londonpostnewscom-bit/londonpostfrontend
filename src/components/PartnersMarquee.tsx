import Partner1 from '../assets/partnerLp1.png';
import Partner2 from '../assets/partnerLp2.png';
import Partner3 from '../assets/partnerLp3.png';

type PartnerLogo = {
  name: string;
  src: string;
  className?: string;
};

const partners: PartnerLogo[] = [
  { name: 'Partner 1', src: Partner1, className: 'h-14 w-auto md:h-16' },
  { name: 'Partner 2', src: Partner2, className: 'h-16 w-auto md:h-20' },
  { name: 'Partner 3', src: Partner3, className: 'h-20 w-auto md:h-24' },

  { name: 'Partner 1 Repeat', src: Partner1, className: 'h-14 w-auto md:h-16' },
  { name: 'Partner 2 Repeat', src: Partner2, className: 'h-16 w-auto md:h-20' },
  { name: 'Partner 3 Repeat', src: Partner3, className: 'h-20 w-auto md:h-24' },
];

function LogoCard({ logo }: { logo: PartnerLogo }) {
  return (
    <div className="partner-card mx-4 flex min-w-[220px] items-center justify-center rounded-[2rem] border border-slate-200 bg-white px-10 py-7 shadow-sm transition duration-300 md:min-w-[280px]">
      <img
        src={logo.src}
        alt={logo.name}
        className={`max-w-full object-contain transition duration-300 ${logo.className || 'h-16 w-auto md:h-20'}`}
      />
    </div>
  );
}

export function PartnersMarquee() {
  const loopedPartners = [...partners, ...partners];

  return (
    <section className="relative overflow-hidden border-t border-slate-100 bg-gradient-to-b from-white to-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="mb-10 text-center">
          <span className="inline-block rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
            Partners
          </span>

          <h2 className="mt-4 text-4xl font-black leading-tight text-ink lg:text-5xl">
            Our Trusted Partners
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-slate-500">
            We collaborate with respected brands and organizations across industries.
          </p>
        </div>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white to-transparent md:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white to-transparent md:w-32" />

        <div className="overflow-hidden">
          <div className="partners-marquee flex w-max items-center py-4">
            {loopedPartners.map((logo, index) => (
              <LogoCard key={`${logo.name}-${index}`} logo={logo} />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .partners-marquee {
          animation: partners-marquee 28s linear infinite;
        }

        .partners-marquee:hover {
          animation-play-state: paused;
        }

        .partner-card:hover {
          animation: partner-bounce 0.6s ease;
          transform: translateY(-8px);
          box-shadow: 0 18px 40px rgba(15, 23, 42, 0.10);
          border-color: rgba(59, 130, 246, 0.25);
        }

        @keyframes partners-marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes partner-bounce {
          0% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-10px);
          }
          55% {
            transform: translateY(-4px);
          }
          75% {
            transform: translateY(-8px);
          }
          100% {
            transform: translateY(-6px);
          }
        }
      `}</style>
    </section>
  );
}