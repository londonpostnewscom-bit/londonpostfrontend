// import { useEffect, useMemo, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { navigation, regionMenus } from '../data/siteData';
// import { CloseIcon, MenuIcon } from './Icons';
// import { SearchBox } from './SearchBox';
// import  logo1  from '../assets/londonpost.png';
// import { SocialLinks } from './SocialLinks';
// import { DropdownPanel } from './DropdownPanel';

// type DropdownItem = { name: string; slug: string };

// type NavItem = {
//   name: string;
//   slug: string;
//   children?: DropdownItem[];
// };

// type ToastState = {
//   show: boolean;
//   title: string;
//   message: string;
// };

// const regionDropdowns: Record<string, DropdownItem[]> = {
//   '/region/asia': regionMenus.asia.map((name) => ({
//     name,
//     slug: `/region/asia/${name.toLowerCase().replace(/\s+/g, '-')}`,
//   })),
//   '/region/europe': regionMenus.europe.map((name) => ({
//     name,
//     slug: `/region/europe/${name.toLowerCase().replace(/\s+/g, '-')}`,
//   })),
//   '/region/americas': regionMenus.americas.map((name) => ({
//     name,
//     slug: `/region/americas/${name.toLowerCase().replace(/\s+/g, '-')}`,
//   })),
// };

// function LivePodcastLink({
//   to,
//   mobile = false,
//   onClick,
// }: {
//   to: string;
//   mobile?: boolean;
//   onClick?: () => void;
// }) {
//   if (mobile) {
//     return (
//       <Link
//         to={to}
//         onClick={onClick}
//         className="group relative overflow-hidden rounded-2xl border border-amber-300/80 bg-gradient-to-r from-amber-50 via-white to-orange-50 px-5 py-4 font-semibold text-slate-900 shadow-[0_10px_30px_rgba(245,158,11,0.14)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(245,158,11,0.2)]"
//       >
//         <span className="absolute inset-0 opacity-70 [background:linear-gradient(110deg,transparent,rgba(245,158,11,0.14),transparent)] [background-size:220%_100%] group-hover:animate-[lpShine_1.8s_linear_infinite]" />
//         <span className="relative flex items-center justify-between gap-3">
//           <span className="flex items-center gap-3">
//             <span className="relative flex h-3 w-3">
//               <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping" />
//               <span className="relative inline-flex h-3 w-3 rounded-full bg-red-600" />
//             </span>
//             <span>Live Podcast</span>
//           </span>
//           <span className="rounded-full bg-slate-950 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-white">
//             Live
//           </span>
//         </span>
//       </Link>
//     );
//   }

//   return (
//     <Link
//       to={to}
//       onClick={onClick}
//       className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-amber-300/80 bg-gradient-to-r from-amber-50 via-white to-orange-50 px-5 py-3 font-semibold text-slate-900 shadow-[0_10px_26px_rgba(245,158,11,0.14)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(245,158,11,0.2)]"
//     >
//       <span className="absolute inset-0 opacity-70 [background:linear-gradient(110deg,transparent,rgba(245,158,11,0.14),transparent)] [background-size:220%_100%] group-hover:animate-[lpShine_1.8s_linear_infinite]" />
//       <span className="relative flex items-center gap-3">
//         <span className="relative flex h-2.5 w-2.5">
//           <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping" />
//           <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-600" />
//         </span>
//         <span>Live Podcast</span>
//       </span>
//       <span className="relative rounded-full bg-slate-950 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-white">
//         Live
//       </span>
//     </Link>
//   );
// }

// function ChevronIcon({ open = false }: { open?: boolean }) {
//   return (
//     <svg
//       className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
//       viewBox="0 0 20 20"
//       fill="none"
//       aria-hidden="true"
//     >
//       <path
//         d="M5 7.5L10 12.5L15 7.5"
//         stroke="currentColor"
//         strokeWidth="1.8"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//     </svg>
//   );
// }

// function CheckCircleIcon() {
//   return (
//     <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
//       <path
//         d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
//         stroke="currentColor"
//         strokeWidth="1.8"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//       <path
//         d="M22 4 12 14.01l-3-3"
//         stroke="currentColor"
//         strokeWidth="1.8"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//     </svg>
//   );
// }

// function MobileAccordionItem({
//   item,
//   isOpen,
//   onToggle,
//   onNavigate,
// }: {
//   item: NavItem;
//   isOpen: boolean;
//   onToggle: () => void;
//   onNavigate: () => void;
// }) {
//   const hasChildren = !!item.children?.length;
//   const isLivePodcast = item.name === 'Live Podcast';

//   if (isLivePodcast) {
//     return <LivePodcastLink to={item.slug} mobile onClick={onNavigate} />;
//   }

