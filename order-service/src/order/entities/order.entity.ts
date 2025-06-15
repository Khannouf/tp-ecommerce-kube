import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { OrderProduct } from "./order-product.entity";

@Entity({ name: "orders" })
export class Order {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  userId: number;

  @Column()
  status: string;

  @Column()
  totalPrice: number;

  @OneToMany(() => OrderProduct, orderProduct => orderProduct.order)
  products: OrderProduct[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}

