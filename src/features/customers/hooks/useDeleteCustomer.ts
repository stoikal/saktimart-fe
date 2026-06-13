import { env } from "@/lib/env"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { customerQueries } from "../queries"

export function useDeleteCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (idCustomer: string) => {
      const response = await fetch(
        env.API_BASE_URL + "/api/customers/" + idCustomer,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message)
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: customerQueries.all(),
      })
    },
  })
}
