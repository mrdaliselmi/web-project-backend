import { IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  imageUrl: string;

  @IsNotEmpty()
  stock: number;

  @IsNotEmpty()
  category: string;

  @IsNotEmpty()
  brand: string;

  @IsNotEmpty()
  color: string;
}
