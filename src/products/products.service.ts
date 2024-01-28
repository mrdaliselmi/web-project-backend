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

  async create(createProductDto: CreateProductDto) {
    return await this.productRepository.save(createProductDto);
  }

  async findAll(params: PaginationParams) {
    const { limit, skip } = params;
    return await this.productRepository.findAndCount({
      take: limit,
      skip: skip * limit,
    });
  }

  async findOne(id: number) {
    return await this.productRepository.find({ where: { id: id } });
  }

  async search(searchParams: ProductSearchParams) {
    const {
      query,
      brand,
      category,
      minPrice,
      maxPrice,
      minRating,
      maxRating,
      color,
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
    if (brand && brand.length > 0) {
      queryBuilder.andWhere('product.brand IN (:...brand)', { brand });
    }
    if (category && category.length > 0) {
      queryBuilder.andWhere('product.category IN (:...category)', { category });
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
    if (color) {
      queryBuilder.andWhere('product.color = :color', { color });
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

    return await queryBuilder.getManyAndCount();
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    return await this.productRepository.update(id, updateProductDto);
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
    return await this.productRepository.update(id, { rating: average.avg });
  }

  async addToWishList(id: number, user: any, res) {
    const currentEntry = await this.cpRepository.findOne({
      where: { user: { id: user.id }, product: { id: id } },
    });
    if (currentEntry) {
      await this.cpRepository.update(currentEntry.id, { wishlisted: true });
    } else {
      await this.cpRepository.save({
        product: { id: id },
        user: { id: user.id },
        wishList: true,
      });
    }
    return res.status(200).json({ message: 'Success!' });
  }
}
