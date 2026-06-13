import {
  type Cell,
  type ColumnDef,
  type Row,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVerticalIcon } from "lucide-react"
import { useMemo } from "react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  rowIdKey?: keyof TData
  reorderable?: boolean
  onReorder?: (items: TData[]) => void
}

function DraggableRow<TData>({
  row,
  rowIdKey,
}: {
  row: Row<TData>
  rowIdKey: keyof TData
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: String(row.original[rowIdKey]) })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      data-state={isDragging ? "selected" : undefined}
    >
      {row.getVisibleCells().map((cell: Cell<TData, unknown>) => {
        const isDragCell = cell.column.id === "drag"
        return (
          <TableCell
            key={cell.id}
            {...(isDragCell ? { ...attributes, ...listeners } : {})}
            className={isDragCell ? "w-10 cursor-grab select-none text-muted-foreground" : undefined}
          >
            {isDragCell ? <GripVerticalIcon className="size-4" /> : flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        )
      })}
    </TableRow>
  )
}

export function DataTable<TData, TValue>({
  columns,
  data,
  className,
  rowIdKey,
  reorderable = false,
  onReorder,
}: React.ComponentProps<"div"> & DataTableProps<TData, TValue>) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const allColumns = useMemo(() => {
    if (!reorderable) return columns
    return [
      {
        id: "drag",
        header: "",
        size: 40,
      } as ColumnDef<TData, TValue>,
      ...columns,
    ]
  }, [columns, reorderable])

  const table = useReactTable({
    data,
    columns: allColumns,
    getCoreRowModel: getCoreRowModel(),
  })

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = data.findIndex(
      (item) => String(item[rowIdKey!]) === active.id
    )
    const newIndex = data.findIndex(
      (item) => String(item[rowIdKey!]) === over.id
    )

    if (oldIndex === -1 || newIndex === -1) return

    const result = [...data]
    const [removed] = result.splice(oldIndex, 1)
    result.splice(newIndex, 0, removed)

    onReorder?.(result)
  }

  const tableContent = (
    <div className={cn("overflow-hidden border", className)}>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
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
          {table.getRowModel().rows?.length ? (
            reorderable && rowIdKey ? (
              table.getRowModel().rows.map((row) => (
                <DraggableRow
                  key={row.id}
                  row={row}
                  rowIdKey={rowIdKey!}
                />
              ))
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )
          ) : (
            <TableRow>
              <TableCell colSpan={allColumns.length} className="h-24 text-center">
                Kosong.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )

  if (!reorderable) return tableContent

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={data.map((item) => String(item[rowIdKey!]))}
        strategy={verticalListSortingStrategy}
      >
        {tableContent}
      </SortableContext>
    </DndContext>
  )
}
