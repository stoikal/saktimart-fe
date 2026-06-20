export type Product = {
  idProduct: string
  sku: string
  name?: string
  description?: string
  barcode?: string
  categories: Array<{
    idProductCategory: string
    name: string
  }>
}