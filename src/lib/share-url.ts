/**
 * Base URL for public share links (/share/:token).
 * Hardcoded to the production domain so that links copied from any environment
 * (Vercel preview, staging, localhost) still point at the production workspace.
 */
export const SHARE_URL_BASE = 'https://workplace.talentsy.ru'

export function getShareUrl(shareToken: string): string {
  return `${SHARE_URL_BASE}/share/${shareToken}`
}