//   if (!hasChildren) {
//     return (
//       <Link
//         to={item.slug}
//         onClick={onNavigate}
//         className="rounded-2xl border border-slate-200 bg-white px-5 py-4 font-semibold text-slate-900 transition hover:border-red-500 hover:bg-slate-50"
//       >
//         {item.name}
//       </Link>
//     );
//   }

//   return (
//     <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
//       <button
//         type="button"
//         onClick={onToggle}
//         className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-slate-900 transition hover:bg-slate-50"
//       >
//         <span>{item.name}</span>
//         <ChevronIcon open={isOpen} />
//       </button>

//       <div
//         className={`grid transition-all duration-300 ease-out ${
//           isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
//         }`}
//       >
//         <div className="overflow-hidden">
//           <div className="border-t border-slate-200 bg-slate-50/80 p-3">
//             <div className="grid gap-2">
//               {item.children?.map((child) => (
//                 <Link
//                   key={child.slug}
//                   to={child.slug}
//                   onClick={onNavigate}
//                   className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-red-500 hover:text-red-500"
//                 >
//                   {child.name}
//                 </Link>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export function Header() {
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [activeDropdown, setActiveDropdown] = useState<NavItem | null>(null);
//   const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({});
//   const [showCallbackModal, setShowCallbackModal] = useState(false);
//   const [toast, setToast] = useState<ToastState>({
//     show: false,
//     title: '',
//     message: '',
//   });

//   const [formData, setFormData] = useState({
//     subject: '',
//     reason: '',
//     email: '',
//   });

//   useEffect(() => {
//     const previousOverflow = document.body.style.overflow;
//     const previousTouchAction = document.body.style.touchAction;

//     if (mobileOpen || showCallbackModal) {
//       document.body.style.overflow = 'hidden';
//       document.body.style.touchAction = 'none';
//     } else {
//       document.body.style.overflow = '';
//       document.body.style.touchAction = '';
//     }

//     return () => {
//       document.body.style.overflow = previousOverflow;
//       document.body.style.touchAction = previousTouchAction;
//     };
//   }, [mobileOpen, showCallbackModal]);

//   useEffect(() => {
//     const handleEsc = (event: KeyboardEvent) => {
//       if (event.key === 'Escape') {
//         setActiveDropdown(null);
//         setMobileOpen(false);
//         setShowCallbackModal(false);
//       }
//     };

//     window.addEventListener('keydown', handleEsc);
//     return () => window.removeEventListener('keydown', handleEsc);
//   }, []);

//   useEffect(() => {
//     if (!toast.show) return;

//     const timer = window.setTimeout(() => {
//       setToast((prev) => ({ ...prev, show: false }));
//     }, 3500);

//     return () => window.clearTimeout(timer);
//   }, [toast.show]);

//   const navItems = useMemo<NavItem[]>(() => {
//     return navigation.map((item) => ({
//       ...item,
//       children: item.children || regionDropdowns[item.slug] || undefined,
//     }));
//   }, []);

//   const closeAllMenus = () => {
//     setActiveDropdown(null);
//     setMobileOpen(false);
//   };

//   const toggleMobileAccordion = (name: string) => {
//     setMobileExpanded((prev) => ({
//       ...prev,
//       [name]: !prev[name],
//     }));
//   };

//   const openCallbackModal = () => {
//     setShowCallbackModal(true);
//     setActiveDropdown(null);
//     setMobileOpen(false);
//   };

//   const closeCallbackModal = () => {
//     setShowCallbackModal(false);
//   };

//   const handleInputChange = (
//     event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = event.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     console.log('Callback form submitted:', formData);

//     setFormData({
//       subject: '',
//       reason: '',
//       email: '',
//     });

//     setShowCallbackModal(false);

//     setToast({
//       show: true,
//       title: 'Request submitted successfully',
//       message: 'Thank you. Our team will contact you shortly using the details you provided.',
//     });
//   };

//   return (
//     <>
//       <style>
//         {`
//           @keyframes lpShine {
//             0% { background-position: 200% 0; }
//             100% { background-position: -40% 0; }
//           }

//           @keyframes toastIn {
//             0% {
//               opacity: 0;
//               transform: translateY(16px) scale(0.96);
//             }
//             100% {
//               opacity: 1;
//               transform: translateY(0) scale(1);
//             }
//           }

//           @keyframes modalIn {
//             0% {
//               opacity: 0;
//               transform: translateY(18px) scale(0.98);
//             }
//             100% {
//               opacity: 1;
//               transform: translateY(0) scale(1);
//             }
//           }
//         `}
//       </style>

