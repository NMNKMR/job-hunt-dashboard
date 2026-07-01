import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { JobStats } from '@/lib/types'

export async function GET() {
  const supabase = getSupabase()

  const [newRes, bookmarkedRes, appliedRes, rejectedRes] = await Promise.all([
    supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })
      .eq('applied', false)
      .eq('bookmarked', false)
      .eq('rejected', false),
    supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })
      .eq('bookmarked', true),
    supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })
      .eq('applied', true),
    supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })
      .eq('rejected', true),
  ])

  const error =
    newRes.error ?? bookmarkedRes.error ?? appliedRes.error ?? rejectedRes.error

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const stats: JobStats = {
    new: newRes.count ?? 0,
    bookmarked: bookmarkedRes.count ?? 0,
    applied: appliedRes.count ?? 0,
    rejected: rejectedRes.count ?? 0,
  }

  return NextResponse.json(stats)
}
