export default function SaleItemInput() {
  return (
    <div className="flex gap-2 items-center border-b pb-4 mb-4">
      <button
        disabled
        type="button"
        className="bg-red-500 disabled:bg-gray-400 text-white px-3 py-2 rounded hover:bg-red-600"
      >
        Delete
      </button>
      <input
        type="text"
        placeholder="Barcode / Quick Code"
        className="border p-2 rounded"
      />
      <input
        type="text"
        disabled
        placeholder="Product Name"
        className="border p-2 rounded bg-gray-100"
      />
      <input
        type="number"
        disabled
        placeholder="Qty"
        className="border p-2 rounded bg-gray-100 w-20"
      />
      <input
        type="number"
        disabled
        placeholder="Subtotal"
        className="border p-2 rounded bg-gray-100 w-24"
      />
    </div>
  );
}
