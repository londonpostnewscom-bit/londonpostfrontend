import { ReactNode } from 'react';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-ink">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
