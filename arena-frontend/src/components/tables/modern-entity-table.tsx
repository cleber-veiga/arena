"use client"

import type { ReactNode } from "react"
import { Check, ChevronDown, Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

type ModernEntityTableColumn<TItem> = {
  key: string
  header: string
  className?: string
  cell: (item: TItem) => ReactNode
}

type ModernEntityTableProps<TItem> = {
  title: string
  description: string
  addButtonLabel: string
  filterPlaceholder: string
  filterValue: string
  onFilterValueChange: (value: string) => void
  onAddNew: () => void
  rows: TItem[]
  rowKey: (item: TItem) => string | number
  columns: ModernEntityTableColumn<TItem>[]
  page: number
  rowsPerPage: number
  totalItems: number
  totalPages: number
  onRowsPerPageChange: (size: number) => void
  onPageChange: (page: number) => void
  onPrevPage: () => void
  onNextPage: () => void
  emptyMessage: string
}

function buildPageItems(totalPages: number, currentPage: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const pages: Array<number | "ellipsis"> = [1]
  let left = Math.max(2, currentPage - 1)
  let right = Math.min(totalPages - 1, currentPage + 1)

  if (currentPage <= 3) right = 4
  if (currentPage >= totalPages - 2) left = totalPages - 3

  if (left > 2) pages.push("ellipsis")

  for (let page = left; page <= right; page += 1) {
    pages.push(page)
  }

  if (right < totalPages - 1) pages.push("ellipsis")
  pages.push(totalPages)

  return pages
}

export function ModernEntityTable<TItem>({
  title,
  description,
  addButtonLabel,
  filterPlaceholder,
  filterValue,
  onFilterValueChange,
  onAddNew,
  rows,
  rowKey,
  columns,
  page,
  rowsPerPage,
  totalItems,
  totalPages,
  onRowsPerPageChange,
  onPageChange,
  onPrevPage,
  onNextPage,
  emptyMessage,
}: ModernEntityTableProps<TItem>) {
  const start = totalItems === 0 ? 0 : (page - 1) * rowsPerPage + 1
  const end = totalItems === 0 ? 0 : start + rows.length - 1
  const pageItems = buildPageItems(totalPages, page)

  return (
    <Card className="overflow-hidden gap-0 py-0">
      <CardHeader className="border-b bg-muted/30 pt-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="text-2xl">{title}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
          <Button type="button" onClick={onAddNew}>
            <Plus className="mr-2 size-4" />
            {addButtonLabel}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-4 md:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="outline" size="sm" className="h-9 gap-1.5">
                {rowsPerPage} por pagina
                <ChevronDown className="size-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {[5, 10, 50, 100].map((option) => (
                <DropdownMenuItem
                  key={option}
                  onClick={() => onRowsPerPageChange(option)}
                  className="gap-2"
                >
                  {rowsPerPage === option ? <Check className="size-4" /> : <span className="size-4" />}
                  {option}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="relative min-w-[280px] flex-1 max-w-lg">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={filterValue}
              onChange={(event) => onFilterValueChange(event.target.value)}
              className="h-9 rounded-lg border-border/80 bg-background pl-9"
              placeholder={filterPlaceholder}
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border/80 bg-card">
          <Table
            className={cn(
              "[&_th]:h-11 [&_th]:bg-muted/65 [&_th]:font-semibold",
              "[&_th]:text-foreground/95 [&_th]:shadow-[inset_0_-1px_0_hsl(var(--border))]",
              "[&_th:not(:last-child)]:border-r [&_th:not(:last-child)]:border-border",
              "[&_td:not(:last-child)]:border-r [&_td:not(:last-child)]:border-border/80",
              "[&_tbody_tr]:border-b [&_tbody_tr]:border-border/70",
              "[&_tbody_tr:nth-child(odd)]:bg-muted/[0.28]",
              "[&_tbody_tr:nth-child(even)]:bg-background",
              "[&_tbody_tr:hover]:bg-accent/45"
            )}
          >
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {columns.map((column) => (
                  <TableHead key={column.key} className={column.className}>
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {rows.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((item) => (
                  <TableRow key={rowKey(item)}>
                    {columns.map((column) => (
                      <TableCell key={column.key} className={column.className}>
                        {column.cell(item)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <p className="text-muted-foreground">
            Exibindo {start}-{end} de {totalItems} registros
          </p>
          <Pagination className="mx-0 w-auto justify-start sm:justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  className={cn(page === 1 && "pointer-events-none opacity-50")}
                  onClick={(event) => {
                    event.preventDefault()
                    if (page > 1) onPrevPage()
                  }}
                />
              </PaginationItem>

              {pageItems.map((item, index) => (
                <PaginationItem key={`${item}-${index}`}>
                  {item === "ellipsis" ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      href="#"
                      isActive={page === item}
                      onClick={(event) => {
                        event.preventDefault()
                        if (item !== page) onPageChange(item)
                      }}
                    >
                      {item}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  className={cn(page === totalPages && "pointer-events-none opacity-50")}
                  onClick={(event) => {
                    event.preventDefault()
                    if (page < totalPages) onNextPage()
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  )
}
