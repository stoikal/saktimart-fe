import { env } from "@/lib/env"
import { queryOptions } from "@tanstack/react-query"

export const customerQueries = {
  all: () => ["customers"] as const,
  lists: () => [...customerQueries.all(), "list"] as const,
  list: (page: number, pageSize: number) =>
    queryOptions({
      queryKey: [...customerQueries.lists(), { page, pageSize }],
      queryFn: async () => {
        const query = new URLSearchParams({
          page: String(page),
          size: String(pageSize),
        })

        const res = await fetch(
          `${env.API_BASE_URL}/api/customers?${query.toString()}`
        )

        return await res.json()
      },
      staleTime: 1000 * 30,
    }),
}