//       <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
//         <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-5 lg:px-6 xl:px-8">
//     <div className="flex-shrink-0">
//   <a href="/" className="flex items-center">
//     <div className="w-[260px] sm:w-[320px] lg:w-[380px]">
//       <img
//         src={logo1}
//         alt="LondonPost"
//         className="block h-auto max-h-14 w-full object-contain object-left"
//       />
//     </div>
//   </a>
// </div>

//           <div className="hidden items-center gap-4 lg:flex xl:gap-5">
//             <SocialLinks />
//             <div className="w-[240px] xl:w-[300px]">
//               <SearchBox />
//             </div>

//             <button
//               type="button"
//               onClick={openCallbackModal}
//               className="shrink-0 rounded-full bg-blue-800 px-5 py-3 font-semibold text-white shadow-[0_14px_30px_rgba(239,68,68,0.28)] transition duration-200 hover:-translate-y-0.5 hover:bg-red-600 xl:px-6"
//             >
//               Request Queries
//             </button>
//           </div>

//           <button
//             type="button"
//             aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
//             className="inline-flex shrink-0 rounded-full border border-slate-200 p-2.5 text-slate-900 transition hover:bg-slate-50 lg:hidden"
//             onClick={() => setMobileOpen((s) => !s)}
//           >
//             {mobileOpen ? <CloseIcon /> : <MenuIcon />}
//           </button>
//         </div>

//         <div
//           className="relative hidden border-t border-slate-200 lg:block"
//           onMouseLeave={() => setActiveDropdown(null)}
//         >
//           <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-6 py-3 xl:px-8">
//             {navItems.map((item) => {
//               const hasDropdown = !!item.children?.length;
//               const isActive = activeDropdown?.name === item.name;
//               const isLivePodcast = item.name === 'Live Podcast';

//               if (isLivePodcast) {
//                 return (
//                   <div
//                     key={item.name}
//                     className="shrink-0"
//                     onMouseEnter={() => setActiveDropdown(null)}
//                   >
//                     <LivePodcastLink to={item.slug} />
//                   </div>
//                 );
//               }

//               return hasDropdown ? (
//                 <button
//                   key={item.name}
//                   type="button"
//                   onMouseEnter={() => setActiveDropdown(item)}
//                   onClick={() =>
//                     setActiveDropdown((prev) => (prev?.name === item.name ? null : item))
//                   }
//                   className={`inline-flex shrink-0 items-center rounded-full px-2 py-2 text-[15px] font-semibold transition ${
//                     isActive ? 'text-red-500' : 'text-slate-800 hover:text-red-500'
//                   }`}
//                 >
//                   {item.name}
//                 </button>
//               ) : (
//                 <Link
//                   key={item.name}
//                   to={item.slug}
//                   onMouseEnter={() => setActiveDropdown(null)}
//                   className="inline-flex shrink-0 rounded-full px-2 py-2 text-[15px] font-semibold text-slate-800 transition hover:text-red-500"
//                 >
//                   {item.name}
//                 </Link>
//               );
//             })}
//           </nav>

//           <DropdownPanel
//             open={!!activeDropdown}
//             title={activeDropdown?.name || ''}
//             description={
//               activeDropdown
//                 ? `Navigate quickly to the most important ${activeDropdown.name.toLowerCase()} sections and categories.`
//                 : ''
//             }
//             items={activeDropdown?.children || []}
//             onNavigate={() => setActiveDropdown(null)}
//             onClose={() => setActiveDropdown(null)}
//           />
//         </div>

//         {mobileOpen && (
//           <div className="fixed inset-0 z-[70] bg-slate-900/35 lg:hidden">
//             <div className="absolute inset-0" onClick={() => setMobileOpen(false)} />

//             <div className="absolute left-0 top-0 h-dvh w-[min(92vw,390px)] overflow-hidden border-r border-slate-200 bg-white shadow-2xl">
//               <div className="flex h-full flex-col">
//                 <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-5">
//                <div className="min-w-0 flex-1 lg:flex-none">
//   <a href="/" className="flex items-center">
//     <div className="flex h-12 w-[180px] items-center sm:h-14 sm:w-[220px] lg:w-[260px]">
//       <img
//         src={logo1}
//         alt="LondonPost"
//         className="h-full w-full object-contain object-left"
//       />
//     </div>
//   </a>
// </div>

//                   <button
//                     type="button"
//                     aria-label="Close menu"
//                     className="mt-1 inline-flex shrink-0 rounded-full border border-slate-200 p-3 text-slate-900 transition hover:bg-slate-50"
//                     onClick={() => setMobileOpen(false)}
//                   >
//                     <CloseIcon />
//                   </button>
//                 </div>

//                 <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5">
//                   <button
//                     type="button"
//                     onClick={openCallbackModal}
//                     className="mb-5 w-full rounded-full bg-red-500 px-5 py-3.5 font-semibold text-white shadow-[0_14px_30px_rgba(239,68,68,0.28)] transition duration-200 hover:bg-red-600"
//                   >
//                     Request Queries
//                   </button>

