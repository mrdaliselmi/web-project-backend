import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductSearchParams } from './interfaces/product-search-params.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { PaginationParams } from 'src/common/pagination-params.interface';
import { CustomerProduct } from 'src/customer-product/entities/customer-product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(CustomerProduct)
    private readonly cpRepository: Repository<CustomerProduct>,
  ) {}

  async create(createProductDtos: CreateProductDto[]) {
    const productsToSave = [];
    for (const createProductDto of createProductDtos) {
      const colors = JSON.stringify(createProductDto.colors);
      const images = JSON.stringify(createProductDto.images);

      const product = this.productRepository.create({
        ...createProductDto,
        colors,
        images,
      });

      productsToSave.push(product);
    }

    await this.productRepository.save(productsToSave);
  }

  async findAll(params: PaginationParams) {
    const { limit, skip } = params;

    const [products, totalCount] = await this.productRepository.findAndCount({
      take: limit,
      skip: skip * limit,
    });

    products.forEach((product) => {
      product.images = JSON.parse(product.images);
      product.colors = JSON.parse(product.colors);
    });

    return { data: { products, totalCount } };
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({ where: { id: id } });

    if (product) {
      // Parse the JSON strings back to arrays for images and colors
      product.images = JSON.parse(product.images);
      product.colors = JSON.parse(product.colors);
    }

    return { data: product };
  }

  async search(searchParams: ProductSearchParams) {
    const {
      query,
      brands,
      categories,
      minPrice,
      maxPrice,
      minRating,
      maxRating,
      colors,
      stock,
      sort,
      order,
      limit,
      skip,
    } = searchParams;
    const queryBuilder = this.productRepository.createQueryBuilder('product');

    // Filtering
    if (query) {
      queryBuilder.andWhere(
        '(product.name LIKE :query OR product.description LIKE :query)',
        { query: `%${query}%` },
      );
    }
    if (brands && brands.length > 0) {
      queryBuilder.andWhere('product.brand IN (:...brands)', { brands });
    }
    if (categories && categories.length > 0) {
      queryBuilder.andWhere('product.category IN (:...categories)', {
        categories,
      });
    }
    if (minPrice !== undefined) {
      queryBuilder.andWhere('product.price >= :minPrice', { minPrice });
    }
    if (maxPrice !== undefined) {
      queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice });
    }
    if (minRating !== undefined) {
      queryBuilder.andWhere('product.rating >= :minRating', { minRating });
    }
    if (maxRating !== undefined) {
      queryBuilder.andWhere('product.rating <= :maxRating', { maxRating });
    }
    if (stock !== undefined) {
      if (stock) queryBuilder.andWhere('product.stock > 0');
      else queryBuilder.andWhere('product.stock = 0');
    }

    // Sorting
    if (sort && order) {
      queryBuilder.orderBy(`product.${sort}`, order as 'ASC' | 'DESC');
    }

    // Pagination
    queryBuilder.take(limit).skip(skip * limit);

    let [results, totalCount] = await queryBuilder.getManyAndCount();
    results.forEach((product) => {
      product.images = JSON.parse(product.images);
      product.colors = JSON.parse(product.colors);
    });
    if (colors && colors.length > 0) {
      results = results.filter((result) => {
        if (Array.isArray(result.colors)) {
          return result.colors.some((color) => colors.includes(color));
        }
      });
      totalCount = results.length;
    }
    return { data: { products: results, totalCount } };
  }

  async advancedSearch(searchParams: ProductSearchParams) {
    const { query } = searchParams;
    const queryBuilder = this.productRepository.createQueryBuilder('product');

    // Filtering
    if (query) {
      queryBuilder.where(
        '(product.name LIKE :query OR product.description LIKE :query)',
        { query: `%${query}%` },
      );
    }

    let [results, totalCount] = await queryBuilder.getManyAndCount();
    results.forEach((product) => {
      product.images = JSON.parse(product.images);
      product.colors = JSON.parse(product.colors);
    });
    return results;
  }

  async update(updateProductDtos: UpdateProductDto[]) {
    const productsToUpdate = [];
    for (const createProductDto of updateProductDtos) {
      const colors = JSON.stringify(createProductDto.colors);
      const images = JSON.stringify(createProductDto.images);

      const product = this.productRepository.create({
        ...createProductDto,
        colors,
        images,
      });

      productsToUpdate.push(product);
    }
    for (const product of productsToUpdate) {
      await this.productRepository.update(product.id, product);
    }
    return { message: 'Products updated successfully!' };
  }

  async remove(id: number) {
    return await this.productRepository.softDelete(id);
  }

  async rateProduct(id: number, rating: number, user: any) {
    if (rating < 0 || rating > 5) {
      throw new BadRequestException('Rating must be between 0 and 5');
    }
    const currentEntry = await this.cpRepository.findOne({
      where: { product: { id: id }, user: { id: user.id } },
    });
    if (currentEntry) {
      this.cpRepository.update(currentEntry.id, {
        rating: rating,
      });
    } else {
      this.cpRepository.save({
        product: { id: id },
        user: { id: user.id },
        rating: rating,
      });
    }
    // calculate new average rating
    const average = await this.cpRepository
      .createQueryBuilder('cp')
      .where('cp.productId = :id', { id: id })
      .select('ROUND(AVG(rating))', 'avg')
      .getRawOne();
    // update average rating
    await this.productRepository.update(id, { rating: average.avg });
    return { message: 'Rating submitted successfully' };
  }

  async addToWishList(id: number, user: any) {
    const currentEntry = await this.cpRepository.findOne({
      where: { user: { id: user.id }, product: { id: id } },
    });
    if (currentEntry) {
      await this.cpRepository.update(currentEntry.id, { wishlisted: true });
    } else {
      await this.cpRepository.save({
        product: { id: id },
        user: { id: user.id },
        wishlisted: true,
      });
    }
    return { message: 'Added to Wishlist Successfully!' };
  }

  async removeFromWishlist(id: number, user: any) {
    const currentEntry = await this.cpRepository.findOne({
      where: { user: { id: user.id }, product: { id: id } },
    });
    if (currentEntry) {
      await this.cpRepository.update(currentEntry.id, { wishlisted: false });
    }
    return { message: 'Removed from wishlist successfully!' };
  }

  async getWishlist(user: any) {
    const products = await this.cpRepository
      .createQueryBuilder('cp')
      .innerJoinAndSelect('cp.product', 'product')
      .where('cp.user.id = :userId', { userId: user.id })
      .andWhere('cp.wishlisted = 1')
      .getMany();

    const results = await products.map((product) => {
      console.log(product);
      return product.product;
    });
    results.forEach((result) => {
      result.images = JSON.parse(result.images);
      result.colors = JSON.parse(result.colors);
    });
    return { data: results };
  }

  async getBrands() {
    const products = await this.productRepository.find();
    const brands = new Set(products.map((product) => product.brand));
    return { data: [...brands] };
  }

  async getCategories() {
    const products = await this.productRepository.find();
    const categories = new Set(products.map((product) => product.category));
    return { data: [...categories] };
  }
}

