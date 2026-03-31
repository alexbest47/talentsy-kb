'use client'

import { useEffect } from 'react'
import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/types/database'

type Profile = Database['public']['Tables']['profiles']['Row']

interface AuthState {
  user: any | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  fetchProfile: () => Promise<void>
  setLoading: (loading: boolean) => void
  setUser: (user: any | null) => void
  setProfile: (profile: Profile | null) => void
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  loading: true,
  setLoading: (loading) => set({ loading }),
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  signIn: async (email: string, password: string) => {
    const supabase = createClient()
    set({ loading: true })
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      set({ user: data.user })
    } finally {
      set({ loading: false })
    }
  },
  signOut: async () => {
    const supabase = createClient()
    set({ loading: true })
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      set({ user: null, profile: null })
    } finally {
      set({ loading: false })
    }
  },
  fetchProfile: async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      set({ profile: null })
      return
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      set({ profile: null })
    } else {
      set({ profile: data })
    }
  },
}))

export const useAuth = () => {
  const state = useAuthStore()
  const supabase = createClient()

  useEffect(() => {
    // Check current session on mount
    const checkSession = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        state.setUser(user)
        if (user) {
          await state.fetchProfile()
        }
      } catch (error) {
        console.error('Error checking session:', error)
      } finally {
        state.setLoading(false)
      }
    }

    checkSession()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        state.setUser(session?.user ?? null)
        if (session?.user) {
          await state.fetchProfile()
        } else {
          state.setProfile(null)
        }
      }
    )

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  return state
}
