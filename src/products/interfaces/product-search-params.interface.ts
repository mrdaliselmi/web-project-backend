import { PaginationParams } from 'src/common/pagination-params.interface';

export interface ProductSearchParams extends PaginationParams {
  query: string; // search query
  brands: string[]; // brand name
  categories: string[]; // category name
  minPrice: number; // minimum price
  maxPrice: number; // maximum price
  minRating: number; // minimum rating
  maxRating: number; // maximum rating
  colors: string[]; // color
  stock: boolean; // true for products in stock, false for out of stock
  sort: string; // sort by price | rating
  order: string; // asc or desc
}
