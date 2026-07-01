'use client'

import { Job } from '@/lib/types'

interface StatsBarProps {
  jobs: Job[]
}

export function StatsBar({ jobs }: StatsBarProps) {
  const total = jobs.length
  const applied = jobs.filter((j) => j.applied).length
  const bookmarked = jobs.filter((j) => j.bookmarked).length
  const scored = jobs.filter((j) => j.score !== null)
  const avgScore =
    scored.length > 0
      ? Math.round(
          scored.reduce((sum, j) => sum + (j.score ?? 0), 0) / scored.length
        )
      : null

  const stats = [
    { label: 'Total', value: total.toString() },
    { label: 'Applied', value: applied.toString() },
    { label: 'Bookmarked', value: bookmarked.toString() },
    {
      label: 'Avg Score',
      value: avgScore !== null ? avgScore.toString() : '—',
    },
  ]

  return (
    <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:items-center sm:gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-lg border border-base-border bg-base-surface px-3 py-1.5 text-center"
        >
          <div className="font-mono text-sm font-medium text-text-primary">
            {stat.value}
          </div>
          <div className="text-xs text-text-secondary">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}
