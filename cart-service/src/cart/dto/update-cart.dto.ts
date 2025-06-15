
export class ProductDto {
  id: number;

  name: string;

  description: string;

  price: string; // si tu veux un nombre, considère IsNumber() et transformer en number

  isAvailable: boolean;

  imageUrl: string;

  stock: number;
  createdAt: string;
  updatedAt: string;
}

export class CartProductDto {

  product: ProductDto;

  quantity: number;
}

export class CartDto {
  id: number;

  products: CartProductDto[];
}

export class CartProductUpdateDto {

  productId: number;

  quantity: number;
}
