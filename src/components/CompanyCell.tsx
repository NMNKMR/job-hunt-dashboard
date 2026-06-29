'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface CompanyCellProps {
  logo: string | null
  company: string
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

function hashColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hues = [220, 260, 300, 340, 180, 200]
  return `hsl(${hues[Math.abs(hash) % hues.length]}, 60%, 45%)`
}

export function CompanyCell({ logo, company }: CompanyCellProps) {
  const [imgError, setImgError] = useState(false)
  const showInitials = !logo || imgError

  return (
    <div className="flex min-w-[160px] items-center gap-2">
      {showInitials ? (
        <div
          className="flex size-6 shrink-0 items-center justify-center rounded text-[10px] font-medium text-white"
          style={{ backgroundColor: hashColor(company) }}
        >
          {getInitials(company)}
        </div>
      ) : (
        <img
          src={logo}
          alt={company}
          className="size-6 shrink-0 rounded object-cover"
          onError={() => setImgError(true)}
        />
      )}
      <span className={cn('truncate text-sm')}>{company}</span>
    </div>
  )
}
