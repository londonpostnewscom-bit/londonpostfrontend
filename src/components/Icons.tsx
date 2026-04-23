import React from 'react';

type IconProps = { className?: string };

const makeIcon = (path: React.ReactNode) => ({ className = 'h-5 w-5' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
    {path}
  </svg>
);

export const SearchIcon = makeIcon(<><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>);
export const MenuIcon = makeIcon(<><path d="M4 7h16M4 12h16M4 17h16" /></>);
export const CloseIcon = makeIcon(<><path d="M6 6l12 12M18 6 6 18" /></>);
export const ArrowRightIcon = makeIcon(<><path d="M5 12h14" /><path d="m13 5 7 7-7 7" /></>);
export const ArrowLeftIcon = makeIcon(<><path d="M19 12H5" /><path d="m11 19-7-7 7-7" /></>);
export const PlayIcon = makeIcon(<><path d="m8 6 10 6-10 6V6Z" /></>);
export const MailIcon = makeIcon(<><path d="M4 7h16v10H4z" /><path d="m4 8 8 6 8-6" /></>);
export const LocationIcon = makeIcon(<><path d="M12 21s6-4.35 6-10a6 6 0 1 0-12 0c0 5.65 6 10 6 10Z" /><circle cx="12" cy="11" r="2.2" /></>);
export const PhoneIcon = makeIcon(<><path d="M6.5 4.5h3l1.2 4-2 1.5a15 15 0 0 0 5.3 5.3l1.5-2 4 1.2v3A2 2 0 0 1 17.5 20C10.6 20 4 13.4 4 6.5a2 2 0 0 1 2.5-2Z" /></>);

export const FacebookIcon = ({ className = 'h-5 w-5' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M13.5 21v-7h2.3l.4-3h-2.7V9.1c0-.9.3-1.5 1.6-1.5h1.2V5a15 15 0 0 0-2.1-.1c-2.1 0-3.6 1.3-3.6 3.8V11H8v3h2.6v7h2.9Z"/></svg>
);
export const InstagramIcon = ({ className = 'h-5 w-5' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
);
export const LinkedinIcon = ({ className = 'h-5 w-5' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M6.5 8.5A1.75 1.75 0 1 1 6.5 5a1.75 1.75 0 0 1 0 3.5ZM5 10h3v9H5v-9Zm5 0h2.9v1.3h.1c.4-.8 1.4-1.6 2.9-1.6 3.1 0 3.6 2 3.6 4.7V19h-3v-4c0-1 0-2.3-1.4-2.3s-1.6 1.1-1.6 2.2V19h-3v-9Z"/></svg>
);
export const XIcon = ({ className = 'h-5 w-5' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M18.9 3H21l-4.6 5.3L22 21h-4.4l-3.4-4.5L10.1 21H8l4.9-5.7L2 3h4.5l3 4.1L12.9 3h6Z"/></svg>
);
