'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/lib/auth-context';
import { CartProvider } from '@/lib/cart-context';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              className: 'bg-white/95 backdrop-blur border border-border/50 text-foreground font-semibold shadow-xl rounded-2xl flex items-center gap-3',
              descriptionClassName: 'text-muted-foreground font-medium mt-1',
            }}
          />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
