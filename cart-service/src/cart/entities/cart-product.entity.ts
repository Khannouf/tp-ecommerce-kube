import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from "./cart.entity";

@Entity({ name: 'cart_product' })
export class CartProduct {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  quantity: number

  @Column()
  productId: number

  @ManyToOne(() => Cart, (cart) => cart.products)
  cart: Cart
}
