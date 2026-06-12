import { Toaster } from "@/components/ui/sonner"
import { createRootRoute, Link, Outlet } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"

const RootLayout = () => (
  <>
    <div className="flex gap-2 p-2">
      <Link to="/" className="[&.active]:font-bold">
        Beranda
      </Link>
      <Link to="/products" className="[&.active]:font-bold">
        Produk
      </Link>
      <Link to="/product-categories" className="[&.active]:font-bold">
       Kategori Produk
      </Link>
    </div>
    <hr />
    <Outlet />
    <Toaster position="top-right" />
    <TanStackRouterDevtools />
  </>
)

export const Route = createRootRoute({ component: RootLayout })
