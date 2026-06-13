import { env } from "@/lib/env"
import { queryOptions } from "@tanstack/react-query"

export const productQueries = {
  all: () => ["todos"] as const,
  lists: () => [...productQueries.all(), "list"] as const,
  list: (param: ListProductParam) =>
    queryOptions({
      queryKey: [...productQueries.lists(), param],
      queryFn: async () => {
        const query = new URLSearchParams({
          page: String(param.page),
          size: String(param.pageSize),
        })

        const res = await fetch(
          `${env.API_BASE_URL}/api/products?${query.toString()}`
        )

        return await res.json()
      },
      staleTime: 1000 * 30,
    }),
}

export type ListProductParam = {
  page: number
  pageSize: number
}