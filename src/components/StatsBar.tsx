'use client'

import { JobStats, JobStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

interface StatsBarProps {
  stats: JobStats
  activeStatus: JobStatus
  onStatusClick: (status: JobStatus) => void
}

const STAT_ITEMS: { key: keyof JobStats; label: string; status: JobStatus }[] =
  [
    { key: 'new', label: 'New', status: 'all' },
    { key: 'bookmarked', label: 'Bookmarked', status: 'bookmarked' },
    { key: 'applied', label: 'Applied', status: 'applied' },
    { key: 'rejected', label: 'Rejected', status: 'rejected' },
  ]

export function StatsBar({ stats, activeStatus, onStatusClick }: StatsBarProps) {
  return (
    <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:items-center sm:gap-3">
      {STAT_ITEMS.map((item) => (
        <button
          key={item.key}
          type="button"
          onClick={() => onStatusClick(item.status)}
          className={cn(
            'cursor-pointer rounded-lg border px-3 py-1.5 text-center transition-colors',
            activeStatus === item.status
              ? 'border-indigo-500/40 bg-indigo-500/10'
              : 'border-base-border bg-base-surface hover:bg-base-muted/50'
          )}
        >
          <div className="font-mono text-sm font-medium text-text-primary">
            {stats[item.key]}
          </div>
          <div className="text-xs text-text-secondary">{item.label}</div>
        </button>
      ))}
    </div>
  )
}
