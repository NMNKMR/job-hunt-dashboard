'use client'

import { useEffect, useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { JobFilters, JobStatus } from '@/lib/types'

interface FilterBarProps {
  filters: JobFilters
  onChange: (filters: JobFilters) => void
  totalCount: number
}

const STATUS_TABS: { value: JobStatus; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'bookmarked', label: 'Bookmarked' },
  { value: 'applied', label: 'Applied' },
  { value: 'rejected', label: 'Rejected' },
]

export const DEFAULT_FILTERS: JobFilters = {
  status: 'all',
  minScore: 0,
  remote: false,
  source: 'all',
  search: '',
}

export function FilterBar({ filters, onChange, totalCount }: FilterBarProps) {
  const [searchInput, setSearchInput] = useState(filters.search)
  const filtersRef = useRef(filters)
  filtersRef.current = filters

  useEffect(() => {
    setSearchInput(filters.search)
  }, [filters.search])

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange({ ...filtersRef.current, search: searchInput })
    }, 300)
    return () => clearTimeout(timer)
  }, [searchInput, onChange])

  function update(partial: Partial<JobFilters>) {
    onChange({ ...filters, ...partial })
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Tabs
        value={filters.status}
        onValueChange={(value) => update({ status: value as JobStatus })}
      >
        <TabsList variant="line">
          {STATUS_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Input
        placeholder="Search title or company…"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className="h-8 w-56 border-base-border bg-base-surface"
      />

      <div className="flex w-40 flex-col gap-1">
        <span className="text-xs text-text-secondary">
          Score ≥ {filters.minScore}
        </span>
        <Slider
          min={0}
          max={100}
          step={5}
          value={[filters.minScore]}
          onValueChange={(value) => {
            const next = Array.isArray(value) ? value[0] : value
            update({ minScore: next ?? 0 })
          }}
        />
      </div>

      <div className="flex items-center gap-2">
        <Switch
          id="remote-toggle"
          checked={filters.remote}
          onCheckedChange={(checked) => update({ remote: checked })}
        />
        <label htmlFor="remote-toggle" className="text-sm text-text-secondary">
          Remote only
        </label>
      </div>

      <Select
        value={filters.source}
        onValueChange={(value) => update({ source: value ?? 'all' })}
      >
        <SelectTrigger className="h-8 border-base-border bg-base-surface">
          <SelectValue placeholder="Source" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Sources</SelectItem>
          <SelectItem value="jsearch_fe">FE</SelectItem>
          <SelectItem value="jsearch_be">BE</SelectItem>
          <SelectItem value="jsearch_ai">AI</SelectItem>
        </SelectContent>
      </Select>

      <span className="ml-auto text-sm text-text-secondary">
        {totalCount} jobs
      </span>
    </div>
  )
}
