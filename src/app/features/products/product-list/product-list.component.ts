import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { ToastService } from '../../../core/services/toast.service';
import { Product, ProductFilter } from '../../../core/models/product.model';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Filters Sidebar -->
        <aside class="lg:w-1/4">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold mb-4">Filters</h3>
            
            <!-- Search -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input type="text" 
                     placeholder="Search products..." 
                     class="form-input"
                     (input)="onSearchChange($event)">
            </div>

            <!-- Categories -->
            <div class="mb-6">
              <h4 class="font-medium text-gray-800 mb-3">Categories</h4>
              @for (category of categories(); track category.id ?? $index) {
                <label class="flex items-center mb-2">
                  <input
                    type="checkbox"
                    class="mr-2"
                    [checked]="isCategorySelected(category.id)"
                    (change)="onCategoryToggle(category.id, $event)"
                  >
                  <span class="text-sm">{{ category.name }}</span>
                </label>
              }
            </div>

            

            
          </div>
        </aside>

        <!-- Products Grid -->
        <main class="lg:w-3/4">
          <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-gray-800">Products</h1>
            <select class="form-input w-auto" (change)="onSortChange($event)">
              <option value="featured">Sort by: Featured</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="newest">Newest</option>
              <option value="rating">Rating</option>
            </select>
          </div>

          @if (isLoading()) {
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              @for (s of [1,2,3,4,5,6]; track $index) {
                <div class="card p-4 skeleton-shimmer">
                  <div class="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div class="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div class="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div class="h-3 bg-gray-200 rounded w-5/6 mb-4"></div>
                  <div class="flex justify-between items-center">
                    <div class="h-6 bg-gray-200 rounded w-24"></div>
                    <div class="h-6 bg-gray-200 rounded w-10"></div>
                  </div>
                </div>
              }
            </div>
          } @else if (products().length === 0) {
            <div class="text-center py-16">
              <h2 class="text-xl font-semibold text-gray-800 mb-2">No products found</h2>
              <p class="text-gray-600">Try adjusting your search or filters.</p>
            </div>
          } @else {
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              @for (product of products(); track product.id ?? $index) {
                <div class="card p-4 group hoverable transition-soft">
                  <div class="relative mb-4 overflow-hidden rounded-lg shine-on-hover">
                    <img [src]="getProductImage(product)" 
                         [alt]="product.name"
                         crossorigin="anonymous"
                         class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                         (error)="onImageError($event)"
                         (load)="onImageLoad($event)">
                    @if (product.salePrice) {
                      <div class="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                        Sale
                      </div>
                    }
                  </div>
                  
                  <h3 class="font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {{ product.name }}
                  </h3>
                  
                  <p class="text-gray-600 text-sm mb-3 line-clamp-2">
                    {{ product.shortDescription }}
                  </p>
                  
                  <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center space-x-2">
                      @if (product.salePrice) {
                        <span class="text-lg font-bold text-red-600">₹{{ product.salePrice | number:'1.2-2' }}</span>
                        <span class="text-sm text-gray-500 line-through">₹{{ product.price | number:'1.2-2' }}</span>
                      } @else {
                        <span class="text-lg font-bold text-gray-800">₹{{ product.price | number:'1.2-2' }}</span>
                      }
                    </div>
                    
                    <div class="flex items-center space-x-1">
                      <svg class="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                      <span class="text-sm text-gray-600">{{ product.ratings.average || 0 }}</span>
                    </div>
                  </div>
                  
                  <div class="flex space-x-2">
                    <a [routerLink]="['/products', product.id]" class="flex-1 btn-primary text-center text-sm py-2">
                      View Details
                    </a>
                    <button class="btn-secondary px-3 py-2" (click)="addToCart(product)">
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9m-9 0h9"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              }
            </div>
          }

          <!-- Pagination -->
          <div class="flex justify-center mt-8">
            <nav class="flex space-x-2">
              <button class="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">Previous</button>
              <button class="px-3 py-2 bg-blue-600 text-white rounded-md">1</button>
              <button class="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">2</button>
              <button class="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">3</button>
              <button class="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">Next</button>
            </nav>
          </div>
        </main>
      </div>
    </div>
  `
})
export class ProductListComponent implements OnInit {
  products = signal<Product[]>([]);
  allProducts = signal<Product[]>([]);
  categories = signal<any[]>([]);
  isLoading = signal<boolean>(true);
  private currentSort: 'featured' | 'priceAsc' | 'priceDesc' | 'newest' | 'rating' = 'featured';
  private selectedCategoryIds = signal<string[]>([]);

  constructor(private productService: ProductService, private cartService: CartService, private toast: ToastService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.loadFilters();
    // React to query param 'q' for search
    this.route.queryParamMap
      .pipe(
        map(params => {
          const q = (params.get('q') || '').trim();
          const categoryParam = (params.get('category') || '').trim();
          this.setSelectedCategoryFromParam(categoryParam);
          return q;
        }),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(q => {
          this.isLoading.set(true);
          if (q && q.length > 0) {
            return this.productService.searchProducts(q);
          }
          return this.productService.getProducts().pipe(map(res => res.products));
        })
      )
      .subscribe(products => {
        this.allProducts.set(products);
        this.products.set(this.applySort(this.applyCategoryFilter(products)));
        this.isLoading.set(false);
      });
    // Initial load without query
    this.loadProducts();
  }

  private loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (result) => {
        this.allProducts.set(result.products);
        this.products.set(this.applySort(this.applyCategoryFilter(result.products)));
        this.isLoading.set(false);
      }
    });
  }

  private loadFilters(): void {
    this.productService.getCategories().subscribe({
      next: (categories) => this.categories.set(categories)
    });

    // Removed Brands filter
  }

  onSearchChange(event: any): void {
    const q = (event?.target?.value || '').trim();
    this.router.navigate([], { relativeTo: this.route, queryParams: { q }, queryParamsHandling: 'merge' });
  }

  getProductImage(product: Product): string {
    // Handle different image formats from backend
    if (product.images && product.images.length > 0) {
      const firstImage = product.images[0];
      
      if (typeof firstImage === 'string') {
        return firstImage;
      } else if (firstImage.url) {
        return firstImage.url;
      }
    }
    
    // Fallback to placeholder
    return 'https://via.placeholder.com/300x200?text=No+Image';
  }

  onImageError(event: any): void {
    console.log('Image failed to load:', event.target.src);
    event.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
  }

  onImageLoad(event: any): void {
    console.log('Image loaded successfully:', event.target.src);
  }

  onSortChange(event: Event): void {
    const value = (event.target as HTMLSelectElement)?.value;
    this.currentSort = (value as any) || 'featured';
    const sorted = this.applySort(this.products());
    this.products.set(sorted);
  }

  isCategorySelected(categoryId: string): boolean {
    return this.selectedCategoryIds().includes(categoryId);
  }

  onCategoryToggle(categoryId: string, event: Event): void {
    const checked = (event.target as HTMLInputElement)?.checked;
    const current = new Set(this.selectedCategoryIds());
    if (checked) {
      current.add(categoryId);
    } else {
      current.delete(categoryId);
    }
    this.selectedCategoryIds.set(Array.from(current));

    const filtered = this.applyCategoryFilter(this.allProducts());
    this.products.set(this.applySort(filtered));
  }

  private applySort(items: Product[]): Product[] {
    const productsCopy = [...(items || [])];
    switch (this.currentSort) {
      case 'priceAsc':
        return productsCopy.sort((a, b) => this.getEffectivePrice(a) - this.getEffectivePrice(b));
      case 'priceDesc':
        return productsCopy.sort((a, b) => this.getEffectivePrice(b) - this.getEffectivePrice(a));
      case 'newest':
        return productsCopy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'rating':
        return productsCopy.sort((a, b) => (b.ratings?.average || 0) - (a.ratings?.average || 0));
      case 'featured':
      default:
        return productsCopy; // no special sort
    }
  }

  private getEffectivePrice(product: Product): number {
    const price = typeof product.salePrice === 'number' && product.salePrice > 0 ? product.salePrice : product.price;
    return Number(price) || 0;
  }

  private applyCategoryFilter(items: Product[]): Product[] {
    const selected = this.selectedCategoryIds();
    if (!selected || selected.length === 0) {
      return items || [];
    }
    const set = new Set(selected);
    return (items || []).filter(p => p?.category?.id && set.has(p.category.id));
  }

  private setSelectedCategoryFromParam(categoryParam: string): void {
    if (!categoryParam) {
      return;
    }
    const allCategories = this.productService.categories();
    const match = allCategories.find(c => c.slug === categoryParam || c.id === categoryParam || c.name === categoryParam);
    if (match) {
      this.selectedCategoryIds.set([match.id]);
    }
  }

  addToCart(product: Product): void {
    this.cartService.addProduct(product, 1);
    this.toast.success('Added to cart');
  }
}