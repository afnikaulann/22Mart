import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/" className="flex items-center gap-1 font-bold text-2xl">
            <span className="text-primary">22</span>
            <span className="text-secondary">mart</span>
            <span className="text-primary">.id</span>
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="flex flex-1 items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-4 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} 22mart.id. All rights reserved.
      </footer>
    </div>
  );
}
