import { Outlet } from 'react-router-dom';
import { Header } from './header';
import { Footer } from './footer';
import { Toaster } from '@/components/ui/toaster';

export function RootLayout() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}