//                   <div className="mb-5 flex items-center gap-3">
//                     <SocialLinks />
//                   </div>

//                   <div className="mb-5">
//                     <SearchBox />
//                   </div>

//                   <div className="grid gap-3 pb-8">
//                     {navItems.map((item) => (
//                       <MobileAccordionItem
//                         key={item.name}
//                         item={item}
//                         isOpen={!!mobileExpanded[item.name]}
//                         onToggle={() => toggleMobileAccordion(item.name)}
//                         onNavigate={closeAllMenus}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </header>

//       {showCallbackModal && (
//         <div className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-[6px]">
//           <div
//             className="absolute inset-0"
//             onClick={closeCallbackModal}
//           />

//           <div className="flex min-h-screen items-center justify-center p-3 sm:p-4 md:p-6">
//             <div
// className="relative z-10 flex w-full max-w-[92vw] animate-[modalIn_0.22s_ease-out] flex-col overflow-hidden rounded-[1.5rem] border border-white/60 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.22)] sm:max-w-xl md:max-w-2xl lg:max-w-3xl max-h-[85vh]"            >
//               <div className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-r from-red-600 via-red-400 to-rose-300 px-5 py-4 text-white sm:px-6 sm:py-5 md:px-7">
//                 <div className="absolute inset-0 opacity-20 [background:radial-gradient(circle_at_top_right,rgba(255,255,255,0.28),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.12),transparent_35%)]" />

//                 <div className="relative flex items-start justify-between gap-4">
//                   <div className="min-w-0 flex-1">
//                    <p className="text-[15px] font-semibold uppercase tracking-[0.28em] text-red-100">
//   On Request Get Info
// </p>
//                    <h2 className="mt-3 text-center ml-3 mb-2 text-3xl font-extrabold tracking-[-0.02em] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.18)] sm:text-4xl">
//   Request Queries
// </h2>
                 
//                   </div>

//                   <button
//                     type="button"
//                     onClick={closeCallbackModal}
//                     aria-label="Close callback form"
//                     className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20 sm:h-11 sm:w-11"
//                   >
//                     <CloseIcon />
//                   </button>
//                 </div>
//               </div>

//               <div className="overflow-y-auto px-5 py-5 sm:px-6 sm:py-6 md:px-7 md:py-6">
//                 <form onSubmit={handleSubmit}>
//                   <div className="grid gap-5 md:grid-cols-2">
//                     <div className="md:col-span-2">
//                       <label
//                         htmlFor="subject"
//                         className="mb-2 block text-sm font-semibold text-slate-800"
//                       >
//                         Subject
//                       </label>
//                       <input
//                         id="subject"
//                         name="subject"
//                         type="text"
//                         value={formData.subject}
//                         onChange={handleInputChange}
//                         placeholder="Enter subject"
//                         required
//                         className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-100"
//                       />
//                     </div>

//                     <div className="md:col-span-2">
//                       <label
//                         htmlFor="reason"
//                         className="mb-2 block text-sm font-semibold text-slate-800"
//                       >
//                         Reason
//                       </label>
//                       <textarea
//                         id="reason"
//                         name="reason"
//                         value={formData.reason}
//                         onChange={handleInputChange}
//                         placeholder="Write your reason here"
//                         required
//                         rows={5}
//                         className="min-h-[150px] w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-100 sm:min-h-[170px]"
//                       />
//                     </div>

//                     <div className="md:col-span-2">
//                       <label
//                         htmlFor="email"
//                         className="mb-2 block text-sm font-semibold text-slate-800"
//                       >
//                         Email
//                       </label>
//                       <input
//                         id="email"
//                         name="email"
//                         type="email"
//                         value={formData.email}
//                         onChange={handleInputChange}
//                         placeholder="Enter your email"
//                         required
//                         className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-100"
//                       />
//                     </div>
//                   </div>

//                   <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:mt-8 sm:flex-row sm:justify-end">
//                     <button
//                       type="button"
//                       onClick={closeCallbackModal}
//                       className="w-full rounded-full border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
//                     >
//                       Cancel
//                     </button>

