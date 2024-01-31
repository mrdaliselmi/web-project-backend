import { IsObject, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsOptional()
  name: string;

  @IsOptional()
  description: string;

  @IsOptional()
  price: number;

  @IsOptional()
  images: string[];

  @IsOptional()
  stock: number;

  @IsOptional()
  category: string;

  @IsOptional()
  brand: string;

  @IsOptional()
  colors: string[];

  @IsOptional()
  originalPrice: number;

  @IsOptional()
  rating: number;

  @IsObject()
  specs: {
    type: string;
    numberOfKeys: number;
    keyCaps: string;
    illumination: string;
    buttons: number;
    resolution: string;
    headSupport: string;
    size: string;
    upholstery: string;
    material: string;
    connectivity: string;
  };
}
