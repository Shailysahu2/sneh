import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-10">
      @if (isLoading()) {
        <div class="flex justify-center py-12">
          <div class="spinner"></div>
        </div>
      } @else if (product()) {
        <div class="mb-8 text-center">
          <div class="text-xs font-extrabold tracking-widest uppercase" style="color: rgba(17,24,39,.60);">
            Product
          </div>
          <h1 class="text-3xl md:text-4xl font-extrabold mt-2" style="letter-spacing: -0.03em; color: rgba(17,24,39,.92);">
            {{ product()!.name }}
          </h1>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Product Images -->
          <div class="space-y-4">
            <div class="aspect-square rounded-2xl overflow-hidden card" style="padding: 0;">
              <img [src]="getProductImage(product()!)"
                   [alt]="product()!.name"
                   crossorigin="anonymous"
                   class="w-full h-full object-cover"
                   (error)="onImageError($event)"
                   (load)="onImageLoad($event)">
            </div>
            @if (product()!.images && product()!.images.length > 1) {
              <div class="grid grid-cols-4 gap-2">
                @for (image of product()!.images; track image.id) {
                  <div class="aspect-square rounded-xl overflow-hidden cursor-pointer transition-soft card" style="padding: 0;">
                    <img [src]="getFullImageUrl(image.url)" 
                         [alt]="image.alt"
                         crossorigin="anonymous"
                         class="w-full h-full object-cover"
                         (error)="onImageError($event)"
                         (load)="onImageLoad($event)">
                  </div>
                }
              </div>
            }
          </div>

          <!-- Product Info -->
          <div class="space-y-6">
            <div class="card p-6">
              <!-- Rating -->
              <div class="flex items-center justify-between gap-4">
                <div class="flex items-center space-x-2">
                  <div class="flex items-center">
                    @for (star of [1,2,3,4,5]; track star) {
                      <svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    }
                  </div>
                  <span style="color: rgba(17,24,39,.62);">({{ product()!.ratings.count }} reviews)</span>
                </div>

                <!-- Stock Status -->
                <div class="flex items-center space-x-2">
                  @if (product()!.inventory.status === 'in_stock') {
                    <span class="pill pill--active" style="height: 30px; padding: 0 12px;">In Stock</span>
                  } @else {
                    <span class="pill" style="height: 30px; padding: 0 12px;">Out of Stock</span>
                  }
                </div>
              </div>

              <!-- Price -->
              <div class="mt-5 flex flex-wrap items-end gap-x-4 gap-y-2">
                @if (product()!.salePrice) {
                  <span class="text-3xl font-extrabold" style="color:#dc2626;">₹{{ product()!.salePrice | number:'1.2-2' }}</span>
                  <span class="text-lg line-through" style="color: rgba(17,24,39,.45);">₹{{ product()!.price | number:'1.2-2' }}</span>
                  <span class="pill" style="height: 30px; padding: 0 12px;">
                    Save ₹{{ (product()!.price - product()!.salePrice!) | number:'1.2-2' }}
                  </span>
                } @else {
                  <span class="text-3xl font-extrabold" style="color: rgba(17,24,39,.92);">₹{{ product()!.price | number:'1.2-2' }}</span>
                }
              </div>

              <!-- Technical specifications -->
              @if (product()!.hp || product()!.operatingVoltage || product()!.maxSuction || product()!.pipeSize || product()!.windingMaterial || product()!.head || product()!.flowLtrHr) {
                <div class="mt-6 p-5 bg-gray-50 rounded-xl">
                  <h3 class="text-lg font-semibold mb-3" style="color: rgba(17,24,39,.92);">Technical Specifications</h3>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    @if (product()!.hp) {
                      <div class="flex justify-between">
                        <span class="text-sm font-medium" style="color: rgba(17,24,39,.72);">Power</span>
                        <span class="text-sm" style="color: rgba(17,24,39,.62);">{{ product()!.hp }} HP</span>
                      </div>
                    }
                    @if (product()!.operatingVoltage) {
                      <div class="flex justify-between">
                        <span class="text-sm font-medium" style="color: rgba(17,24,39,.72);">Operating Voltage</span>
                        <span class="text-sm" style="color: rgba(17,24,39,.62);">{{ product()!.operatingVoltage }}</span>
                      </div>
                    }
                    @if (product()!.maxSuction) {
                      <div class="flex justify-between">
                        <span class="text-sm font-medium" style="color: rgba(17,24,39,.72);">Max Suction</span>
                        <span class="text-sm" style="color: rgba(17,24,39,.62);">{{ product()!.maxSuction }}</span>
                      </div>
                    }
                    @if (product()!.pipeSize) {
                      <div class="flex justify-between">
                        <span class="text-sm font-medium" style="color: rgba(17,24,39,.72);">Pipe Size</span>
                        <span class="text-sm" style="color: rgba(17,24,39,.62);">{{ product()!.pipeSize }}</span>
                      </div>
                    }
                    @if (product()!.windingMaterial) {
                      <div class="flex justify-between">
                        <span class="text-sm font-medium" style="color: rgba(17,24,39,.72);">Winding Material</span>
                        <span class="text-sm" style="color: rgba(17,24,39,.62);">{{ product()!.windingMaterial }}</span>
                      </div>
                    }
                    @if (product()!.head) {
                      <div class="flex justify-between">
                        <span class="text-sm font-medium" style="color: rgba(17,24,39,.72);">Head</span>
                        <span class="text-sm" style="color: rgba(17,24,39,.62);">{{ product()!.head }}</span>
                      </div>
                    }
                    @if (product()!.flowLtrHr) {
                      <div class="flex justify-between">
                        <span class="text-sm font-medium" style="color: rgba(17,24,39,.72);">Flow Ltr /hr</span>
                        <span class="text-sm" style="color: rgba(17,24,39,.62);">{{ product()!.flowLtrHr }}</span>
                      </div>
                    }
                  </div>
                </div>
              }

            <!-- Attributes -->
            @if (product()!.attributes.length > 0) {
              <div class="mt-6 space-y-3">
                @for (attr of product()!.attributes; track attr.name) {
                  <div class="flex items-center justify-between">
                    <span class="font-extrabold" style="color: rgba(17,24,39,.72);">{{ attr.name }}</span>
                    <span style="color: rgba(17,24,39,.62);">{{ attr.value }}</span>
                  </div>
                }
              </div>
            }

            <!-- Actions -->
            <div class="mt-6 space-y-4">
              <div class="flex items-center gap-4">
                <label class="font-extrabold" style="color: rgba(17,24,39,.72);">Quantity</label>
                <select class="form-input w-24">
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                </select>
              </div>

              <div class="flex space-x-4">
                <button class="flex-1 btn-primary py-3" style="border-radius: 14px;">Add to Cart</button>
                <button class="btn-secondary px-6 py-3" style="border-radius: 14px;" aria-label="Add to wishlist">
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                </button>
              </div>
            </div>
            </div>
          </div>
        </div>

        <!-- Product Description -->
        <div class="mt-12">
          <div class="card p-6">
            <div class="flex flex-wrap gap-3">
              <span class="pill pill--active" style="height: 34px;">Description</span>
              <span class="pill" style="height: 34px;">Reviews</span>
              <span class="pill" style="height: 34px;">Shipping</span>
            </div>
            <div class="mt-5">
              <p style="color: rgba(17,24,39,.72); line-height: 1.75;">{{ product()!.description }}</p>
            </div>
          </div>
        </div>

        <!-- Related Products -->
        @if (relatedProducts().length > 0) {
          <div class="mt-12">
            <h2 class="text-2xl font-extrabold mb-6" style="letter-spacing:-0.02em; color: rgba(17,24,39,.92);">Related Products</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              @for (relatedProduct of relatedProducts(); track relatedProduct.id) {
                <a [routerLink]="['/products', relatedProduct.id]" class="block card p-4 transition-soft hoverable">
                  @if (relatedProduct.images && relatedProduct.images.length > 0) {
                    <img [src]="getFullImageUrl(relatedProduct.images[0].url)" 
                         [alt]="relatedProduct.name"
                         crossorigin="anonymous"
                         class="w-full h-32 object-contain rounded-lg mb-3"
                         (error)="onImageError($event)"
                         (load)="onImageLoad($event)">
                  } @else {
                    <div class="w-full h-32 bg-gray-200 rounded-lg mb-3 flex items-center justify-center text-gray-500 text-sm">
                      No Image
                    </div>
                  }
                  <h3 class="font-extrabold mb-1" style="color: rgba(17,24,39,.92);">{{ relatedProduct.name }}</h3>
                  <p style="color: rgba(17,24,39,.62);">₹{{ (relatedProduct.salePrice || relatedProduct.price) | number:'1.2-2' }}</p>
                </a>
              }
            </div>
          </div>
        }
      } @else {
        <div class="text-center py-12">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p class="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <a routerLink="/products" class="btn-primary">Browse Products</a>
        </div>
      }
    </div>
  `
})
export class ProductDetailComponent implements OnInit {
  product = signal<Product | null>(null);
  relatedProducts = signal<Product[]>([]);
  isLoading = signal<boolean>(true);

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = params['id'];
      this.loadProduct(productId);
    });
  }

  private loadProduct(id: string): void {
    this.isLoading.set(true);
    
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        
        // Test image URLs if product has images
        this.product.set(product);
        this.isLoading.set(false);
        
        if (product) {
          this.loadRelatedProducts(id);
        }
      },
      error: (error) => {
        // Optionally route to not-found or show toast via interceptor
        this.isLoading.set(false);
      }
    });
  }

  private loadRelatedProducts(productId: string): void {
    this.productService.getRelatedProducts(productId).subscribe({
      next: (products) => {
        this.relatedProducts.set(products);
      }
    });
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Crect fill="%23f0f0f0" width="300" height="200"/%3E%3Ctext x="50%" y="50%" font-family="Arial" font-size="16" fill="%23999" text-anchor="middle" dominant-baseline="middle"%3EImage Failed to Load%3C/text%3E%3C/svg%3E';
  }

  onImageLoad(event: Event): void {}

  // Test method to verify image URLs
  // Removed debug image URL tester

  // Helper method to get full image URL (same as product service)
  public getFullImageUrl(imagePath: string): string {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    // Ensure we have the correct format: https://sneh-backend.onrender.com/uploads/filename
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    const baseUrl = environment.apiUrl.replace('/api', ''); // Remove /api to get base URL
    return `${baseUrl}${cleanPath}`;
  }

  // Updated getProductImage method with proper URL handling
  getProductImage(product: Product): string {
    if (product.images && product.images.length > 0) {
      const firstImage = product.images[0];
      if (typeof firstImage === 'string') {
        const url = this.getFullImageUrl(firstImage);
        return url;
      } else if (firstImage.url) {
        const url = this.getFullImageUrl(firstImage.url);
        return url;
      }
    }
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Crect fill="%23f0f0f0" width="300" height="200"/%3E%3Ctext x="50%" y="50%" font-family="Arial" font-size="16" fill="%23999" text-anchor="middle" dominant-baseline="middle"%3ENo Image Available%3C/text%3E%3C/svg%3E';
  }
}