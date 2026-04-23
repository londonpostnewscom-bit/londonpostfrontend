import { FacebookIcon, InstagramIcon, LinkedinIcon, XIcon } from './Icons';

const items = [
  { icon: InstagramIcon, href: '#', label: 'Instagram' },
  { icon: FacebookIcon, href: '#', label: 'Facebook' },
  { icon: LinkedinIcon, href: '#', label: 'LinkedIn' },
  { icon: XIcon, href: '#', label: 'X' },
];

export function SocialLinks() {
  return (
    <div className="flex items-center gap-3">
      {items.map(({ icon: Icon, href, label }, index) => (
        <a
          key={index}
          href={href}
          aria-label={label}
          className="grid h-11 w-11 place-items-center rounded-full border border-red-900/30 bg-red-900/10 transition duration-200 hover:scale-105 hover:bg-red-900/20"
        >
          <Icon className="h-5 w-5 text-red-800" />
        </a>
      ))}
    </div>
  );
}
