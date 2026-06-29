'use client'

import { SeniorityMatch } from '@/lib/types'
import { cn } from '@/lib/utils'

interface SeniorityBadgeProps {
  seniority: SeniorityMatch | null
}

const SENIORITY_CONFIG: Record<
  SeniorityMatch,
  { label: string; className: string }
> = {
  under: {
    label: 'under',
    className: 'bg-green-500/15 text-green-400 border-green-500/30',
  },
  match: {
    label: 'match',
    className: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
  },
  over: {
    label: 'over',
    className: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  },
}

export function SeniorityBadge({ seniority }: SeniorityBadgeProps) {
  if (!seniority) {
    return <span className="text-text-muted text-xs">—</span>
  }

  const config = SENIORITY_CONFIG[seniority]

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-xs capitalize',
        config.className
      )}
    >
      {config.label}
    </span>
  )
}
