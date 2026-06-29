'use client'

import { formatDistanceToNow } from 'date-fns'
import { ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { CompanyCell } from '@/components/CompanyCell'
import { ScoreBadge } from '@/components/ScoreBadge'
import { SeniorityBadge } from '@/components/SeniorityBadge'
import { SourcePill } from '@/components/SourcePill'
import { StatusButtons } from '@/components/StatusButtons'
import { TagList } from '@/components/TagList'
import { Job, JobUpdatePayload } from '@/lib/types'

interface JobDrawerProps {
  job: Job | null
  open: boolean
  onClose: () => void
  onUpdate: (id: string, payload: JobUpdatePayload) => void
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()
}

export function JobDrawer({ job, open, onClose, onUpdate }: JobDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent
        side="right"
        className="flex w-full flex-col overflow-hidden border-base-border bg-base-surface sm:max-w-2xl"
      >
        {job && (
          <>
            <SheetHeader className="border-b border-base-border pb-4">
              <div className="flex items-center gap-3 pr-8">
                <CompanyCell logo={job.logo} company={job.company} />
              </div>
              <SheetTitle className="text-xl font-semibold text-text-primary">
                {job.title}
              </SheetTitle>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <ScoreBadge score={job.score} />
                <SeniorityBadge seniority={job.seniority_match} />
                <SourcePill source={job.source} />
                {job.remote && (
                  <span className="rounded-full border border-teal-500/30 bg-teal-500/15 px-2 py-0.5 text-xs text-teal-400">
                    Remote
                  </span>
                )}
              </div>
            </SheetHeader>

            <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
              {job.summary && (
                <p className="text-sm italic text-text-secondary">
                  {job.summary}
                </p>
              )}

              <section>
                <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-text-muted">
                  Green flags
                </h3>
                <TagList tags={job.green_flags ?? []} variant="green" />
              </section>

              <section>
                <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-text-muted">
                  Red flags
                </h3>
                <TagList tags={job.red_flags ?? []} variant="red" />
              </section>

              <section>
                <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-text-muted">
                  Skills required
                </h3>
                <TagList tags={job.skills_required ?? []} variant="required" />
              </section>

              <section>
                <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-text-muted">
                  Gaps to address
                </h3>
                <TagList tags={job.skills_gap ?? []} variant="gap" />
              </section>

              <Separator className="bg-base-border" />

              <div className="flex gap-4 text-xs text-text-secondary">
                {job.posted_at && (
                  <span>
                    Posted{' '}
                    {formatDistanceToNow(new Date(job.posted_at), {
                      addSuffix: true,
                    })}
                  </span>
                )}
                {job.site && <span>via {job.site}</span>}
              </div>

              {job.description && (
                <div className="job-description whitespace-pre-wrap text-sm text-text-secondary">
                  {stripHtml(job.description)}
                </div>
              )}
            </div>

            <SheetFooter className="flex-row items-center justify-between border-t border-base-border bg-base-bg">
              <Button
                variant="outline"
                className="border-base-border"
                onClick={() => window.open(job.url, '_blank')}
              >
                <ExternalLink className="size-4" />
                Open Job
              </Button>
              <StatusButtons job={job} onUpdate={onUpdate} />
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
