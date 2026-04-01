import { Injectable, signal } from '@angular/core';
import { Product } from '../models/product.model';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  description?: string;
}

const PLACEHOLDER_IMAGE_SM = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjZWVlIi8+PC9zdmc+';

@Injectable({ providedIn: 'root' })
export class CartService {
  items = signal<CartItem[]>([]);

  addProduct(product: Product, quantity: number = 1): void {
    const existing = this.items().find(i => i.id === product.id);
    if (existing) {
      this.items.update(list => list.map(i => i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i));
      return;
    }
    const image = Array.isArray(product.images) && product.images.length > 0
      ? (typeof product.images[0] === 'string' ? product.images[0] as unknown as string : (product.images[0] as any).url)
      : PLACEHOLDER_IMAGE_SM;
    const price = (typeof product.salePrice === 'number' && product.salePrice > 0) ? product.salePrice : product.price;
    const item: CartItem = {
      id: product.id,
      name: product.name,
      price: Number(price) || 0,
      quantity,
      image
    };
    this.items.set([...this.items(), item]);
  }

  updateQuantity(id: string, quantity: number): void {
    if (quantity < 1) return;
    this.items.update(list => list.map(i => i.id === id ? { ...i, quantity } : i));
  }

  remove(id: string): void {
    this.items.update(list => list.filter(i => i.id !== id));
  }

  clear(): void {
    this.items.set([]);
  }
}


