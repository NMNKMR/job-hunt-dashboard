'use client'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface TagListProps {
  tags: string[]
  variant: 'gap' | 'required' | 'green' | 'red'
}

const VARIANT_STYLES: Record<TagListProps['variant'], string> = {
  gap: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  required: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  green: 'bg-green-500/15 text-green-400 border-green-500/30',
  red: 'bg-red-500/15 text-red-400 border-red-500/30',
}

const MAX_VISIBLE = 4

export function TagList({ tags, variant }: TagListProps) {
  if (!tags || tags.length === 0) {
    return <span className="text-text-muted text-xs">None</span>
  }

  const visible = tags.slice(0, MAX_VISIBLE)
  const overflow = tags.slice(MAX_VISIBLE)

  return (
    <div className="flex flex-wrap gap-1.5">
      {visible.map((tag) => (
        <span
          key={tag}
          className={cn(
            'inline-flex items-center rounded-full border px-2 py-0.5 text-xs',
            VARIANT_STYLES[variant]
          )}
        >
          {tag}
        </span>
      ))}
      {overflow.length > 0 && (
        <Tooltip>
          <TooltipTrigger
            render={
              <span
                className={cn(
                  'inline-flex cursor-default items-center rounded-full border px-2 py-0.5 text-xs',
                  VARIANT_STYLES[variant]
                )}
              />
            }
          >
            +{overflow.length} more
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs">{overflow.join(', ')}</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  )
}
