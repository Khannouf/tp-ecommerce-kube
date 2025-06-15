import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { CartProductDto, CartProductUpdateDto } from './dto/update-cart.dto';
import axios from 'axios';
import { get } from 'http';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { CartProduct } from './entities/cart-product.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartProduct)
    private readonly cartProductRepository: Repository<CartProduct>,
  ) {}

  private async getProduct(productId: number) {
    const product = await axios.get(process.env.PRODUCT_SERVICE_URL + `/products/${productId}`).then(res => res.data).catch((e) => {
      console.log(e);
      throw new NotFoundException(`Product with ID ${productId} not found`);
    })
    return product;
  }

  private async getCart(userId: number) {
    const existingCart = await this.cartRepository.findOne({where: { userId }})
    if (existingCart) return existingCart;

    const newCart = this.cartRepository.create({ userId });
    return this.cartRepository.save(newCart);
  }

  async test(userId: number){
    return userId
  }

  async findOne(userId: number) {
    try {
      const cart = await this.cartRepository.findOne({ where: { userId: userId }, relations: ['products'] });
    if (!cart) throw new NotFoundException(`Cart for user with ID ${userId} not found`);

    return {
      id: cart.id,
      products: await Promise.all(cart.products.map(async (cartProduct) => {
        const product = await this.getProduct(cartProduct.productId);
        return {
          product,
          quantity: cartProduct.quantity,
        };
      })),
    }
    } catch (e) {
      console.log(e);
      
    }
    
  }

  async update(userId: number, CartProductUpdateDto: CartProductUpdateDto) {
    const cart = await this.getCart(userId)
    const product = await this.getProduct(CartProductUpdateDto.productId)
    if (!product.isAvailable) throw new BadRequestException(`Product with ID ${CartProductUpdateDto.productId} is not available`);

    if (CartProductUpdateDto.quantity <= 0){
      await this.cartProductRepository.delete({cart: {id: cart.id}, productId: CartProductUpdateDto.productId})
    } else {
      const actualCartProduct = await this.cartProductRepository.findOne({
        where: { cart: {id: cart.id}, productId: CartProductUpdateDto.productId}
      })
      if (actualCartProduct){
        actualCartProduct.quantity = CartProductUpdateDto.quantity
        await this.cartProductRepository.save(actualCartProduct);
      } else {
        const newCartProduct = await this.cartProductRepository.create({
          cart,
          productId: CartProductUpdateDto.productId,
          quantity: CartProductUpdateDto.quantity
        })
        await this.cartProductRepository.save(newCartProduct);
      }
    }
    return this.findOne(userId);
  }

  async remove(userId: number) {
    const cart = await this.cartRepository.delete({ userId})
    return cart
  }
}
