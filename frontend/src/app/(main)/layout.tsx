import { Header, Footer } from '@/components/layout';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Fixed navbar — always at top, out of document flow */}
      <Header />

      {/* All page content sits below the 144px fixed navbar (topbar + main + bottom) */}
      <main className="min-h-screen pt-[144px]">
        {children}
      </main>

      <Footer />
    </>
  );
}

