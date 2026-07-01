'use client'

import { useCallback, useEffect, useState } from 'react'
import { FilterBar, DEFAULT_FILTERS } from '@/components/FilterBar'
import { JobDrawer } from '@/components/JobDrawer'
import { JobsTable } from '@/components/JobsTable'
import { StatsBar } from '@/components/StatsBar'
import { Job, JobFilters, JobUpdatePayload } from '@/lib/types'

function applyOptimisticUpdate(job: Job, payload: JobUpdatePayload): Job {
  const updated = { ...job, ...payload }

  if ('applied' in payload) {
    updated.applied_at = payload.applied ? new Date().toISOString() : null
  }
  if ('bookmarked' in payload) {
    updated.bookmarked_at = payload.bookmarked
      ? new Date().toISOString()
      : null
  }
  if ('rejected' in payload) {
    updated.rejected_at = payload.rejected ? new Date().toISOString() : null
    if (payload.rejected) {
      updated.applied = false
      updated.bookmarked = false
      updated.applied_at = null
      updated.bookmarked_at = null
    }
  }

  return updated
}

function hasUserAction(job: Job): boolean {
  return job.applied || job.bookmarked || job.rejected
}

export default function HomePage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<JobFilters>(DEFAULT_FILTERS)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const fetchJobs = useCallback(async (f: JobFilters) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        status: f.status,
        minScore: f.minScore.toString(),
        remote: f.remote.toString(),
        source: f.source,
        search: f.search,
      })
      const res = await fetch(`/api/jobs?${params}`)
      const data = await res.json()
      if (Array.isArray(data)) {
        setJobs(data)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchJobs(filters)
  }, [filters, fetchJobs])

  async function handleUpdate(id: string, payload: JobUpdatePayload) {
    const previousJobs = jobs
    const previousSelected = selectedJob
    const job = jobs.find((j) => j.id === id)
    const optimistic = job ? applyOptimisticUpdate(job, payload) : null

    if (filters.status === 'all' && optimistic && hasUserAction(optimistic)) {
      setJobs((prev) => prev.filter((j) => j.id !== id))
      if (selectedJob?.id === id) {
        setSelectedJob(null)
        setDrawerOpen(false)
      }
    } else if (optimistic) {
      setJobs((prev) =>
        prev.map((j) => (j.id === id ? optimistic : j))
      )
      if (selectedJob?.id === id) setSelectedJob(optimistic)
    }

    try {
      const res = await fetch(`/api/jobs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Update failed')
      const updated = await res.json()
      if (filters.status === 'all' && hasUserAction(updated)) {
        setJobs((prev) => prev.filter((j) => j.id !== id))
      } else {
        setJobs((prev) => prev.map((j) => (j.id === id ? updated : j)))
        if (selectedJob?.id === id) setSelectedJob(updated)
      }
    } catch {
      setJobs(previousJobs)
      setSelectedJob(previousSelected)
    }
  }

  function handleRowClick(job: Job) {
    setSelectedJob(job)
    setDrawerOpen(true)
  }

  return (
    <main className="min-h-screen bg-base-bg text-text-primary">
      <header className="flex flex-col gap-4 border-b border-base-border px-4 py-4 sm:px-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-lg font-semibold">Job Hunt</h1>
          <p className="text-sm text-text-secondary">AI-scored job pipeline</p>
        </div>
        <StatsBar jobs={jobs} />
      </header>

      <div className="border-b border-base-border px-4 py-3 sm:px-6">
        <FilterBar
          filters={filters}
          onChange={setFilters}
          totalCount={jobs.length}
        />
      </div>

      <div className="px-4 py-4 sm:px-6">
        <JobsTable
          jobs={jobs}
          loading={loading}
          onRowClick={handleRowClick}
          onUpdate={handleUpdate}
          onResetFilters={() => setFilters(DEFAULT_FILTERS)}
        />
      </div>

      <JobDrawer
        job={selectedJob}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onUpdate={handleUpdate}
      />
    </main>
  )
}
