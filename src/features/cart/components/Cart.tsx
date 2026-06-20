import usePosSaleItems from "../hooks/usePosSaleItems"
import { PosSaleItem } from "./CartItem"

export default function PosSale() {
  const { items, remove, push } = usePosSaleItems()

  return (
    <div>
      hello
      {items.map((item, index) => (
        <PosSaleItem key={index} item={item} onRemove={() => remove(index)} />
      ))}

      <button onClick={() => push({ name: String(Math.random())})}>Push</button>
    </div>
  )
}
