import { Card, CardContent } from '@/components/ui/card'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/pos/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="p-6">
      <Card>
        <CardContent>Hello</CardContent>
      </Card>
    </div>
  )
}
