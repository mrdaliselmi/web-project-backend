import { Injectable, NotAcceptableException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UserService } from 'src/user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { Repository } from 'typeorm';
import { ProductsService } from 'src/products/products.service';
import { Order } from './entities/order.entity';
import { OrderProduct } from 'src/order-product/entities/order-product.entity';

@Injectable()
export class OrdersService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly productsService: ProductsService,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderProduct)
    private readonly orderProductRepository: Repository<OrderProduct>,
  ) {}
  async create(createOrderDto: CreateOrderDto, user) {
    const currentuser = await this.userService.findOne(user.id);
    const order = this.orderRepository.create({
      firstname: createOrderDto.firstname,
      lastname: createOrderDto.lastname,
      streetAddress: createOrderDto.streetAddress,
      apt: createOrderDto.apt,
      city: createOrderDto.city,
      state: createOrderDto.state,
      zip: createOrderDto.zip,
      phone: createOrderDto.phone,
      user: currentuser,
    });
    const orderItems = await createOrderDto.Products.map((product) => ({
      product: this.productRepository.findOne({
        where: { id: product.id },
      }),
      quantity: product.quantity,
      order: order,
    }));
    if (await this.checkStockAndUpdate(orderItems)) {
      let total = 0;
      for (const product of orderItems) {
        const orderProduct = new OrderProduct();
        orderProduct.product = await product.product;
        orderProduct.quantity = product.quantity;
        orderProduct.order = await order;
        await this.orderProductRepository.save(orderProduct);
        total += orderProduct.quantity * orderProduct.product.price;
      }
      await this.orderRepository.save({ ...order, total: total });
      return { message: 'Order created successfully!' };
    } else {
      throw new NotAcceptableException('Not enough in Stock!');
    }
  }
  async checkStockAndUpdate(
    orderItems: { product: Promise<Product>; quantity: number }[],
  ) {
    for (const item of orderItems) {
      const product = await item.product;
      if (item.quantity > product.stock) {
        return false;
      }
    }
    for (const item of orderItems) {
      const product = await item.product;
      product.stock -= item.quantity;
      await this.productRepository.update(product.id, product);
    }
    return true;
  }

  async findAll(pagination, user) {
    const { skip, limit } = pagination;
    const [orders, totalCount] = await this.orderRepository.findAndCount({
      where: { user: { id: user.id } },
      take: limit,
      skip: skip * limit,
    });
    return { data: { orders, totalCount } };
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }
}
