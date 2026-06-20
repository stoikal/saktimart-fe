import type { PosSaleItem as PosSaleItemType } from "../hooks/usePosSaleItems"


type PosSaleItemProps = {
  item: PosSaleItemType
  onRemove?: () => void
}

export function PosSaleItem(props: PosSaleItemProps) {
  return (
    <div>
      {props.item.name}

      <button onClick={props.onRemove}>remove</button>
    </div>
  )
}