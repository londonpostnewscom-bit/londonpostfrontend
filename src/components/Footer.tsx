// import { Link } from 'react-router-dom';
// import { footerLinks } from '../data/siteData';
// import { SocialLinks } from './SocialLinks';
// // import footerLogo from '../assets/londonpost.png';
// import footerLogo from '../assets/emlogo.png';

// export function Footer() {
//   return (
//     <footer className="mt-20 bg-[linear-gradient(180deg,#f6b1b1_0%,#ef9a9a_28%,#2550c8_62%,#1e3a8a_100%)] lg:bg-[linear-gradient(90deg,#f6b1b1_0%,#ef9a9a_32%,#2550c8_32%,#1e3a8a_100%)]">
//       <div className="mx-auto grid max-w-7xl gap-10  px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr,1.95fr] lg:gap-12 lg:px-6 lg:py-16">
//         <div className="text-center lg:pr-10 lg:text-left">
//           <img
//             src={footerLogo}
//             alt="EM Insights"
//             className="mx-auto h-14 w-auto object-contain sm:h-16 lg:mx-0"
//           />

//           <p className="mx-auto mt-6 max-w-md text-sm leading-8 text-slate-900/80 sm:text-base lg:mx-0 ">
//             EM Insights is a modern editorial platform focused on analysis,
//             diplomacy, strategic communication, media research and region-based reporting.
//           </p>

//           <div className="mt-8 flex justify-center lg:justify-start">
//             <SocialLinks />
//           </div>
//         </div>

//         <div className="rounded-[2rem] border border-white/15 bg-white/8 p-6 backdrop-blur-[2px] sm:p-8">
//           <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
//             {Object.entries(footerLinks).map(([title, items]) => (
//               <div key={title} className="text-center sm:text-left">
//                 <h4 className="text-sm font-bold uppercase tracking-widest text-white">
//                   {title}
//                 </h4>

//                 <div className="mt-4 grid gap-3">
//                   {items.map((item) => (
//                     <Link
//                       key={item.label}
//                       to={item.to}
//                       className="text-[15px] text-blue-50/90 transition hover:text-white hover:underline"
//                     >
//                       {item.label}
//                     </Link>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="border-t border-white/10 bg-slate-950/12 px-4 py-5 text-center text-sm text-white/80">
//         © 2026 EM Insights. All rights reserved.
//       </div>
//     </footer>
//   );
// } 


import { Link } from 'react-router-dom';
import { footerLinks } from '../data/siteData';
import { SocialLinks } from './SocialLinks';
import footerLogo from '../assets/emlogo.png';

export function Footer() {
  return (
    <footer className="mt-20 bg-[linear-gradient(180deg,#f6b1b1_0%,#ef9a9a_28%,#2550c8_62%,#1e3a8a_100%)] lg:bg-[linear-gradient(90deg,#f6b1b1_0%,#ef9a9a_32%,#2550c8_32%,#1e3a8a_100%)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.9fr,2.1fr] lg:gap-12 lg:px-6 lg:py-16">
        <div className="text-center lg:pr-6 lg:text-left">
          <img
            src={footerLogo}
            alt="EM Insights"
            className="mx-auto h-24 w-auto object-contain sm:h-28 lg:mx-0 lg:h-32"
          />

          <p className="mx-auto mt-6 max-w-[420px] text-sm leading-8 text-slate-900/80 sm:text-base lg:mx-0">
            EM Insights is a modern editorial platform focused on analysis,
            diplomacy, strategic communication, media research and region-based reporting.
          </p>

          <div className="mt-8 flex justify-center lg:justify-start">
            <SocialLinks />
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/15 bg-white/8 p-6 backdrop-blur-[2px] sm:p-8 lg:ml-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(footerLinks).map(([title, items]) => (
              <div key={title} className="text-center sm:text-left">
                <h4 className="text-sm font-bold uppercase tracking-widest text-white">
                  {title}
                </h4>

                <div className="mt-4 grid gap-3">
                  {items.map((item) => (
                    <Link
                      key={item.label}
                      to={item.to}
                      className="text-[15px] text-blue-50/90 transition hover:text-white hover:underline"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-slate-950/12 px-4 py-5 text-center text-sm text-white/80">
        © 2026 EM Insights. All rights reserved.
      </div>
    </footer>
  );
}