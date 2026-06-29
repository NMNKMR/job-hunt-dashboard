'use client'

import { cn } from '@/lib/utils'

interface SourcePillProps {
  source: string
}

const SOURCE_CONFIG: Record<string, { label: string; className: string }> = {
  jsearch_fe: {
    label: 'FE',
    className: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
  },
  jsearch_be: {
    label: 'BE',
    className: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
  },
  jsearch_ai: {
    label: 'AI',
    className: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  },
}

export function SourcePill({ source }: SourcePillProps) {
  const config = SOURCE_CONFIG[source] ?? {
    label: source,
    className: 'bg-base-muted text-text-secondary border-base-border',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-xs',
        config.className
      )}
    >
      {config.label}
    </span>
  )
}
