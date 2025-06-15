import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { CartProduct } from "./cart-product.entity";

@Entity({ name: "cart" })
export class Cart {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  userId: number

  @OneToMany(() => CartProduct, cartProduct => cartProduct.cart)
  products: CartProduct[]

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
