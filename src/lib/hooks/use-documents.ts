'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/types/database'
import { generateSlug } from '@/lib/utils/slug'

type Document = Database['public']['Tables']['documents']['Row']
type DocumentInsert = Database['public']['Tables']['documents']['Insert']
type DocumentUpdate = Database['public']['Tables']['documents']['Update']

interface UseDocumentsState {
  documents: Document[]
  loading: boolean
  error: string | null
}

export const useDocuments = () => {
  const [state, setState] = useState<UseDocumentsState>({
    documents: [],
    loading: false,
    error: null,
  })

  const supabase = createClient()

  const listDocuments = useCallback(
    async (sectionId?: string, filters?: { status?: string; tags?: string[] }) => {
      setState((prev) => ({ ...prev, loading: true, error: null }))
      try {
        let query = supabase.from('documents').select('*')

        if (sectionId) {
          query = query.eq('section_id', sectionId)
        }

        if (filters?.status) {
          query = query.eq('status', filters.status)
        }

        const { data, error } = await query

        if (error) throw error

        let results = data || []

        if (filters?.tags && filters.tags.length > 0) {
          results = results.filter((doc: any) =>
            filters.tags!.some((tag) => (doc.tags || []).includes(tag))
          )
        }

        setState((prev) => ({ ...prev, documents: results }))
        return results
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to list documents'
        setState((prev) => ({ ...prev, error: message }))
        throw error
      } finally {
        setState((prev) => ({ ...prev, loading: false }))
      }
    },
    [supabase]
  )

  const getDocument = useCallback(
    async (id: string) => {
      try {
        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error
        return data
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to get document'
        setState((prev) => ({ ...prev, error: message }))
        throw error
      }
    },
    [supabase]
  )

  const createDocument = useCallback(
    async (input: Omit<DocumentInsert, 'slug'> & { title: string }) => {
      setState((prev) => ({ ...prev, loading: true, error: null }))
      try {
        const slug = generateSlug(input.title)

        const { data, error } = await supabase
          .from('documents')
          .insert([{ ...input, slug }])
          .select()
          .single()

        if (error) throw error

        setState((prev) => ({
          ...prev,
          documents: [...prev.documents, data],
        }))
        return data
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to create document'
        setState((prev) => ({ ...prev, error: message }))
        throw error
      } finally {
        setState((prev) => ({ ...prev, loading: false }))
      }
    },
    [supabase]
  )

  const updateDocument = useCallback(
    async (id: string, updates: DocumentUpdate) => {
      setState((prev) => ({ ...prev, loading: true, error: null }))
      try {
        const { data, error } = await supabase
          .from('documents')
          .update(updates)
          .eq('id', id)
          .select()
          .single()

        if (error) throw error

        setState((prev) => ({
          ...prev,
          documents: prev.documents.map((doc) => (doc.id === id ? data : doc)),
        }))
        return data
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update document'
        setState((prev) => ({ ...prev, error: message }))
        throw error
      } finally {
        setState((prev) => ({ ...prev, loading: false }))
      }
    },
    [supabase]
  )

  const deleteDocument = useCallback(
    async (id: string) => {
      setState((prev) => ({ ...prev, loading: true, error: null }))
      try {
        const { error } = await supabase
          .from('documents')
          .delete()
          .eq('id', id)

        if (error) throw error

        setState((prev) => ({
          ...prev,
          documents: prev.documents.filter((doc) => doc.id !== id),
        }))
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to delete document'
        setState((prev) => ({ ...prev, error: message }))
        throw error
      } finally {
        setState((prev) => ({ ...prev, loading: false }))
      }
    },
    [supabase]
  )

  const generateShareToken = useCallback(
    async (documentId: string) => {
      try {
        const token = Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15)

        const { data, error } = await supabase
          .from('documents')
          .update({
            share_token: token,
            share_enabled: true,
          })
          .eq('id', documentId)
          .select()
          .single()

        if (error) throw error
        return token
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to generate share token'
        setState((prev) => ({ ...prev, error: message }))
        throw error
      }
    },
    [supabase]
  )

  return {
    ...state,
    listDocuments,
    getDocument,
    createDocument,
    updateDocument,
    deleteDocument,
    generateShareToken,
  }
}