//                     <button
//                       type="submit"
//                       className="w-full rounded-full bg-red-500 px-6 py-3 font-semibold text-white shadow-[0_14px_30px_rgba(239,68,68,0.28)] transition duration-200 hover:-translate-y-0.5 hover:bg-red-600 sm:w-auto"
//                     >
//                       Submit Request
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {toast.show && (
//         <div className="pointer-events-none fixed bottom-4 left-1/2 z-[120] w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 sm:bottom-6 sm:right-6 sm:left-auto sm:w-full sm:translate-x-0">
//           <div className="pointer-events-auto animate-[toastIn_0.22s_ease-out] overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.18)]">
//             <div className="flex items-start gap-3 p-4 sm:p-4.5">
//               <div className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
//                 <CheckCircleIcon />
//               </div>

//               <div className="min-w-0 flex-1">
//                 <p className="text-sm font-semibold text-slate-900">{toast.title}</p>
//                 <p className="mt-1 text-sm leading-6 text-slate-600">{toast.message}</p>
//               </div>

//               <button
//                 type="button"
//                 onClick={() => setToast((prev) => ({ ...prev, show: false }))}
//                 className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
//                 aria-label="Close notification"
//               >
//                 <span className="text-lg leading-none">×</span>
//               </button>
//             </div>

//             <div className="h-1 w-full bg-slate-100">
//               <div className="h-full w-full origin-left animate-[toastIn_3.3s_linear]" />
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }




import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { navigation, regionMenus } from '../data/siteData';
import { CloseIcon, MenuIcon } from './Icons';
import { SearchBox } from './SearchBox';
import logo1 from '../assets/emlogo.png';
import { SocialLinks } from './SocialLinks';
import { DropdownPanel } from './DropdownPanel';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
type DropdownItem = { name: string; slug: string };

type NavItem = {
  name: string;
  slug: string;
  children?: DropdownItem[];
};

type ToastState = {
  show: boolean;
  title: string;
  message: string;
};

const regionDropdowns: Record<string, DropdownItem[]> = {
  '/region/asia': regionMenus.asia.map((name) => ({
    name,
    slug: `/region/asia/${name.toLowerCase().replace(/\s+/g, '-')}`,
  })),
  '/region/europe': regionMenus.europe.map((name) => ({
    name,
    slug: `/region/europe/${name.toLowerCase().replace(/\s+/g, '-')}`,
  })),
  '/region/americas': regionMenus.americas.map((name) => ({
    name,
    slug: `/region/americas/${name.toLowerCase().replace(/\s+/g, '-')}`,
  })),
};

function LivePodcastLink({
  to,
  mobile = false,
  onClick,
}: {
  to: string;
  mobile?: boolean;
  onClick?: () => void;
}) {
  if (mobile) {
    return (
      <Link
        to={to}
        onClick={onClick}
        className="group relative overflow-hidden rounded-2xl border border-amber-300/80 bg-gradient-to-r from-amber-50 via-white to-orange-50 px-5 py-4 font-semibold text-slate-900 shadow-[0_10px_30px_rgba(245,158,11,0.14)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(245,158,11,0.2)]"
      >
        <span className="absolute inset-0 opacity-70 [background:linear-gradient(110deg,transparent,rgba(245,158,11,0.14),transparent)] [background-size:220%_100%] group-hover:animate-[lpShine_1.8s_linear_infinite]" />
        <span className="relative flex items-center justify-between gap-3">
          <span className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-red-600" />
            </span>
            <span>Live Podcast</span>
          </span>
          <span className="rounded-full bg-slate-950 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-white">
            Live
          </span>
        </span>
      </Link>
    );
  }

  return (
    <Link
      to={to}
      onClick={onClick}
      className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-amber-300/80 bg-gradient-to-r from-amber-50 via-white to-orange-50 px-5 py-3 font-semibold text-slate-900 shadow-[0_10px_26px_rgba(245,158,11,0.14)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(245,158,11,0.2)]"
    >
      <span className="absolute inset-0 opacity-70 [background:linear-gradient(110deg,transparent,rgba(245,158,11,0.14),transparent)] [background-size:220%_100%] group-hover:animate-[lpShine_1.8s_linear_infinite]" />
      <span className="relative flex items-center gap-3">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-600" />
        </span>
        <span>Live Podcast</span>
      </span>
      <span className="relative rounded-full bg-slate-950 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-white">
        Live
      </span>
    </Link>
  );
}

function ChevronIcon({ open = false }: { open?: boolean }) {
  return (
    <svg
      className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 4 12 14.01l-3-3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MobileAccordionItem({
  item,
  isOpen,
  onToggle,
  onNavigate,
}: {
  item: NavItem;
  isOpen: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  const hasChildren = !!item.children?.length;
  const isLivePodcast = item.name === 'Live Podcast';

  if (isLivePodcast) {
    return <LivePodcastLink to={item.slug} mobile onClick={onNavigate} />;
  }

  if (!hasChildren) {
    return (
      <Link
        to={item.slug}
        onClick={onNavigate}
        className="rounded-2xl border border-slate-200 bg-white px-5 py-4 font-semibold text-slate-900 transition hover:border-red-500 hover:bg-slate-50"
      >
        {item.name}
      </Link>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-slate-900 transition hover:bg-slate-50"
      >
        <span>{item.name}</span>
        <ChevronIcon open={isOpen} />
      </button>

      <div
        className={`grid transition-all duration-300 ease-out ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-slate-200 bg-slate-50/80 p-3">
            <div className="grid gap-2">
              {item.children?.map((child) => (
                <Link
                  key={child.slug}
                  to={child.slug}
                  onClick={onNavigate}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-red-500 hover:text-red-500"
                >
                  {child.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<NavItem | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({});
  const [showCallbackModal, setShowCallbackModal] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    title: '',
    message: '',
  });

  const [formData, setFormData] = useState({
    subject: '',
    reason: '',
    email: '',
  });

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousTouchAction = document.body.style.touchAction;

    if (mobileOpen || showCallbackModal) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.touchAction = previousTouchAction;
    };
  }, [mobileOpen, showCallbackModal]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveDropdown(null);
        setMobileOpen(false);
        setShowCallbackModal(false);
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  useEffect(() => {
    if (!toast.show) return;

    const timer = window.setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3500);

    return () => window.clearTimeout(timer);
  }, [toast.show]);

  const navItems = useMemo<NavItem[]>(() => {
    return navigation.map((item) => ({
      ...item,
      children: item.children || regionDropdowns[item.slug] || undefined,
    }));
  }, []);

  const aboutUsItem = useMemo(
    () => navItems.find((item) => item.name === 'About Us') || null,
    [navItems]
  );

  const missionVisionItem = useMemo(
    () => navItems.find((item) => item.name === 'Mission & Vision') || null,
    [navItems]
  );

  const opinionItem = useMemo<NavItem | null>(() => {
    const directOpinion = navItems.find((item) => item.name === 'Opinion');
    if (directOpinion) return directOpinion;

    const moreItem = navItems.find((item) => item.name === 'More');
    const opinionChild = moreItem?.children?.find((child) => child.name === 'Opinion');

    return opinionChild
      ? {
          name: opinionChild.name,
          slug: opinionChild.slug,
        }
      : null;
  }, [navItems]);

  const desktopNavItems = useMemo<NavItem[]>(() => {
    const filtered = navItems
      .filter((item) => !['About Us', 'Mission & Vision', 'Contact Us', 'Opinion'].includes(item.name))
      .map((item) => {
        if (item.name === 'More' && item.children) {
          return {
            ...item,
            children: item.children.filter((child) => child.name !== 'Opinion'),
          };
        }
        return item;
      });

    const livePodcastIndex = filtered.findIndex((item) => item.name === 'Live Podcast');

    if (opinionItem) {
      if (livePodcastIndex >= 0) {
        const next = [...filtered];
        next.splice(livePodcastIndex + 1, 0, opinionItem);
        return next;
      }
      return [...filtered, opinionItem];
    }

    return filtered;
  }, [navItems, opinionItem]);

  const mobileNavItems = useMemo<NavItem[]>(() => {
    const filtered = navItems
      .filter((item) => !['Contact Us', 'Opinion'].includes(item.name))
      .map((item) => {
        if (item.name === 'More' && item.children) {
          return {
            ...item,
            children: item.children.filter((child) => child.name !== 'Opinion'),
          };
        }
        return item;
      });

    const livePodcastIndex = filtered.findIndex((item) => item.name === 'Live Podcast');

    if (opinionItem) {
      if (livePodcastIndex >= 0) {
        const next = [...filtered];
        next.splice(livePodcastIndex + 1, 0, opinionItem);
        return next;
      }
      return [...filtered, opinionItem];
    }

    return filtered;
  }, [navItems, opinionItem]);

  const closeAllMenus = () => {
    setActiveDropdown(null);
    setMobileOpen(false);
  };

  const toggleMobileAccordion = (name: string) => {
    setMobileExpanded((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const openCallbackModal = () => {
    setShowCallbackModal(true);
    setActiveDropdown(null);
    setMobileOpen(false);
  };

  const closeCallbackModal = () => {
    setShowCallbackModal(false);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  try {
    const res = await fetch(`${API_URL}/contact-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source: 'header-request-query',
        email: formData.email,
        subject: formData.subject,
        message: formData.reason,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Failed to submit request.');
    }

    setFormData({
      subject: '',
      reason: '',
      email: '',
    });

    setShowCallbackModal(false);

    setToast({
      show: true,
      title: 'Request submitted successfully',
      message: 'Our team will get in touch with you soon.',
    });
  } catch (error: any) {
    setToast({
      show: true,
      title: 'Submission failed',
      message: error.message || 'Something went wrong. Please try again.',
    });
  }
};

  return (
    <>
      <style>
        {`
          @keyframes lpShine {
            0% { background-position: 200% 0; }
            100% { background-position: -40% 0; }
          }

          @keyframes toastIn {
            0% {
              opacity: 0;
              transform: translateY(16px) scale(0.96);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes modalIn {
            0% {
              opacity: 0;
              transform: translateY(18px) scale(0.98);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>

      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
        {/* <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-5 lg:px-6 xl:px-8"> */}
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-5 lg:px-6 xl:px-8">
          <div className="flex-shrink-0">
            {/* <a href="/" className="flex items-center">
              <div className="w-[260px] sm:w-[320px] lg:w-[380px]">
                <img
                  src={logo1}
                  alt="LondonPost"
                  className="block h-auto max-h-14 w-full object-contain object-left"
                />
              </div>
            </a> */}

<a href="/" className="flex items-center pl-2 sm:pl-3 lg:pl-4">
  <div className="w-[320px] sm:w-[380px] lg:w-[450px]">
    <img
      src={logo1}
      alt="EM Insights"
      className="block h-auto max-h-20 w-full object-contain object-left sm:max-h-24 lg:max-h-28"
    />
  </div>
</a>
          </div>

          <div className="hidden items-start gap-4 lg:flex xl:gap-5">
            <SocialLinks />

            <div className="flex flex-col items-end gap-3">
              <div className="flex items-center gap-4 xl:gap-5">
                <div className="w-[240px] xl:w-[300px]">
                  <SearchBox />
                </div>

                <button
                  type="button"
                  onClick={openCallbackModal}
                  className="shrink-0 rounded-full bg-blue-800 px-5 py-3 font-semibold text-white shadow-[0_14px_30px_rgba(239,68,68,0.28)] transition duration-200 hover:-translate-y-0.5 hover:bg-red-600 xl:px-6"
                >
                  Request Queries
                </button>
              </div>

              {/* <div className="flex items-center gap-6 pr-1 text-sm font-semibold text-slate-700"> */}
              <div className="flex items-center gap-5 pr-1 text-sm font-semibold text-slate-700">
                {aboutUsItem && (
                  <Link
                    to={aboutUsItem.slug}
                    className="transition hover:text-red-500"
                  >
                    {aboutUsItem.name}
                  </Link>
                )}

                {missionVisionItem && (
                  <Link
                    to={missionVisionItem.slug}
                    className="transition hover:text-red-500"
                  >
                    {missionVisionItem.name}
                  </Link>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            className="inline-flex shrink-0 rounded-full border border-slate-200 p-2.5 text-slate-900 transition hover:bg-slate-50 lg:hidden"
            onClick={() => setMobileOpen((s) => !s)}
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        <div
          className="relative hidden border-t border-slate-200 lg:block"
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-6 py-3 xl:px-8">
            {desktopNavItems.map((item) => {
              const hasDropdown = !!item.children?.length;
              const isActive = activeDropdown?.name === item.name;
              const isLivePodcast = item.name === 'Live Podcast';

              if (isLivePodcast) {
                return (
                  <div
                    key={item.name}
                    className="shrink-0"
                    onMouseEnter={() => setActiveDropdown(null)}
                  >
                    <LivePodcastLink to={item.slug} />
                  </div>
                );
              }

              return hasDropdown ? (
                <button
                  key={item.name}
                  type="button"
                  onMouseEnter={() => setActiveDropdown(item)}
                  onClick={() =>
                    setActiveDropdown((prev) => (prev?.name === item.name ? null : item))
                  }
                  className={`inline-flex shrink-0 items-center rounded-full px-2 py-2 text-[15px] font-semibold transition ${
                    isActive ? 'text-red-500' : 'text-slate-800 hover:text-red-500'
                  }`}
                >
                  {item.name}
                </button>
              ) : (
                <Link
                  key={item.name}
                  to={item.slug}
                  onMouseEnter={() => setActiveDropdown(null)}
                  className="inline-flex shrink-0 rounded-full px-2 py-2 text-[15px] font-semibold text-slate-800 transition hover:text-red-500"
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <DropdownPanel
            open={!!activeDropdown}
            title={activeDropdown?.name || ''}
            description={
              activeDropdown
                ? `Navigate quickly to the most important ${activeDropdown.name.toLowerCase()} sections and categories.`
                : ''
            }
            items={activeDropdown?.children || []}
            onNavigate={() => setActiveDropdown(null)}
            onClose={() => setActiveDropdown(null)}
          />
        </div>

        {mobileOpen && (
          <div className="fixed inset-0 z-[70] bg-slate-900/35 lg:hidden">
            <div className="absolute inset-0" onClick={() => setMobileOpen(false)} />

            <div className="absolute left-0 top-0 h-dvh w-[min(92vw,390px)] overflow-hidden border-r border-slate-200 bg-white shadow-2xl">
              <div className="flex h-full flex-col">
                <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-5">
                  <div className="min-w-0 flex-1 lg:flex-none">
                    <a href="/" className="flex items-center">
                      <div className="flex h-12 w-[180px] items-center sm:h-14 sm:w-[220px] lg:w-[260px]">
                        <img
                          src={logo1}
                          alt="LondonPost"
                          className="h-full w-full object-contain object-left"
                        />
                      </div>
                    </a>
                  </div>

                  <button
                    type="button"
                    aria-label="Close menu"
                    className="mt-1 inline-flex shrink-0 rounded-full border border-slate-200 p-3 text-slate-900 transition hover:bg-slate-50"
                    onClick={() => setMobileOpen(false)}
                  >
                    <CloseIcon />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5">
                  <button
                    type="button"
                    onClick={openCallbackModal}
                    className="mb-5 w-full rounded-full bg-red-500 px-5 py-3.5 font-semibold text-white shadow-[0_14px_30px_rgba(239,68,68,0.28)] transition duration-200 hover:bg-red-600"
                  >
                    Request Queries
                  </button>

                  <div className="mb-5 flex items-center gap-3">
                    <SocialLinks />
                  </div>

                  <div className="mb-5">
                    <SearchBox />
                  </div>

                  <div className="grid gap-3 pb-8">
                    {mobileNavItems.map((item) => (
                      <MobileAccordionItem
                        key={item.name}
                        item={item}
                        isOpen={!!mobileExpanded[item.name]}
                        onToggle={() => toggleMobileAccordion(item.name)}
                        onNavigate={closeAllMenus}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {showCallbackModal && (
        <div className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-[6px]">
          <div
            className="absolute inset-0"
            onClick={closeCallbackModal}
          />

          <div className="flex min-h-screen items-center justify-center p-3 sm:p-4 md:p-6">
            <div
              className="relative z-10 flex max-h-[85vh] w-full max-w-[92vw] animate-[modalIn_0.22s_ease-out] flex-col overflow-hidden rounded-[1.5rem] border border-white/60 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.22)] sm:max-w-xl md:max-w-2xl lg:max-w-3xl"
            >
              <div className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-r from-red-600 via-red-400 to-rose-300 px-5 py-4 text-white sm:px-6 sm:py-5 md:px-7">
                <div className="absolute inset-0 opacity-20 [background:radial-gradient(circle_at_top_right,rgba(255,255,255,0.28),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.12),transparent_35%)]" />

                <div className="relative flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-semibold uppercase tracking-[0.28em] text-red-100">
                      On Request Get Info
                    </p>
                    <h2 className="mt-3 mb-2 ml-3 text-center text-3xl font-extrabold tracking-[-0.02em] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.18)] sm:text-4xl">
                      Request Queries
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={closeCallbackModal}
                    aria-label="Close callback form"
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20 sm:h-11 sm:w-11"
                  >
                    <CloseIcon />
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto px-5 py-5 sm:px-6 sm:py-6 md:px-7 md:py-6">
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label
                        htmlFor="subject"
                        className="mb-2 block text-sm font-semibold text-slate-800"
                      >
                        Subject
                      </label>
                      <input
                        id="subject"
                        name="subject"
                        type="text"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="Enter subject"
                        required
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-100"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label
                        htmlFor="reason"
                        className="mb-2 block text-sm font-semibold text-slate-800"
                      >
                        Reason
                      </label>
                      <textarea
                        id="reason"
                        name="reason"
                        value={formData.reason}
                        onChange={handleInputChange}
                        placeholder="Write your reason here"
                        required
                        rows={5}
                        className="min-h-[150px] w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-100 sm:min-h-[170px]"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-semibold text-slate-800"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        required
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-100"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:mt-8 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={closeCallbackModal}
                      className="w-full rounded-full border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="w-full rounded-full bg-red-500 px-6 py-3 font-semibold text-white shadow-[0_14px_30px_rgba(239,68,68,0.28)] transition duration-200 hover:-translate-y-0.5 hover:bg-red-600 sm:w-auto"
                    >
                      Submit Request
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast.show && (
        <div className="pointer-events-none fixed bottom-4 left-1/2 z-[120] w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 sm:bottom-6 sm:left-auto sm:right-6 sm:w-full sm:translate-x-0">
          <div className="pointer-events-auto animate-[toastIn_0.22s_ease-out] overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.18)]">
            <div className="flex items-start gap-3 p-4 sm:p-4.5">
              <div className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircleIcon />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900">{toast.title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">{toast.message}</p>
              </div>

              <button
                type="button"
                onClick={() => setToast((prev) => ({ ...prev, show: false }))}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close notification"
              >
                <span className="text-lg leading-none">×</span>
              </button>
            </div>

            <div className="h-1 w-full bg-slate-100">
              <div className="h-full w-full origin-left animate-[toastIn_3.3s_linear]" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}