import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/lib/types/database'

// В браузере NEXT_PUBLIC_SUPABASE_URL указывает на прокси
// (https://supabase.talentsy.ru/proxy/lbpebpdmerhvbefrbgbv) — это позволяет
// пользователям из РФ открывать приложение без VPN.
//
// storageKey явно зафиксирован по project ref исходного Supabase, чтобы
// auth-cookie не поменяли имя при смене hostname и не разлогинили пользователей.
export const SUPABASE_STORAGE_KEY = 'sb-lbpebpdmerhvbefrbgbv-auth-token'

export const createClient = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        storageKey: SUPABASE_STORAGE_KEY,
      },
    }
  )
