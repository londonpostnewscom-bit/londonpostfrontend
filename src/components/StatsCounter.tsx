import { useEffect, useRef, useState } from 'react';
import { formatNumber } from '../utils/helpers';

function Counter({
  value,
  label,
  index,
}: {
  value: number;
  label: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let frame = 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setDisplay(0);
          cancelAnimationFrame(frame);
          return;
        }

        const start = performance.now();
        const duration = 1400;

        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(Math.floor(eased * value));

          if (progress < 1) {
            frame = requestAnimationFrame(tick);
          }
        };

        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.35 },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <div
      ref={ref}
      className="animate-stat-bounce relative overflow-hidden rounded-[1.75rem] border border-[#d6ddeb] bg-[#4568bd] p-6 text-white shadow-[0_10px_25px_rgba(15,45,122,0.10)] sm:p-7 xl:p-8"
      style={{
        animationDelay: `${index * 0.45}s`,
        animationDuration: '2.4s',
        animationIterationCount: 'infinite',
      }}
    >
      <div className="relative">
        <div className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/80">
          Impact
        </div>

        <div className="text-4xl font-black tracking-tight text-white sm:text-5xl xl:text-[3.25rem]">
          {formatNumber(display)}+
        </div>

        <div className="mt-4 text-[11px] font-medium uppercase tracking-[0.35em] text-white/75 sm:text-xs">
          {label}
        </div>
      </div>
    </div>
  );
}

export function StatsCounter({
  stats,
}: {
  stats: { label: string; value: number }[];
}) {
  return (
    <>
      <style>
        {`
          @keyframes statBounce {
            0%, 100% {
              transform: translateY(0);
            }
            20% {
              transform: translateY(-10px);
            }
            35% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-6px);
            }
            65% {
              transform: translateY(0);
            }
          }

          .animate-stat-bounce {
            animation-name: statBounce;
            animation-timing-function: ease-in-out;
          }
        `}
      </style>

      <section className="relative overflow-hidden rounded-[2.5rem] bg-[#e2e8f0] px-5 py-10 text-white sm:px-8 sm:py-12 lg:px-10 lg:py-14 xl:px-12 xl:py-16">
        <div className="relative">
          <div className="flex justify-center text-center">
            <h2 className="text-3xl font-black tracking-tight text-[#f4c542] sm:text-4xl lg:text-5xl">
              Impact
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat, index) => (
              <Counter key={stat.label} {...stat} index={index} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}