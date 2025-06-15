import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderProduct } from './entities/order-product.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderProduct)
    private readonly orderProductRepository: Repository<OrderProduct>,
  ) {}

  private async getProduct(productId: number) {
    try {
      const product = await axios
        .get(process.env.PRODUCT_SERVICE_URL + `/products/${productId}`)
        .then((res) => res.data)
        .catch((e) => {
          console.log(e);
          throw new NotFoundException(`Product with ID ${productId} not found`);
        });
      return product;
      
    } catch (error) {
      console.log(`getProduct error : ${error}`);
      
    }
  }
  private async getCart(userId: number) {
    try {
      const cart = await axios
        .get(process.env.CART_SERVICE_URL + `/cart/getCart/${userId}`)
        .then((res) => res.data)
        .catch((e) => {
          console.log(e);
          throw new NotFoundException(`Cart with userId ${userId} not found`);
        });
      return cart;
      
    } catch (error) {
      console.log(`getCart error : ${error}`);
      
    }
  }

  private async deleteCart(userId: number) {
    try {
      
      const cart = await axios
        .delete(process.env.CART_SERVICE_URL + `/cart/`, {
          headers: { 'x-user-id': userId },
        })
        .then((res) => res.data)
        .catch((e) => {
          console.log(e);
          throw new NotFoundException(`Cart with userId ${userId} not found`);
        });
      return cart;
    } catch (error) {
      console.log(`deleteCart error : ${error}`);
    }
  }

  async findAll() {
    return this.orderRepository.find({ relations: ['products'] });
  }

  async findOne(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['products'],
    });
    if (order) {
      return order;
    } else {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
  }

  async create(userId: number) {
    try {
      
      const cart = await this.getCart(userId);
  
      let finalPrice = 0;
  
      for (const cp of cart.products) {
        const product = await this.getProduct(cp.product.id);
  
        if (cp.quantity > product.quantity) {
          throw new BadRequestException(
            `the quantity is too high for product ${product.id} stock `,
          );
        }
        finalPrice += product.price * cp.quantity;
      }
  
      const order = await this.orderRepository.save({
        userId,
        status: 'WAIT',
        totalPrice : finalPrice,
      });
  
      const products: OrderProduct[] = [];
  
      for (const cP of cart.products) {
        const toSave = this.orderProductRepository.create({
          productId: cP.product.id,
          quantity: cP.quantity,
          order: { id: order.id } as Order,
        });
  
        const saved = await this.orderProductRepository.save(toSave);
        products.push(saved);
      }
  
      const deletedCart = await this.deleteCart(userId)
  
      return{
        ...order,
        products,
      }
    } catch (error) {
      console.log(error);
      
      
    }
  }
}
