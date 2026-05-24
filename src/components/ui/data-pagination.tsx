import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination"

interface DataPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

function getVisiblePages(currentPage: number, totalPages: number): (number | string)[] {
  const pages: (number | string)[] = []

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
    return pages
  }

  // Always show page 1
  pages.push(1)

  const showLeftEllipsis = currentPage > 3
  const showRightEllipsis = currentPage < totalPages - 2

  if (showLeftEllipsis) {
    pages.push("...")
  }

  let startPage: number
  let endPage: number

  if (!showLeftEllipsis && showRightEllipsis) {
    startPage = 2
    endPage = 4
  } else if (showLeftEllipsis && !showRightEllipsis) {
    startPage = totalPages - 3
    endPage = totalPages - 1
  } else {
    startPage = currentPage - 1
    endPage = currentPage + 1
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  if (showRightEllipsis) {
    pages.push("...")
  }

  if (!pages.includes(totalPages)) {
    pages.push(totalPages)
  }

  return pages
}

export function DataPagination({
  currentPage,
  totalPages,
  onPageChange,
}: DataPaginationProps) {
  if (totalPages < 1) return null

  const pages = getVisiblePages(currentPage, totalPages)

  return (
    <Pagination className="justify-end">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault()
              if (currentPage > 1) onPageChange(currentPage - 1)
            }}
          />
        </PaginationItem>

        {pages.map((page, index) => (
          <PaginationItem key={index}>
            {page === "..." ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href="#"
                isActive={page === currentPage}
                onClick={(e) => {
                  e.preventDefault()
                  onPageChange(page as number)
                }}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault()
              if (currentPage < totalPages) onPageChange(currentPage + 1)
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
