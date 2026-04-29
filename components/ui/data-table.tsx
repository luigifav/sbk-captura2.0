"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type RowSelectionState,
  type SortingState,
  type Table as ReactTable,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
  Search,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/* ─── Tipos ──────────────────────────────────────────────── */

export interface CursorPagination {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onNextPage: () => void;
  onPrevPage: () => void;
  pageSize?: number;
  totalCount?: number;
}

export interface FilterOption {
  id: string;
  label: string;
  value: string;
}

export interface FilterGroup {
  columnId: string;
  label: string;
  options: FilterOption[];
}

export interface BulkAction<TData> {
  label: string;
  onClick: (rows: TData[]) => void;
  variant?: "default" | "destructive" | "outline";
}

export interface DataTableProps<TData, TValue = unknown> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination?: CursorPagination;
  searchKey?: string;
  searchPlaceholder?: string;
  filterGroups?: FilterGroup[];
  onSelectionChange?: (rows: TData[]) => void;
  bulkActions?: BulkAction<TData>[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

/* ─── Sub-componentes internos ───────────────────────────── */

function TableSearch({
  value,
  onChange,
  placeholder = "Buscar...",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <Search
        className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400"
        aria-hidden="true"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "h-8 w-56 rounded-md border border-neutral-200 bg-white pl-8 pr-8",
          "text-sm text-neutral-900 placeholder:text-neutral-400",
          "focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand",
          "transition-colors"
        )}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
          aria-label="Limpar busca"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

function FilterChips({
  groups,
  active,
  onChange,
}: {
  groups: FilterGroup[];
  active: ColumnFiltersState;
  onChange: (filters: ColumnFiltersState) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {groups.map((group) => (
        <div key={group.columnId} className="flex items-center gap-1">
          <span className="text-xs text-neutral-400">{group.label}:</span>
          {group.options.map((opt) => {
            const isActive = active.some(
              (f) => f.id === group.columnId && f.value === opt.value
            );
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  if (isActive) {
                    onChange(active.filter((f) => f.id !== group.columnId));
                  } else {
                    onChange([
                      ...active.filter((f) => f.id !== group.columnId),
                      { id: group.columnId, value: opt.value },
                    ]);
                  }
                }}
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
                  isActive
                    ? "bg-brand text-brand-foreground"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function BulkActionsBar<TData>({
  count,
  actions,
  selectedRows,
  onClear,
}: {
  count: number;
  actions: BulkAction<TData>[];
  selectedRows: TData[];
  onClear: () => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-brand/20 bg-brand-subtle px-3 py-2">
      <span className="text-xs font-medium text-brand">
        {count} {count === 1 ? "item selecionado" : "itens selecionados"}
      </span>
      <div className="flex items-center gap-2">
        {actions.map((action, i) => (
          <Button
            key={i}
            size="sm"
            variant={
              action.variant === "destructive"
                ? "destructive"
                : action.variant === "outline"
                ? "outline"
                : "default"
            }
            className={cn(
              "h-7 text-xs",
              action.variant !== "destructive" &&
                action.variant !== "outline" &&
                "bg-brand hover:bg-brand-hover text-brand-foreground"
            )}
            onClick={() => action.onClick(selectedRows)}
          >
            {action.label}
          </Button>
        ))}
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-neutral-500 hover:text-neutral-700"
          aria-label="Limpar seleção"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

function LoadingRows({ columns }: { columns: number }) {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} className="border-b border-neutral-100">
          {Array.from({ length: columns }).map((_, j) => (
            <td key={j} className="px-3 py-3">
              <div className="h-3 w-full animate-pulse rounded bg-neutral-100" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

/* ─── DataTable ──────────────────────────────────────────── */

function DataTable<TData, TValue = unknown>({
  columns,
  data,
  pagination,
  searchKey,
  searchPlaceholder,
  filterGroups,
  onSelectionChange,
  bulkActions,
  loading = false,
  emptyMessage = "Nenhum resultado encontrado.",
  className,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [search, setSearch] = React.useState("");

  const tableData = React.useMemo(() => data, [data]);

  const table: ReactTable<TData> = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      globalFilter: search,
    },
    enableRowSelection: Boolean(onSelectionChange || bulkActions?.length),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setSearch,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const selectedRows = table
    .getSelectedRowModel()
    .rows.map((r) => r.original);

  React.useEffect(() => {
    onSelectionChange?.(selectedRows);
  }, [rowSelection]);

  const selectedCount = Object.keys(rowSelection).length;
  const hasToolbar = searchKey || filterGroups?.length;

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Toolbar */}
      {hasToolbar && (
        <div className="flex flex-wrap items-center gap-3">
          {searchKey && (
            <TableSearch
              value={search}
              onChange={setSearch}
              placeholder={searchPlaceholder}
            />
          )}
          {filterGroups && filterGroups.length > 0 && (
            <FilterChips
              groups={filterGroups}
              active={columnFilters}
              onChange={setColumnFilters}
            />
          )}
        </div>
      )}

      {/* Bulk actions */}
      {selectedCount > 0 && bulkActions && bulkActions.length > 0 && (
        <BulkActionsBar
          count={selectedCount}
          actions={bulkActions}
          selectedRows={selectedRows}
          onClear={() => setRowSelection({})}
        />
      )}

      {/* Tabela */}
      <div className="overflow-hidden rounded-lg border border-neutral-200">
        <table className="w-full border-collapse text-sm">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b border-neutral-200 bg-neutral-50">
                {hg.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();
                  const SortIcon = sorted === "asc"
                    ? ChevronUp
                    : sorted === "desc"
                    ? ChevronDown
                    : ChevronsUpDown;

                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className={cn(
                        "px-3 py-2.5 text-left text-xs font-medium text-neutral-500",
                        canSort && "cursor-pointer select-none hover:text-neutral-800"
                      )}
                      onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                    >
                      {header.isPlaceholder ? null : (
                        <span className="inline-flex items-center gap-1">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {canSort && (
                            <SortIcon
                              className={cn(
                                "h-3 w-3",
                                sorted ? "text-brand" : "text-neutral-300"
                              )}
                              aria-hidden="true"
                            />
                          )}
                        </span>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-neutral-100 bg-white">
            {loading ? (
              <LoadingRows columns={columns.length} />
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-12 text-center text-sm text-neutral-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                  className={cn(
                    "transition-colors hover:bg-neutral-50",
                    row.getIsSelected() && "bg-brand-subtle"
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-3 py-2.5 text-neutral-700">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação cursor-based */}
      {pagination && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-neutral-400">
            {pagination.totalCount !== undefined
              ? `${pagination.totalCount} registros`
              : ""}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={pagination.onPrevPage}
              disabled={!pagination.hasPrevPage}
              className="h-7 gap-1 text-xs"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={pagination.onNextPage}
              disabled={!pagination.hasNextPage}
              className="h-7 gap-1 text-xs"
            >
              Próxima
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

DataTable.displayName = "DataTable";

export { DataTable };
