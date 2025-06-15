import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Header,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { CartProductUpdateDto } from './dto/update-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get('')
  findOne(@Headers('x-user-id') userId: string, ) {
    return this.cartService.test(+userId);
  }

  @Get('/getCart/:userId')
  getCart(@Param('userId') userId: string,) {
    return this.cartService.findOne(+userId)
  }

  @Patch('')
  update(
    @Headers('x-user-id') userId: number,
    @Body() updateCartDto: CartProductUpdateDto,
  ) {
    return this.cartService.update(+userId, updateCartDto);
  }

  @Delete('')
  remove(@Headers('x-user-id') userId: number) {
    console.log("Deleting cart for user", userId);
    return this.cartService.remove(userId);
  }
}
