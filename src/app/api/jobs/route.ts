import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const status = searchParams.get('status') || 'all'
  const minScore = parseInt(searchParams.get('minScore') || '0')
  const remote = searchParams.get('remote') === 'true'
  const source = searchParams.get('source') || ''
  const search = searchParams.get('search') || ''

  let query = getSupabase()
    .from('jobs')
    .select('*')
    .order('score', { ascending: false })

  if (status === 'bookmarked') query = query.eq('bookmarked', true)
  else if (status === 'applied') query = query.eq('applied', true)
  else if (status === 'rejected') query = query.eq('rejected', true)
  else {
    query = query.eq('rejected', false)
  }

  if (minScore > 0) query = query.gte('score', minScore)

  if (remote) query = query.eq('remote', true)

  if (source && source !== 'all') query = query.eq('source', source)

  if (search) {
    query = query.or(
      `title.ilike.%${search}%,company.ilike.%${search}%`
    )
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
