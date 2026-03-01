import { createFileRoute } from "@tanstack/react-router";
import SaleItemInput from "./-components/SaleItemInput";
// import { useState } from "react";
// import SaleItem from "./-components/SaleItem";
// import type { SaleItemCandidate } from "../../types/domain";

export const Route = createFileRoute("/pos/")({
  component: RouteComponent,
});

function RouteComponent() {
  // const salesItems = useState<SaleItemCandidate[]>([])

  return (
    <div>
      <div>POS</div>
      <SaleItemInput />
    </div>
  );
}
