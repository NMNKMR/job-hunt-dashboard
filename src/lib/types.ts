export type SeniorityMatch = 'under' | 'match' | 'over'

export type JobStatus = 'all' | 'bookmarked' | 'applied' | 'rejected'

export type JobSource = 'jsearch_fe' | 'jsearch_be' | 'jsearch_ai' | 'remoteok'

export interface Job {
  id: string
  source: JobSource
  title: string
  company: string
  url: string
  url_hash: string
  description: string | null
  logo: string | null
  site: string | null
  remote: boolean | null
  posted_at: string | null
  fetched_at: string

  score: number | null
  seniority_match: SeniorityMatch | null
  skills_required: string[]
  skills_gap: string[]
  green_flags: string[]
  red_flags: string[]
  summary: string | null

  applied: boolean
  applied_at: string | null
  bookmarked: boolean
  bookmarked_at: string | null
  rejected: boolean
  rejected_at: string | null
  notes: string | null
}

export interface JobFilters {
  status: JobStatus
  minScore: number
  remote: boolean
  source: string
  search: string
}

export interface JobUpdatePayload {
  applied?: boolean
  bookmarked?: boolean
  rejected?: boolean
  notes?: string
}
