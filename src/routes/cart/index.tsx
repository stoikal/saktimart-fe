import PosSale from '@/features/cart/components/Cart'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/cart/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="p-6">
      <PosSale />
    </div>
  )
}
