'use client'

import { Bookmark, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Job, JobUpdatePayload } from '@/lib/types'
import { cn } from '@/lib/utils'

interface StatusButtonsProps {
  job: Job
  onUpdate: (id: string, payload: JobUpdatePayload) => void
}

function ActiveDot({ className }: { className: string }) {
  return (
    <span
      className={cn('size-4 shrink-0 rounded-full', className)}
      aria-hidden
    />
  )
}

export function StatusButtons({ job, onUpdate }: StatusButtonsProps) {
  async function handleToggle(
    field: 'bookmarked' | 'applied' | 'rejected',
    current: boolean
  ) {
    const payload: JobUpdatePayload = { [field]: !current }

    if (field === 'rejected' && !current) {
      payload.applied = false
      payload.bookmarked = false
    }

    onUpdate(job.id, payload)
  }

  return (
    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => handleToggle('bookmarked', job.bookmarked)}
        className="cursor-pointer text-text-secondary hover:text-indigo-400"
        title={job.bookmarked ? 'Remove bookmark' : 'Bookmark'}
      >
        {job.bookmarked ? (
          <ActiveDot className="bg-indigo-400" />
        ) : (
          <Bookmark className="size-4" />
        )}
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => handleToggle('applied', job.applied)}
        className="cursor-pointer text-text-secondary hover:text-green-400"
        title={job.applied ? 'Mark not applied' : 'Applied'}
      >
        {job.applied ? (
          <ActiveDot className="bg-green-400" />
        ) : (
          <CheckCircle className="size-4" />
        )}
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => handleToggle('rejected', job.rejected)}
        className="cursor-pointer text-text-secondary hover:text-red-400"
        title={job.rejected ? 'Remove rejection' : 'Reject'}
      >
        {job.rejected ? (
          <ActiveDot className="bg-red-400" />
        ) : (
          <XCircle className="size-4" />
        )}
      </Button>
    </div>
  )
}
