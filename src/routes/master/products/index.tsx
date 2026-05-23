import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/master/products/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/master/products/"!</div>
}
