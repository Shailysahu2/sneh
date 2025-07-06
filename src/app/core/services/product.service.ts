import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, delay, map, catchError } from 'rxjs';
import { Product, ProductFilter, Category, Brand } from '../models/product.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly API_URL = `${environment.apiUrl}/products`;
  private apiUrl = environment.apiUrl;
  
  // Signals for reactive state
  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  brands = signal<Brand[]>([]);
  isLoading = signal<boolean>(false);

  constructor(private http: HttpClient) {
    this.loadMockData();
    this.loadProductsFromBackend();
  }

  private loadMockData(): void {
    // Mock categories
    const mockCategories: Category[] = [
      { id: '1', name: 'Electronics', slug: 'electronics', isActive: true },
      { id: '2', name: 'Clothing', slug: 'clothing', isActive: true },
      { id: '3', name: 'Home & Garden', slug: 'home-garden', isActive: true },
      { id: '4', name: 'Sports', slug: 'sports', isActive: true },
      { id: '5', name: 'Books', slug: 'books', isActive: true }
    ];

    // Mock brands
    const mockBrands: Brand[] = [
      { id: '1', name: 'Apple', slug: 'apple', isActive: true },
      { id: '2', name: 'Samsung', slug: 'samsung', isActive: true },
      { id: '3', name: 'Nike', slug: 'nike', isActive: true },
      { id: '4', name: 'Adidas', slug: 'adidas', isActive: true },
      { id: '5', name: 'Sony', slug: 'sony', isActive: true }
    ];

    this.categories.set(mockCategories);
    this.brands.set(mockBrands);
  }

  private loadProductsFromBackend(): void {
    this.getProductsFromBackend().subscribe({
      next: (result) => {
        this.products.set(result.products);
      },
      error: (error) => {
        console.error('Error loading products from backend:', error);
        // Keep mock data if backend fails
      }
    });
  }

  private getProductsFromBackend(): Observable<{ products: Product[], total: number }> {
    return this.http.get<any[]>(this.API_URL).pipe(
      map(backendProducts => {
        console.log('Raw backend products:', backendProducts); // Debug log
        const products: Product[] = backendProducts.map(bp => {
          console.log('Processing backend product:', bp); // Debug log
          
          // Process images first
          const processedProduct = this.processProductImages(bp);
          console.log('Processed product images:', processedProduct.images); // Debug log
          
          return {
            id: bp._id || bp.id,
            name: bp.name,
            description: bp.description,
            shortDescription: bp.description?.substring(0, 100) || '',
            sku: bp.sku || `SKU${bp._id}`,
            price: bp.price,
            salePrice: bp.salePrice,
            images: processedProduct.images,
            category: this.categories().find(c => c.name === bp.category) || this.categories()[0],
            brand: this.brands().find(b => b.name === bp.brand) || this.brands()[0],
            tags: bp.tags || [],
            attributes: bp.attributes || [],
            variants: bp.variants || [],
            inventory: {
              quantity: bp.stock || 0,
              lowStockThreshold: 10,
              trackQuantity: true,
              allowBackorder: false,
              status: (bp.stock || 0) > 0 ? 'in_stock' : 'out_of_stock'
            },
            seo: { slug: bp.name?.toLowerCase().replace(/\s+/g, '-'), title: bp.name },
            ratings: { average: bp.rating || 0, count: bp.numReviews || 0, distribution: {} },
            reviews: [],
            isActive: true,
            isFeatured: false,
            createdAt: new Date(bp.createdAt),
            updatedAt: new Date(bp.updatedAt)
          };
        });
        console.log('Final processed products:', products); // Debug log
        return { products, total: products.length };
      }),
      catchError(error => {
        console.error('Backend API error:', error);
        return of({ products: [], total: 0 });
      })
    );
  }

  getProducts(): Observable<{ products: Product[]; total: number }> {
    return this.http.get<any[]>(this.API_URL).pipe(
      map(backendProducts => {
        console.log('Raw products from backend:', backendProducts); // Debug log
        const products: Product[] = backendProducts.map(bp => {
          console.log('Processing backend product:', bp); // Debug log
          
          // Process images first
          const processedProduct = this.processProductImages(bp);
          console.log('Processed product images:', processedProduct.images); // Debug log
          
          return {
            id: bp._id || bp.id,
            name: bp.name,
            description: bp.description,
            shortDescription: bp.description?.substring(0, 100) || '',
            sku: bp.sku || `SKU${bp._id}`,
            price: bp.price,
            salePrice: bp.salePrice,
            images: processedProduct.images,
            category: this.categories().find(c => c.name === bp.category) || this.categories()[0],
            brand: this.brands().find(b => b.name === bp.brand) || this.brands()[0],
            tags: bp.tags || [],
            attributes: bp.attributes || [],
            variants: bp.variants || [],
            inventory: {
              quantity: bp.stock || 0,
              lowStockThreshold: 10,
              trackQuantity: true,
              allowBackorder: false,
              status: (bp.stock || 0) > 0 ? 'in_stock' : 'out_of_stock'
            },
            seo: { slug: bp.name?.toLowerCase().replace(/\s+/g, '-'), title: bp.name },
            ratings: { average: bp.rating || 0, count: bp.numReviews || 0, distribution: {} },
            reviews: [],
            isActive: true,
            isFeatured: false,
            createdAt: new Date(bp.createdAt),
            updatedAt: new Date(bp.updatedAt)
          };
        });
        console.log('Final processed products:', products); // Debug log
        return { products, total: products.length };
      }),
      catchError(error => {
        console.error('Error fetching products:', error);
        return of({ products: [], total: 0 });
      })
    );
  }

  getProduct(id: string): Observable<Product | null> {
    return this.http.get<any>(`${this.API_URL}/${id}`).pipe(
      map(backendProduct => {
        console.log('Raw backend product:', backendProduct); // Debug log
        
        // Process the product images
        const processedProduct = this.processProductImages(backendProduct);
        console.log('Processed images:', processedProduct.images); // Debug log
        
        const product: Product = {
          id: backendProduct._id || backendProduct.id,
          name: backendProduct.name,
          description: backendProduct.description,
          shortDescription: backendProduct.description?.substring(0, 100) || '',
          sku: backendProduct.sku || `SKU${backendProduct._id}`,
          price: backendProduct.price,
          salePrice: backendProduct.salePrice,
          images: processedProduct.images,
          category: this.categories().find(c => c.name === backendProduct.category) || this.categories()[0],
          brand: this.brands().find(b => b.name === backendProduct.brand) || this.brands()[0],
          tags: backendProduct.tags || [],
          attributes: backendProduct.attributes || [],
          variants: backendProduct.variants || [],
          inventory: {
            quantity: backendProduct.stock || 0,
            lowStockThreshold: 10,
            trackQuantity: true,
            allowBackorder: false,
            status: (backendProduct.stock || 0) > 0 ? 'in_stock' : 'out_of_stock'
          },
          seo: { slug: backendProduct.name?.toLowerCase().replace(/\s+/g, '-'), title: backendProduct.name },
          ratings: { average: backendProduct.rating || 0, count: backendProduct.numReviews || 0, distribution: {} },
          reviews: [],
          isActive: true,
          isFeatured: false,
          createdAt: new Date(backendProduct.createdAt),
          updatedAt: new Date(backendProduct.updatedAt)
        };
        
        console.log('Final processed product for detail view:', product); // Debug log
        return product;
      }),
      catchError(error => {
        console.error('Error fetching product:', error);
        return of(null);
      })
    );
  }

  getFeaturedProducts(): Observable<Product[]> {
    const featured = this.products().filter(p => p.isFeatured);
    return of(featured).pipe(delay(300));
  }

  getCategories(): Observable<Category[]> {
    return of(this.categories()).pipe(delay(200));
  }

  getBrands(): Observable<Brand[]> {
    return of(this.brands()).pipe(delay(200));
  }

  searchProducts(query: string): Observable<Product[]> {
    const filtered = this.products().filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase()) ||
      p.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
    return of(filtered).pipe(delay(300));
  }

  getRelatedProducts(productId: string): Observable<Product[]> {
    const product = this.products().find(p => p.id === productId);
    if (!product) return of([]);

    const related = this.products()
      .filter(p => p.id !== productId && p.category.id === product.category.id)
      .slice(0, 4);
    
    return of(related).pipe(delay(300));
  }

  // Admin methods
  createProduct(product: Partial<Product>, files?: File[]): Observable<Product> {
    if (files && files.length > 0) {
      const formData = new FormData();
      formData.append('name', product.name || '');
      formData.append('description', product.description || '');
      formData.append('price', String(product.price || 0));
      formData.append('category', typeof product.category === 'object' ? product.category?.name : product.category || '');
      formData.append('brand', typeof product.brand === 'object' ? product.brand?.name : product.brand || '');
      formData.append('stock', String(product.inventory?.quantity || 0));
      formData.append('sku', product.sku || '');
      files.forEach((file, i) => {
        formData.append('images', file, file.name);
      });
      
      return this.http.post<any>(this.API_URL, formData).pipe(
        map(response => {
          const newProduct: Product = {
            id: response._id || Date.now().toString(),
            name: response.name,
            description: response.description,
            shortDescription: product.shortDescription || response.description.substring(0, 100),
            sku: response.sku || product.sku || `SKU${Date.now()}`,
            price: response.price,
            salePrice: product.salePrice,
            images: response.images?.map((img: any, index: number) => ({
              id: index.toString(),
              url: img.url,
              alt: response.name,
              isPrimary: index === 0,
              order: index + 1
            })) || [],
            category: this.categories().find(c => c.name === response.category) || this.categories()[0],
            brand: this.brands().find(b => b.name === response.brand) || this.brands()[0],
            tags: product.tags || [],
            attributes: product.attributes || [],
            variants: product.variants || [],
            inventory: {
              quantity: response.stock,
              lowStockThreshold: product.inventory?.lowStockThreshold || 10,
              trackQuantity: true,
              allowBackorder: false,
              status: response.stock > 0 ? 'in_stock' : 'out_of_stock'
            },
            seo: product.seo || { slug: response.name?.toLowerCase().replace(/\s+/g, '-'), title: response.name },
            ratings: { average: 0, count: 0, distribution: {} },
            reviews: [],
            isActive: true,
            isFeatured: false,
            createdAt: new Date(),
            updatedAt: new Date()
          };
          
          // Add to local state
          const currentProducts = this.products();
          this.products.set([...currentProducts, newProduct]);
          
          return newProduct;
        }),
        catchError(error => {
          console.error('Error creating product:', error);
          if (error.error) {
            console.error('Backend error details:', error.error);
          }
          throw error;
        })
      );
    } else {
      // JSON approach for products without files
      const backendProduct = {
        name: product.name,
        description: product.description,
        price: product.price,
        category: typeof product.category === 'object' ? product.category?.name : product.category,
        brand: typeof product.brand === 'object' ? product.brand?.name : product.brand,
        stock: product.inventory?.quantity || 0,
        sku: product.sku,
        images: product.images?.map(img => ({ url: img.url, public_id: '' })) || []
      };
      
      return this.http.post<any>(this.API_URL, backendProduct).pipe(
        map(response => {
          const newProduct: Product = {
            id: response._id || Date.now().toString(),
            name: response.name,
            description: response.description,
            shortDescription: product.shortDescription || response.description.substring(0, 100),
            sku: response.sku || product.sku || `SKU${Date.now()}`,
            price: response.price,
            salePrice: product.salePrice,
            images: response.images?.map((img: any, index: number) => ({
              id: index.toString(),
              url: img.url,
              alt: response.name,
              isPrimary: index === 0,
              order: index + 1
            })) || [],
            category: this.categories().find(c => c.name === response.category) || this.categories()[0],
            brand: this.brands().find(b => b.name === response.brand) || this.brands()[0],
            tags: product.tags || [],
            attributes: product.attributes || [],
            variants: product.variants || [],
            inventory: {
              quantity: response.stock,
              lowStockThreshold: product.inventory?.lowStockThreshold || 10,
              trackQuantity: true,
              allowBackorder: false,
              status: response.stock > 0 ? 'in_stock' : 'out_of_stock'
            },
            seo: product.seo || { slug: response.name?.toLowerCase().replace(/\s+/g, '-'), title: response.name },
            ratings: { average: 0, count: 0, distribution: {} },
            reviews: [],
            isActive: true,
            isFeatured: false,
            createdAt: new Date(),
            updatedAt: new Date()
          };
          
          // Add to local state
          const currentProducts = this.products();
          this.products.set([...currentProducts, newProduct]);
          
          return newProduct;
        }),
        catchError(error => {
          console.error('Error creating product:', error);
          if (error.error) {
            console.error('Backend error details:', error.error);
          }
          throw error;
        })
      );
    }
  }

  updateProduct(id: string, updates: Partial<Product>): Observable<Product> {
    const backendUpdates = {
      name: updates.name,
      description: updates.description,
      price: updates.price,
      category: typeof updates.category === 'object' ? updates.category?.name : updates.category,
      brand: typeof updates.brand === 'object' ? updates.brand?.name : updates.brand,
      stock: updates.inventory?.quantity || 0,
      sku: updates.sku,
      isActive: updates.isActive
    };

    return this.http.put<any>(`${this.API_URL}/${id}`, backendUpdates).pipe(
      map(response => {
        const updatedProduct: Product = {
          id: response._id || id,
          name: response.name,
          description: response.description,
          shortDescription: updates.shortDescription || response.description?.substring(0, 100) || '',
          sku: response.sku,
          price: response.price,
          salePrice: updates.salePrice,
          images: response.images?.map((img: any, index: number) => ({
            id: index.toString(),
            url: this.getFullImageUrl(img.url || img),
            alt: response.name,
            isPrimary: index === 0,
            order: index + 1
          })) || [],
          category: this.categories().find(c => c.name === response.category) || this.categories()[0],
          brand: this.brands().find(b => b.name === response.brand) || this.brands()[0],
          tags: updates.tags || [],
          attributes: updates.attributes || [],
          variants: updates.variants || [],
          inventory: {
            quantity: response.stock || 0,
            lowStockThreshold: updates.inventory?.lowStockThreshold || 10,
            trackQuantity: true,
            allowBackorder: false,
            status: (response.stock || 0) > 0 ? 'in_stock' : 'out_of_stock'
          },
          seo: updates.seo || { slug: response.name?.toLowerCase().replace(/\s+/g, '-'), title: response.name },
          ratings: updates.ratings || { average: 0, count: 0, distribution: {} },
          reviews: updates.reviews || [],
          isActive: response.isActive !== undefined ? response.isActive : true,
          isFeatured: updates.isFeatured || false,
          createdAt: new Date(response.createdAt),
          updatedAt: new Date(response.updatedAt)
        };

        // Update local state
        const currentProducts = this.products();
        const index = currentProducts.findIndex(p => p.id === id);
        if (index !== -1) {
          currentProducts[index] = updatedProduct;
          this.products.set([...currentProducts]);
        }

        return updatedProduct;
      }),
      catchError(error => {
        console.error('Error updating product:', error);
        throw error;
      })
    );
  }

  deleteProduct(id: string): Observable<boolean> {
    return this.http.delete<any>(`${this.API_URL}/${id}`).pipe(
      map(response => {
        // Remove from local state
        const currentProducts = this.products();
        const filtered = currentProducts.filter(p => p.id !== id);
        this.products.set(filtered);
        
        return true;
      }),
      catchError(error => {
        console.error('Error deleting product:', error);
        throw error;
      })
    );
  }

  // Helper method to get full image URL
  private getFullImageUrl(imagePath: string): string {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    // Ensure we have the correct format: https://sneh-backend.onrender.com/uploads/filename
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    const baseUrl = environment.apiUrl.replace('/api', ''); // Remove /api to get base URL
    const fullUrl = `${baseUrl}${cleanPath}`;
    console.log('Generated image URL:', fullUrl); // Debug log
    return fullUrl;
  }

  // Helper method to process product images
  private processProductImages(product: any): any {
    console.log('Processing images for product:', product.name, product); // Debug log
    
    // Handle both imageUrl and images fields from backend
    let processedImages = [];
    
    // First, check if there's an imageUrl field
    if (product.imageUrl && product.imageUrl.trim() !== '') {
      console.log('Found imageUrl:', product.imageUrl); // Debug log
      processedImages.push({
        id: '0',
        url: this.getFullImageUrl(product.imageUrl),
        alt: product.name,
        isPrimary: true,
        order: 1
      });
    }
    
    // Then, process the images array if it exists
    if (product.images && Array.isArray(product.images)) {
      console.log('Found images array:', product.images); // Debug log
      product.images.forEach((img: any, index: number) => {
        console.log('Processing image item:', img); // Debug log
        
        if (typeof img === 'string') {
          processedImages.push({
            id: (processedImages.length + index).toString(),
            url: this.getFullImageUrl(img),
            alt: product.name,
            isPrimary: processedImages.length === 0 && index === 0,
            order: processedImages.length + index + 1
          });
        } else if (img && img.url) {
          console.log('Processing image with URL:', img.url); // Debug log
          processedImages.push({
            id: (processedImages.length + index).toString(),
            url: this.getFullImageUrl(img.url),
            alt: product.name,
            isPrimary: processedImages.length === 0 && index === 0,
            order: processedImages.length + index + 1
          });
        }
      });
    }
    
    // If no images found, add a placeholder
    if (processedImages.length === 0) {
      console.log('No images found, using placeholder'); // Debug log
      processedImages.push({
        id: '0',
        url: 'https://via.placeholder.com/300x200?text=No+Image',
        alt: product.name,
        isPrimary: true,
        order: 1
      });
    }
    
    console.log('Final processed images:', processedImages); // Debug log
    product.images = processedImages;
    return product;
  }
}