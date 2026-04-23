import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center lg:px-6">
      <div className="text-sm font-semibold uppercase tracking-[0.35em] text-accent">404</div>
      <h1 className="mt-4 text-5xl font-black text-ink">Page not found</h1>
      <p className="mt-4 text-lg text-slate-600">The page you tried to open does not exist in this demo project yet.</p>
      <Link to="/" className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 font-semibold text-white">Back Home</Link>
    </div>
  );
}
