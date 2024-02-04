export interface ProductsOrderDto {
  id: number;
  quantity: number;
}
export class CreateOrderDto {
  deliveryAddress: string;
  Products: ProductsOrderDto[];
}
