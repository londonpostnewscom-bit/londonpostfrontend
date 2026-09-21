

import Partner1 from '../assets/partnerLp1.png';
import Partner2 from '../assets/partnerLp2.png';
import Partner3 from '../assets/partnerLp3.png';
import Partner4 from '../assets/partnerLp4.png';
import Partner5 from '../assets/partnerLp5.png';
type PartnerLogo = {
  name: string;
  src: string;
  className?: string;
};

const partners: PartnerLogo[] = [
  { name: 'Partner 1', src: Partner1, className: 'h-12 w-auto md:h-14' },
  { name: 'Partner 2', src: Partner2, className: 'h-14 w-auto md:h-16' },
  { name: 'Partner 3', src: Partner3, className: 'h-16 w-auto md:h-20' },
   { name: 'Partner 4', src: Partner4, className: 'h-16 w-auto md:h-20' },
   { name: 'Partner 5', src: Partner5, className: 'h-16 w-auto md:h-20' },

  { name: 'Partner 1 Repeat', src: Partner1, className: 'h-12 w-auto md:h-14' },
  { name: 'Partner 2 Repeat', src: Partner2, className: 'h-14 w-auto md:h-16' },
  { name: 'Partner 3 Repeat', src: Partner3, className: 'h-16 w-auto md:h-20' },
  { name: 'Partner 4 Repeat', src: Partner4, className: 'h-16 w-auto md:h-20' },
  { name: 'Partner 5 Repeat', src: Partner5, className: 'h-16 w-auto md:h-20' },
];

function LogoCard({ logo }: { logo: PartnerLogo }) {
  return (
    <div className="partner-card mx-4 flex min-w-[220px] items-center justify-center rounded-lg border border-gold/20 bg-white px-10 py-7 transition duration-300 md:min-w-[260px]">
      <img
        src={logo.src}
        alt={logo.name}
        className={`max-w-full object-contain  transition duration-300 group-hover:grayscale-0 ${logo.className || 'h-14 w-auto md:h-16'}`}
      />
    </div>
  );
}

export function PartnersMarquee() {
  const loopedPartners = [...partners, ...partners];

  return (
    <section className="relative overflow-hidden border-t border-gold/15 bg-soft py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="mb-10 text-center">
          <div className="mx-auto h-[3px] w-9 rounded-full bg-gold" />
          <h2 className="mt-4 text-[1.75rem] font-extrabold tracking-tight text-ink lg:text-[2.25rem]">
            Our Trusted Partners
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[0.95rem] leading-relaxed text-slate-500">
            We collaborate with respected brands and organizations across industries.
          </p>
        </div>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-soft to-transparent md:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-soft to-transparent md:w-32" />

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
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(11, 18, 32, 0.08);
          border-color: rgba(201, 147, 47, 0.4);
        }

        @keyframes partners-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @media (prefers-reduced-motion: reduce) {
          .partners-marquee { animation: none; }
        }
      `}</style>
    </section>
  );
}
