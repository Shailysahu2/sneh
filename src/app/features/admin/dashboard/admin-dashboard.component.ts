import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="bg-white shadow-sm border-b">
        <div class="container mx-auto px-4 py-4">
          <div class="flex justify-between items-center">
            <h1 class="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-600">Welcome, Admin</span>
              <button class="btn-secondary text-sm">Logout</button>
            </div>
          </div>
        </div>
      </header>

      <div class="container mx-auto px-4 py-8">
        <!-- Navigation Tabs -->
        <nav class="flex space-x-8 border-b border-gray-200 mb-8">
          <button 
            (click)="activeTab.set('overview')"
            [class]="activeTab() === 'overview' ? 'border-b-2 border-blue-500 text-blue-600 py-2 px-1 text-sm font-medium' : 'text-gray-500 hover:text-gray-700 py-2 px-1 text-sm font-medium'">
            Overview
          </button>
          <button 
            (click)="activeTab.set('products')"
            [class]="activeTab() === 'products' ? 'border-b-2 border-blue-500 text-blue-600 py-2 px-1 text-sm font-medium' : 'text-gray-500 hover:text-gray-700 py-2 px-1 text-sm font-medium'">
            Products
          </button>
          <button 
            (click)="activeTab.set('orders')"
            [class]="activeTab() === 'orders' ? 'border-b-2 border-blue-500 text-blue-600 py-2 px-1 text-sm font-medium' : 'text-gray-500 hover:text-gray-700 py-2 px-1 text-sm font-medium'">
            Orders
          </button>
          <button 
            (click)="activeTab.set('users')"
            [class]="activeTab() === 'users' ? 'border-b-2 border-blue-500 text-blue-600 py-2 px-1 text-sm font-medium' : 'text-gray-500 hover:text-gray-700 py-2 px-1 text-sm font-medium'">
            Users
          </button>
        </nav>

        <!-- Overview Tab -->
        @if (activeTab() === 'overview') {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center">
                <div class="p-3 rounded-full bg-blue-100 text-blue-600">
                  <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600">Total Products</p>
                  <p class="text-2xl font-semibold text-gray-900">{{ totalProducts() }}</p>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center">
                <div class="p-3 rounded-full bg-green-100 text-green-600">
                  <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600">Active Products</p>
                  <p class="text-2xl font-semibold text-gray-900">{{ activeProducts() }}</p>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center">
                <div class="p-3 rounded-full bg-yellow-100 text-yellow-600">
                  <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600">Featured Products</p>
                  <p class="text-2xl font-semibold text-gray-900">{{ featuredProducts() }}</p>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center">
                <div class="p-3 rounded-full bg-red-100 text-red-600">
                  <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600">Low Stock</p>
                  <p class="text-2xl font-semibold text-gray-900">{{ lowStockProducts() }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <p class="text-gray-600">No recent activity to display.</p>
          </div>
        }

        <!-- Products Tab -->
        @if (activeTab() === 'products') {
          <div class="bg-white rounded-lg shadow">
            <div class="px-6 py-4 border-b border-gray-200">
              <div class="flex justify-between items-center">
                <h3 class="text-lg font-semibold text-gray-900">Product Management</h3>
                <button 
                  (click)="showAddProductForm.set(true)"
                  class="btn-primary">
                  <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Add New Product
                </button>
              </div>
            </div>

            <!-- Search Bar -->
            <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div class="flex items-center space-x-4">
                <div class="flex-1">
                  <input 
                    type="text" 
                    [(ngModel)]="searchQuery"
                    (input)="onSearchChange()"
                    placeholder="Search products by name, SKU, or category..."
                    class="form-input w-full">
                </div>
                <div class="flex items-center space-x-2">
                  <select 
                    [(ngModel)]="categoryFilter"
                    (change)="onSearchChange()"
                    class="form-input w-48">
                    <option value="">All Categories</option>
                    @for (category of categories(); track category.id) {
                      <option [value]="category.name">{{ category.name }}</option>
                    }
                  </select>
                  <select 
                    [(ngModel)]="statusFilter"
                    (change)="onSearchChange()"
                    class="form-input w-32">
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Add Product Form -->
            @if (showAddProductForm()) {
              <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h4 class="text-md font-medium text-gray-900 mb-4">Add New Product</h4>
                <form (ngSubmit)="onSubmitProduct()" #productForm="ngForm" class="space-y-4" enctype="multipart/form-data">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                      <input 
                        type="text" 
                        [(ngModel)]="newProduct.name" 
                        name="name"
                        required
                        class="form-input w-full">
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select 
                        [(ngModel)]="newProduct.categoryId" 
                        name="category"
                        required
                        class="form-input w-full">
                        <option value="">Select Category</option>
                        @for (category of categories(); track category.id) {
                          <option [value]="category.id">{{ category.name }}</option>
                        }
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                      <select 
                        [(ngModel)]="newProduct.brandId" 
                        name="brand"
                        required
                        class="form-input w-full">
                        <option value="">Select Brand</option>
                        @for (brand of brands(); track brand.id) {
                          <option [value]="brand.id">{{ brand.name }}</option>
                        }
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Price (Rs)</label>
                      <input 
                        type="number" 
                        [(ngModel)]="newProduct.price" 
                        name="price"
                        required
                        min="0"
                        step="0.01"
                        class="form-input w-full">
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                      <input 
                        type="number" 
                        [(ngModel)]="newProduct.stock" 
                        name="stock"
                        required
                        min="0"
                        class="form-input w-full">
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                      <input 
                        type="text" 
                        [(ngModel)]="newProduct.sku" 
                        name="sku"
                        required
                        class="form-input w-full">
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                    <input 
                      type="text" 
                      [(ngModel)]="newProduct.shortDescription" 
                      name="shortDescription"
                      required
                      class="form-input w-full">
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
                    <textarea 
                      [(ngModel)]="newProduct.description" 
                      name="description"
                      required
                      rows="4"
                      class="form-input w-full"></textarea>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Product Images</label>
                    <input 
                      type="file" 
                      (change)="onFileChange($event)"
                      multiple
                      accept="image/*"
                      class="form-input w-full">
                  </div>
                  
                  <div class="flex space-x-3">
                    <button 
                      type="submit" 
                      [disabled]="!productForm.form.valid || isSubmitting()"
                      class="btn-primary">
                      @if (isSubmitting()) {
                        <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      }
                      {{ isSubmitting() ? 'Creating...' : 'Create Product' }}
                    </button>
                    <button 
                      type="button" 
                      (click)="cancelAddProduct()"
                      class="btn-secondary">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            }

            <!-- Edit Product Form -->
            @if (showEditProductForm()) {
              <div class="px-6 py-4 border-b border-gray-200 bg-blue-50">
                <h4 class="text-md font-medium text-gray-900 mb-4">Edit Product</h4>
                <form (ngSubmit)="onSubmitEditProduct()" #editProductForm="ngForm" class="space-y-4" enctype="multipart/form-data">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                      <input 
                        type="text" 
                        [(ngModel)]="editingProduct.name" 
                        name="editName"
                        required
                        class="form-input w-full">
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select 
                        [(ngModel)]="editingProduct.categoryId" 
                        name="editCategory"
                        required
                        class="form-input w-full">
                        <option value="">Select Category</option>
                        @for (category of categories(); track category.id) {
                          <option [value]="category.id">{{ category.name }}</option>
                        }
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                      <select 
                        [(ngModel)]="editingProduct.brandId" 
                        name="editBrand"
                        required
                        class="form-input w-full">
                        <option value="">Select Brand</option>
                        @for (brand of brands(); track brand.id) {
                          <option [value]="brand.id">{{ brand.name }}</option>
                        }
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                      <input 
                        type="number" 
                        [(ngModel)]="editingProduct.price" 
                        name="editPrice"
                        required
                        min="0"
                        step="0.01"
                        class="form-input w-full">
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                      <input 
                        type="number" 
                        [(ngModel)]="editingProduct.stock" 
                        name="editStock"
                        required
                        min="0"
                        class="form-input w-full">
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                      <input 
                        type="text" 
                        [(ngModel)]="editingProduct.sku" 
                        name="editSku"
                        required
                        class="form-input w-full">
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                    <input 
                      type="text" 
                      [(ngModel)]="editingProduct.shortDescription" 
                      name="editShortDescription"
                      required
                      class="form-input w-full">
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
                    <textarea 
                      [(ngModel)]="editingProduct.description" 
                      name="editDescription"
                      required
                      rows="4"
                      class="form-input w-full"></textarea>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select 
                      [(ngModel)]="editingProduct.isActive" 
                      name="editStatus"
                      class="form-input w-full">
                      <option [value]="true">Active</option>
                      <option [value]="false">Inactive</option>
                    </select>
                  </div>
                  
                  <div class="flex space-x-3">
                    <button 
                      type="submit" 
                      [disabled]="!editProductForm.form.valid || isSubmitting()"
                      class="btn-primary">
                      @if (isSubmitting()) {
                        <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      }
                      {{ isSubmitting() ? 'Updating...' : 'Update Product' }}
                    </button>
                    <button 
                      type="button" 
                      (click)="cancelEditProduct()"
                      class="btn-secondary">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            }

            <!-- Products Table -->
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  @for (product of filteredProducts(); track product.id) {
                    <tr>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div class="flex-shrink-0 h-10 w-10">
                            <img class="h-10 w-10 rounded-lg object-cover" 
                                 [src]="getProductImage(product)" 
                                 [alt]="product.name"
                                 (error)="onImageError($event)">
                          </div>
                          <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                            <div class="text-sm text-gray-500">{{ product.sku }}</div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ product.category.name || 'N/A' }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$ {{ product.price }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ product.inventory.quantity || 0 }}</td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        @if (product.isActive) {
                          <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                        } @else {
                          <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Inactive</span>
                        }
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div class="flex space-x-2">
                          <button 
                            (click)="editProduct(product)"
                            class="text-blue-600 hover:text-blue-900">
                            Edit
                          </button>
                          <button 
                            (click)="deleteProduct(product)"
                            class="text-red-600 hover:text-red-900">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
              
              <!-- No Results Message -->
              @if (filteredProducts().length === 0) {
                <div class="text-center py-8">
                  <p class="text-gray-500">No products found matching your search criteria.</p>
                </div>
              }
            </div>
          </div>
        }

        <!-- Orders Tab -->
        @if (activeTab() === 'orders') {
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Order Management</h3>
            <p class="text-gray-600">Order management functionality coming soon.</p>
          </div>
        }

        <!-- Users Tab -->
        @if (activeTab() === 'users') {
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">User Management</h3>
            <p class="text-gray-600">User management functionality coming soon.</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .form-input {
      @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500;
    }
    .btn-primary {
      @apply inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed;
    }
    .btn-secondary {
      @apply inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  activeTab = signal<'overview' | 'products' | 'orders' | 'users'>('overview');
  showAddProductForm = signal<boolean>(false);
  showEditProductForm = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);
  
  // Search and filter properties
  searchQuery = signal<string>('');
  categoryFilter = signal<string>('');
  statusFilter = signal<string>('');
  
  products = signal<Product[]>([]);
  categories = signal<any[]>([]);
  brands = signal<any[]>([]);
  
  // Computed properties for statistics
  totalProducts = computed(() => this.products().length);
  activeProducts = computed(() => this.products().filter(p => p.isActive).length);
  featuredProducts = computed(() => this.products().filter(p => p.isFeatured).length);
  lowStockProducts = computed(() => this.products().filter(p => p.inventory?.status === 'low_stock').length);
  
  // Filtered products based on search and filters
  filteredProducts = computed(() => {
    let filtered = this.products();
    
    // Search by name, SKU, or category
    if (this.searchQuery()) {
      const query = this.searchQuery().toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query) ||
        product.category?.name.toLowerCase().includes(query)
      );
    }
    
    // Filter by category
    if (this.categoryFilter()) {
      filtered = filtered.filter(product => 
        product.category?.name === this.categoryFilter()
      );
    }
    
    // Filter by status
    if (this.statusFilter()) {
      if (this.statusFilter() === 'active') {
        filtered = filtered.filter(product => product.isActive);
      } else if (this.statusFilter() === 'inactive') {
        filtered = filtered.filter(product => !product.isActive);
      }
    }
    
    return filtered;
  });
  
  newProduct: any = {
    name: '',
    description: '',
    shortDescription: '',
    sku: '',
    price: 0,
    categoryId: '',
    brandId: '',
    stock: 0
  };
  
  editingProduct: any = {
    id: '',
    name: '',
    description: '',
    shortDescription: '',
    sku: '',
    price: 0,
    categoryId: '',
    brandId: '',
    stock: 0,
    isActive: true
  };
  
  selectedFiles: File[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.productService.getProducts().subscribe(result => {
      this.products.set(result.products);
    });
    
    this.productService.getCategories().subscribe(categories => {
      this.categories.set(categories);
    });
    
    this.productService.getBrands().subscribe(brands => {
      this.brands.set(brands);
    });
  }

  onSubmitProduct() {
    if (!this.newProduct.name || !this.newProduct.description) return;
    
    this.isSubmitting.set(true);
    
    const productToCreate = {
      ...this.newProduct,
      price: Number(this.newProduct.price) || 0,
      stock: Number(this.newProduct.stock) || 0,
      category: this.categories().find(c => c.id === this.newProduct.categoryId)?.name || '',
      brand: this.brands().find(b => b.id === this.newProduct.brandId)?.name || '',
      inventory: { 
        quantity: Number(this.newProduct.stock) || 0, 
        lowStockThreshold: 10, 
        trackQuantity: true, 
        allowBackorder: false, 
        status: 'in_stock' 
      }
    };
    
    this.productService.createProduct(productToCreate, this.selectedFiles).subscribe({
      next: (newProduct) => {
        this.products.set([...this.products(), newProduct]);
        this.resetForm();
        this.showAddProductForm.set(false);
        this.isSubmitting.set(false);
      },
      error: (error) => {
        console.error('Error creating product:', error);
        this.isSubmitting.set(false);
      }
    });
  }

  cancelAddProduct() {
    this.resetForm();
    this.showAddProductForm.set(false);
  }

  resetForm() {
    this.newProduct = {
      name: '',
      description: '',
      shortDescription: '',
      sku: '',
      price: 0,
      categoryId: '',
      brandId: '',
      stock: 0
    };
    this.selectedFiles = [];
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFiles = Array.from(event.target.files);
    } else {
      this.selectedFiles = [];
    }
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
    return 'https://via.placeholder.com/40?text=No+Image';
  }

  onImageError(event: any) {
    event.target.src = 'https://via.placeholder.com/40?text=No+Image';
  }

  editProduct(product: Product) {
    this.editingProduct = {
      id: product.id,
      name: product.name,
      description: product.description,
      shortDescription: product.shortDescription,
      sku: product.sku,
      price: product.price,
      categoryId: this.categories().find(c => c.name === product.category?.name)?.id || '',
      brandId: this.brands().find(b => b.name === product.brand?.name)?.id || '',
      stock: product.inventory?.quantity || 0,
      isActive: product.isActive
    };
    this.showEditProductForm.set(true);
  }

  deleteProduct(product: Product) {
    if (confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
      this.productService.deleteProduct(product.id).subscribe({
        next: (success) => {
          if (success) {
            const currentProducts = this.products();
            const filteredProducts = currentProducts.filter(p => p.id !== product.id);
            this.products.set(filteredProducts);
          }
        },
        error: (error) => {
          console.error('Error deleting product:', error);
        }
      });
    }
  }

  onSubmitEditProduct() {
    if (!this.editingProduct.name || !this.editingProduct.description) return;
    
    this.isSubmitting.set(true);
    
    const productToUpdate = {
      ...this.editingProduct,
      price: Number(this.editingProduct.price) || 0,
      stock: Number(this.editingProduct.stock) || 0,
      category: this.categories().find(c => c.id === this.editingProduct.categoryId)?.name || '',
      brand: this.brands().find(b => b.id === this.editingProduct.brandId)?.name || '',
      inventory: { 
        quantity: Number(this.editingProduct.stock) || 0, 
        lowStockThreshold: 10, 
        trackQuantity: true, 
        allowBackorder: false, 
        status: 'in_stock' 
      }
    };
    
    this.productService.updateProduct(this.editingProduct.id, productToUpdate).subscribe({
      next: (updatedProduct) => {
        const currentProducts = this.products();
        const index = currentProducts.findIndex(p => p.id === updatedProduct.id);
        if (index !== -1) {
          currentProducts[index] = updatedProduct;
          this.products.set([...currentProducts]);
        }
        this.cancelEditProduct();
        this.isSubmitting.set(false);
      },
      error: (error) => {
        console.error('Error updating product:', error);
        this.isSubmitting.set(false);
      }
    });
  }

  cancelEditProduct() {
    this.editingProduct = {
      id: '',
      name: '',
      description: '',
      shortDescription: '',
      sku: '',
      price: 0,
      categoryId: '',
      brandId: '',
      stock: 0,
      isActive: true
    };
    this.showEditProductForm.set(false);
  }

  onSearchChange() {
    // The filteredProducts computed property will automatically update
    // when searchQuery, categoryFilter, or statusFilter change
  }
}