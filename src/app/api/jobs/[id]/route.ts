import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { JobUpdatePayload } from '@/lib/types'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body: JobUpdatePayload = await req.json()

  const updateData: Record<string, unknown> = { ...body }

  if ('applied' in body) {
    updateData.applied_at = body.applied ? new Date().toISOString() : null
  }
  if ('bookmarked' in body) {
    updateData.bookmarked_at = body.bookmarked ? new Date().toISOString() : null
  }
  if ('rejected' in body) {
    updateData.rejected_at = body.rejected ? new Date().toISOString() : null
    if (body.rejected) {
      updateData.applied = false
      updateData.bookmarked = false
    }
  }

  const { data, error } = await getSupabase()
    .from('jobs')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
