import { useMutation, useQueryClient } from "@tanstack/react-query"
import { customerQueries } from "../queries"
import type { CreateCustomerInput } from "../schemas"
import { env } from "@/lib/env"

export function useCreateCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (values: CreateCustomerInput) => {
      const response = await fetch(env.API_BASE_URL + "/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message)
      }
      return data
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: customerQueries.all(),
      })
    },
  })
}
