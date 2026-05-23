import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/master/product-categories/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/master/product-categories/"!</div>
}
