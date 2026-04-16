import { Database } from '@/lib/types/database'

type Profile = Database['public']['Tables']['profiles']['Row']
type Document = Database['public']['Tables']['documents']['Row']
type Section = Database['public']['Tables']['sections']['Row']

export function isAdmin(profile: Profile | null): boolean {
  return profile?.role === 'admin'
}

export function isHead(profile: Profile | null): boolean {
  return profile?.role === 'head'
}

export function isEmployee(profile: Profile | null): boolean {
  return profile?.role === 'employee'
}

export function canAccessSection(
  profile: Profile | null,
  section: Section | null
): boolean {
  if (!profile) return false
  if (!section) return false

  // Admins can access all sections
  if (isAdmin(profile)) return true

  // Public sections are accessible to all authenticated users
  if (section.is_public) return true

  // Department-specific sections: heads and members of that department
  if (section.department_id) {
    if (isHead(profile) && profile.department_id === section.department_id) {
      return true
    }
    if (profile.department_id === section.department_id) {
      return true
    }
  }

  return false
}

export function canEditDocument(profile: Profile | null, document: Document | null): boolean {
  if (!profile || !document) return false

  // Admins can edit all documents
  if (isAdmin(profile)) return true

  // Authors can edit their own documents
  if (document.author_id === profile.id) return true

  // Heads can edit documents in their department
  if (isHead(profile) && profile.department_id) {
    return true
  }

  return false
}

export function canDeleteDocument(
  profile: Profile | null,
  document: Document | null
): boolean {
  if (!profile || !document) return false

  // Admins can delete all documents
  if (isAdmin(profile)) return true

  // Authors can delete their own documents
  if (document.author_id === profile.id) return true

  return false
}

export function canPublishDocument(
  profile: Profile | null,
  document: Document | null
): boolean {
  if (!profile || !document) return false

  // Admins can publish any document
  if (isAdmin(profile)) return true

  // Heads can publish documents in their department
  if (isHead(profile) && profile.department_id) {
    return true
  }

  // Authors can publish their own documents
  if (document.author_id === profile.id) {
    return true
  }

  return false
}

export function canManageUsers(profile: Profile | null): boolean {
  if (!profile) return false
  return isAdmin(profile)
}

export function canManageDepartments(profile: Profile | null): boolean {
  if (!profile) return false
  return isAdmin(profile)
}

export function canManageSections(profile: Profile | null): boolean {
  if (!profile) return false

  // Only admins can manage sections at the top level
  if (isAdmin(profile)) return true

  // Heads can manage sections in their department
  if (isHead(profile)) return true

  return false
}
