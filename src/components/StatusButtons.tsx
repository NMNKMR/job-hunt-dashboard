'use client'

import { Bookmark, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Job, JobUpdatePayload } from '@/lib/types'
import { cn } from '@/lib/utils'

interface StatusButtonsProps {
  job: Job
  onUpdate: (id: string, payload: JobUpdatePayload) => void
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
        className={cn(
          'text-text-secondary hover:text-indigo-400',
          job.bookmarked && 'text-indigo-400'
        )}
        title="Bookmark"
      >
        <Bookmark className={cn('size-4', job.bookmarked && 'fill-current')} />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => handleToggle('applied', job.applied)}
        className={cn(
          'text-text-secondary hover:text-green-400',
          job.applied && 'text-green-400'
        )}
        title="Applied"
      >
        <CheckCircle className={cn('size-4', job.applied && 'fill-current')} />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => handleToggle('rejected', job.rejected)}
        className={cn(
          'text-text-secondary hover:text-red-400',
          job.rejected && 'text-red-400'
        )}
        title="Reject"
      >
        <XCircle className={cn('size-4', job.rejected && 'fill-current')} />
      </Button>
    </div>
  )
}
