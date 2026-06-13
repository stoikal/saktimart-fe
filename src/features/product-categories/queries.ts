import { env } from "@/lib/env"
import { queryOptions } from "@tanstack/react-query"

export const productCategoryQueries = {
  all: () => ["product-categories"] as const,
  lists: () => [...productCategoryQueries.all(), "list"] as const,
  list: (param: ListProductCategoryParam) =>
    queryOptions({
      queryKey: [...productCategoryQueries.lists(), param],
      queryFn: async () => {
        const query = new URLSearchParams({
          page: String(param.page),
          size: String(param.pageSize),
        })

        const res = await fetch(
          `${env.API_BASE_URL}/api/product-categories?${query.toString()}`
        )

        return await res.json()
      },
      staleTime: 1000 * 30,
    }),
}

export type ListProductCategoryParam = {
  page: number
  pageSize: number
}
