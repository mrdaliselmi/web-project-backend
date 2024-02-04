import { IsNotEmpty } from 'class-validator';

export interface ProductsOrderDto {
  id: number;
  quantity: number;
}
export class CreateOrderDto {
  @IsNotEmpty()
  firstname: string;
  @IsNotEmpty()
  lastname: string;
  @IsNotEmpty()
  streetAddress: string;
  @IsNotEmpty()
  apt: string;
  @IsNotEmpty()
  city: string;
  @IsNotEmpty()
  state: string;
  @IsNotEmpty()
  zip: number;
  @IsNotEmpty()
  phone: string;
  Products: ProductsOrderDto[];
}
