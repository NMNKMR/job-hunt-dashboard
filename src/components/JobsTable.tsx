'use client'

import { useMemo } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { formatDistanceToNow } from 'date-fns'
import { ArrowUpDown, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CompanyCell } from '@/components/CompanyCell'
import { ScoreBadge } from '@/components/ScoreBadge'
import { SeniorityBadge } from '@/components/SeniorityBadge'
import { SourcePill } from '@/components/SourcePill'
import { StatusButtons } from '@/components/StatusButtons'
import { Job, JobUpdatePayload } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface JobsTableProps {
  jobs: Job[]
  loading: boolean
  onRowClick: (job: Job) => void
  onUpdate: (id: string, payload: JobUpdatePayload) => void
  onResetFilters?: () => void
}

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <TableRow key={i} className="border-base-border">
          {Array.from({ length: 8 }).map((__, j) => (
            <TableCell key={j}>
              <div className="h-4 animate-pulse rounded bg-base-muted" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}

export function JobsTable({
  jobs,
  loading,
  onRowClick,
  onUpdate,
  onResetFilters,
}: JobsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'score', desc: true },
  ])

  const columns = useMemo<ColumnDef<Job>[]>(
    () => [
      {
        id: 'score',
        accessorKey: 'score',
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 h-8 text-text-secondary"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Score
            <ArrowUpDown className="size-3.5" />
          </Button>
        ),
        cell: ({ row }) => <ScoreBadge score={row.original.score} />,
        sortingFn: (a, b) => {
          const av = a.original.score ?? -1
          const bv = b.original.score ?? -1
          return av - bv
        },
      },
      {
        id: 'company',
        accessorKey: 'company',
        header: 'Company',
        cell: ({ row }) => (
          <CompanyCell logo={row.original.logo} company={row.original.company} />
        ),
        enableSorting: false,
      },
      {
        id: 'title',
        accessorKey: 'title',
        header: 'Role',
        cell: ({ row }) => (
          <span className="block max-w-xs truncate text-sm text-text-primary">
            {row.original.title}
          </span>
        ),
        enableSorting: false,
      },
      {
        id: 'source',
        accessorKey: 'source',
        header: 'Source',
        cell: ({ row }) => <SourcePill source={row.original.source} />,
        enableSorting: false,
      },
      {
        id: 'remote',
        accessorKey: 'remote',
        header: 'Remote',
        cell: ({ row }) =>
          row.original.remote ? (
            <Check className="size-4 text-green-400" />
          ) : (
            <span className="text-text-muted">—</span>
          ),
        enableSorting: false,
      },
      {
        id: 'seniority',
        accessorKey: 'seniority_match',
        header: 'Seniority',
        cell: ({ row }) => (
          <SeniorityBadge seniority={row.original.seniority_match} />
        ),
        enableSorting: false,
      },
      {
        id: 'posted',
        accessorKey: 'posted_at',
        header: 'Posted',
        cell: ({ row }) =>
          row.original.posted_at ? (
            <span className="text-xs text-text-secondary whitespace-nowrap">
              {formatDistanceToNow(new Date(row.original.posted_at), {
                addSuffix: true,
              })}
            </span>
          ) : (
            <span className="text-text-muted">—</span>
          ),
        enableSorting: false,
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <StatusButtons job={row.original} onUpdate={onUpdate} />
        ),
        enableSorting: false,
      },
    ],
    [onUpdate]
  )

  const table = useReactTable({
    data: jobs,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  if (!loading && jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <p className="text-text-secondary">No jobs match your filters</p>
        <Button
          variant="outline"
          className="border-base-border"
          onClick={onResetFilters}
        >
          Adjust filters
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-base-border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-base-border hover:bg-transparent">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="text-text-secondary"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {loading ? (
            <SkeletonRows />
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className={cn(
                  'job-row border-base-border',
                  row.original.rejected && 'rejected'
                )}
                onClick={() => onRowClick(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
