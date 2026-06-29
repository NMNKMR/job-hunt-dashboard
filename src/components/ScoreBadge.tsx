'use client'

import { cn } from '@/lib/utils'

interface ScoreBadgeProps {
  score: number | null
}

export function ScoreBadge({ score }: ScoreBadgeProps) {
  if (score === null) {
    return (
      <span className="inline-flex items-center rounded-full border border-base-muted bg-base-muted px-2 py-0.5 font-mono text-xs text-text-muted">
        —
      </span>
    )
  }

  const colorClass =
    score >= 80
      ? 'bg-score-high/15 text-score-high border-score-high/30'
      : score >= 60
        ? 'bg-score-mid/15 text-score-mid border-score-mid/30'
        : 'bg-score-low/15 text-score-low border-score-low/30'

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-xs font-medium',
        colorClass
      )}
    >
      {score}
    </span>
  )
}
