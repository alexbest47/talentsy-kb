"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './sidebar';
import Header from './header';
import { createClient } from '@/lib/supabase/client';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    const supabase = createClient();
    const check = async () => {
      // Handle invite/recovery code that may have landed on home
      const url = new URL(window.location.href);
      if (url.searchParams.get('code') || window.location.hash.includes('access_token')) {
        router.replace('/auth/set-password' + window.location.search + window.location.hash);
        return;
      }
      const { data: { user } } = await supabase.auth.getUser();
      if (user && (user.user_metadata as any)?.password_set !== true) {
        // Newly invited user — force password set
        router.replace('/auth/set-password');
      }
    };
    check();
  }, [router]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-slate-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
