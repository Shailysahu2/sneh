import { AfterViewInit, Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { Product, Category } from '../../core/models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen home">
      <!-- Apple-like hero -->
      <section class="home-hero">
        <div class="home-hero__media" aria-hidden="true">
          <img
            class="home-hero__img"
            src="https://images.unsplash.com/photo-1743742566156-f1745850281a?auto=format&fit=crop&w=2400&q=80"
            alt=""
            loading="eager"
            fetchpriority="high"
            (error)="onHeroImgError($event)"
          />
          <div class="home-hero__scrim"></div>
          <div class="home-hero__glow"></div>
        </div>

        <div class="container mx-auto px-4">
          <div class="home-hero__content reveal is-in">
            <div class="home-hero__eyebrow">SnehKrishiKendra</div>
            <h1 class="home-hero__title">
              Water pumps that feel <span class="home-hero__titleAccent">effortless</span>.
            </h1>
            <p class="home-hero__lead">
              Reliable performance, clean installation, and support that stays with you.
            </p>
            <p class="home-hero__sub">
              आपकी सेवा में सर्वश्रेष्ठ जल पंप—विश्वसनीय, कुशल और हर आवश्यकता के लिए उपयुक्त।
            </p>
            <div class="home-hero__cta">
              <a routerLink="/products" class="btn-primary text-lg px-8 py-4">Shop Now</a>
              <a
                routerLink="/products"
                [queryParams]="{ featured: true }"
                class="btn-secondary text-lg px-8 py-4"
                style="background: rgba(255,255,255,.12); border-color: rgba(255,255,255,.22); color: rgba(255,255,255,.92);"
              >
                View Deals
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="py-16">
        <div class="container mx-auto px-4">
          <div class="text-center mb-10 reveal" data-reveal>
            <div class="home-kicker">Why customers choose us</div>
            <h2 class="home-h2">Quality you can see. Support you can feel.</h2>
            <p class="home-p max-w-2xl mx-auto">
              Premium products, transparent pricing, and fast help when you need it.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="card p-6 reveal" data-reveal>
              <div class="home-icon home-icon--blue" aria-hidden="true">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9m-9 0h9"></path>
                </svg>
              </div>
              <h3 class="home-h3">Fast Delivery</h3>
              <p class="home-p">Quick dispatch and careful packaging—built to arrive safe and ready.</p>
            </div>

            <div class="card p-6 reveal" data-reveal>
              <div class="home-icon home-icon--green" aria-hidden="true">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 class="home-h3">Trusted Quality</h3>
              <p class="home-p">Authentic products with dependable performance and long-term value.</p>
            </div>

            <div class="card p-6 reveal" data-reveal>
              <div class="home-icon home-icon--purple" aria-hidden="true">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z"></path>
                </svg>
              </div>
              <h3 class="home-h3">Expert Support</h3>
              <p class="home-p">Real help for selection, installation, and issues—on chat or ticket.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Apple-like scroll stack -->
      <section class="home-stack">
        <div class="container mx-auto px-4">
          <div class="home-stack__head reveal" data-reveal>
            <div class="home-kicker">Designed to fit your work</div>
            <h2 class="home-h2">Three reasons it feels premium.</h2>
            <p class="home-p max-w-2xl mx-auto">
              Beautiful engineering is invisible. You just notice the results.
            </p>
          </div>

          <div class="home-stack__grid">
            <article class="home-stackCard reveal" data-reveal style="--i: 0;">
              <div class="home-stackCard__media" aria-hidden="true">
                <img
                  src="https://images.unsplash.com/photo-1698031610511-c7a35d121b17?auto=format&fit=crop&w=1600&q=80"
                  alt=""
                  loading="lazy"
                  decoding="async"
                  (error)="onStackImgError($event)"
                />
              </div>
              <div class="home-stackCard__content">
                <div class="home-stackCard__label">Self‑priming</div>
                <h3 class="home-h3">Surface pump installation, simplified.</h3>
                <p class="home-p">Right fittings, clean piping, and priming guidance that prevents dry‑run issues.</p>
              </div>
            </article>

            <article class="home-stackCard reveal" data-reveal style="--i: 1;">
              <div class="home-stackCard__media" aria-hidden="true">
                <img
                  src="https://images.unsplash.com/photo-1610401323094-6f0dcda346b8?auto=format&fit=crop&w=1600&q=80"
                  alt=""
                  loading="lazy"
                  decoding="async"
                  (error)="onStackImgError($event)"
                />
              </div>
              <div class="home-stackCard__content">
                <div class="home-stackCard__label">Submersible</div>
                <h3 class="home-h3">Quiet power. Serious output.</h3>
                <p class="home-p">Ideal for borewell and tank use—steady water flow with efficient operation.</p>
              </div>
            </article>

            <article class="home-stackCard reveal" data-reveal style="--i: 2;">
              <div class="home-stackCard__media" aria-hidden="true">
                <img
                  src="https://images.unsplash.com/photo-1644469757549-a82b610882fb?auto=format&fit=crop&w=1600&q=80"
                  alt=""
                  loading="lazy"
                  decoding="async"
                  (error)="onStackImgError($event)"
                />
              </div>
              <div class="home-stackCard__content">
                <div class="home-stackCard__label">Service</div>
                <h3 class="home-h3">Support that doesn’t disappear.</h3>
                <p class="home-p">Selection help, installation checks, and quick tickets when you need follow‑ups.</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <!-- Categories Section -->
      <section class="py-16">
        <div class="container mx-auto px-4">
          <div class="text-center mb-12">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Shop by Category</h2>
            <p class="text-gray-600 max-w-2xl mx-auto">
              Explore our wide range of categories and find exactly what you're looking for.
            </p>
          </div>

          @if (isLoading()) {
            <div class="flex justify-center">
              <div class="spinner"></div>
            </div>
          } @else {
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              @for (category of categories(); track category.id) {
                <a routerLink="/products" [queryParams]="{category: category.slug}" 
                   class="group text-center p-6 card transition-soft">
                  <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"
                       style="background: radial-gradient(circle at 30% 30%, rgba(34,197,94,.35), rgba(59,130,246,.22), rgba(168,85,247,.18)); border: 1px solid rgba(17,24,39,.10);">
                    <span class="text-white font-bold text-lg">{{ category.name[0] }}</span>
                  </div>
                  <h3 class="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {{ category.name }}
                  </h3>
                </a>
              }
            </div>
          }
        </div>
      </section>

      <!-- Featured Products Section -->
      <section class="py-16">
        <div class="container mx-auto px-4">
          <div class="text-center mb-12">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Featured Products</h2>
            <p class="text-gray-600 max-w-2xl mx-auto">
              Check out our handpicked selection of the best products just for you.
            </p>
          </div>

          @if (isLoading()) {
            <div class="flex justify-center">
              <div class="spinner"></div>
            </div>
          } @else {
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              @for (product of featuredProducts(); track product.id) {
                <div class="card p-4 group">
                  <div class="relative mb-4 overflow-hidden rounded-lg">
                    <img [src]="product.images[0].url" 
                         [alt]="product.name"
                         class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300">
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
                        <span class="text-lg font-bold text-red-600">\${{ product.salePrice }}</span>
                        <span class="text-sm text-gray-500 line-through">\${{ product.price }}</span>
                      } @else {
                        <span class="text-lg font-bold text-gray-800">\${{ product.price }}</span>
                      }
                    </div>
                    
                    <div class="flex items-center space-x-1">
                      <svg class="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                      <span class="text-sm text-gray-600">{{ product.ratings.average }}</span>
                    </div>
                  </div>
                  
                  <div class="flex space-x-2">
                    <a [routerLink]="['/products', product.id]" class="flex-1 btn-primary text-center text-sm py-2">
                      View Details
                    </a>
                    <button class="btn-secondary px-3 py-2">
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9m-9 0h9"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              }
            </div>
          }

          <div class="text-center mt-12">
            <a routerLink="/products" class="btn-primary text-lg px-8 py-3">
              View All Products
            </a>
          </div>
        </div>
      </section>

      <!-- Newsletter Section -->
      <section class="py-16 text-white" style="background: linear-gradient(180deg, rgba(17,24,39,.96), rgba(17,24,39,.90));">
        <div class="container mx-auto px-4">
          <div class="max-w-2xl mx-auto text-center">
            <h2 class="text-3xl font-bold mb-4">Stay Updated</h2>
            <p class="text-gray-300 mb-8">
              Subscribe to our newsletter and be the first to know about new products, exclusive deals, and special offers.
            </p>
            
            <form class="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input type="email" 
                     placeholder="Enter your email" 
                     class="flex-1 px-4 py-3 rounded-xl text-gray-900 focus:outline-none"
                     style="background: rgba(255,255,255,.92); border: 1px solid rgba(255,255,255,.18); box-shadow: 0 18px 50px rgba(0,0,0,.18);">
              <button type="submit" class="btn-primary px-6 py-3 whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .home {
        overflow-x: clip;
      }

      .home-hero {
        position: relative;
        min-height: min(92vh, 860px);
        display: grid;
        align-items: center;
        padding: 84px 0;
        color: rgba(255, 255, 255, 0.95);
        background: linear-gradient(180deg, rgba(17, 24, 39, 0.98), rgba(17, 24, 39, 0.92));
      }

      .home-hero__media {
        position: absolute;
        inset: 0;
        overflow: hidden;
      }

      .home-hero__img {
        position: absolute;
        inset: -40px;
        width: calc(100% + 80px);
        height: calc(100% + 80px);
        object-fit: cover;
        filter: saturate(1.05) contrast(1.05);
        transform: scale(1.03);
      }

      .home-hero__scrim {
        position: absolute;
        inset: 0;
        background:
          radial-gradient(900px 520px at 20% 10%, rgba(59, 130, 246, 0.35), rgba(255, 255, 255, 0) 55%),
          radial-gradient(900px 540px at 90% 12%, rgba(168, 85, 247, 0.30), rgba(255, 255, 255, 0) 58%),
          radial-gradient(1100px 680px at 50% 120%, rgba(34, 197, 94, 0.22), rgba(255, 255, 255, 0) 60%),
          linear-gradient(180deg, rgba(17, 24, 39, 0.70), rgba(17, 24, 39, 0.92));
      }

      .home-hero__glow {
        position: absolute;
        inset: -30%;
        background: conic-gradient(from 230deg, rgba(34, 197, 94, 0.18), rgba(59, 130, 246, 0.18), rgba(168, 85, 247, 0.18), rgba(34, 197, 94, 0.18));
        filter: blur(90px);
        opacity: 0.35;
        mix-blend-mode: screen;
      }

      .home-hero__content {
        position: relative;
        max-width: 980px;
        margin: 0 auto;
        text-align: center;
      }

      .home-hero__eyebrow {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 7px 12px;
        border-radius: 999px;
        border: 1px solid rgba(255, 255, 255, 0.18);
        background: rgba(255, 255, 255, 0.08);
        backdrop-filter: blur(14px) saturate(1.35);
        -webkit-backdrop-filter: blur(14px) saturate(1.35);
        font-weight: 700;
        font-size: 12px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.88);
      }

      .home-hero__title {
        margin-top: 18px;
        font-size: clamp(40px, 6vw, 68px);
        line-height: 1.02;
        letter-spacing: -0.04em;
        font-weight: 800;
        text-shadow: 0 24px 90px rgba(0, 0, 0, 0.45);
      }

      .home-hero__titleAccent {
        background: radial-gradient(circle at 30% 30%, rgba(34, 197, 94, 0.95), rgba(59, 130, 246, 0.92), rgba(168, 85, 247, 0.9));
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
      }

      .home-hero__lead {
        margin-top: 18px;
        font-size: clamp(16px, 2.2vw, 22px);
        color: rgba(255, 255, 255, 0.88);
      }

      .home-hero__sub {
        margin-top: 10px;
        font-size: clamp(14px, 1.8vw, 18px);
        color: rgba(255, 255, 255, 0.78);
      }

      .home-hero__cta {
        margin-top: 28px;
        display: flex;
        gap: 14px;
        flex-wrap: wrap;
        justify-content: center;
      }

      .home-kicker {
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        font-size: 12px;
        color: rgba(17, 24, 39, 0.60);
      }

      .home-h2 {
        margin-top: 10px;
        font-size: clamp(28px, 3.5vw, 44px);
        letter-spacing: -0.03em;
        font-weight: 800;
        color: rgba(17, 24, 39, 0.92);
      }

      .home-h3 {
        margin-top: 10px;
        font-size: 18px;
        font-weight: 800;
        letter-spacing: -0.01em;
        color: rgba(17, 24, 39, 0.92);
      }

      .home-p {
        margin-top: 10px;
        color: rgba(17, 24, 39, 0.62);
      }

      .home-icon {
        height: 44px;
        width: 44px;
        border-radius: 14px;
        display: inline-grid;
        place-items: center;
        border: 1px solid rgba(17, 24, 39, 0.10);
        box-shadow: 0 18px 50px rgba(0, 0, 0, 0.10);
        background: rgba(255, 255, 255, 0.70);
        backdrop-filter: blur(14px) saturate(1.35);
        -webkit-backdrop-filter: blur(14px) saturate(1.35);
      }
      .home-icon--blue { color: #2563eb; }
      .home-icon--green { color: #16a34a; }
      .home-icon--purple { color: #7c3aed; }

      /* Scroll reveal */
      .reveal {
        opacity: 0;
        transform: translateY(18px) scale(0.985);
        filter: blur(6px);
        transition: opacity 700ms cubic-bezier(.2,.7,.2,1), transform 700ms cubic-bezier(.2,.7,.2,1), filter 700ms cubic-bezier(.2,.7,.2,1);
        will-change: transform, opacity, filter;
      }
      .reveal.is-in {
        opacity: 1;
        transform: translateY(0) scale(1);
        filter: blur(0);
      }

      .home-stack {
        padding: 72px 0 90px 0;
      }

      .home-stack__head {
        text-align: center;
        margin-bottom: 28px;
      }

      .home-stack__grid {
        display: grid;
        gap: 16px;
      }

      .home-stackCard {
        position: sticky;
        top: 96px;
        border-radius: 22px;
        overflow: hidden;
        border: 1px solid rgba(17, 24, 39, 0.12);
        background: rgba(255, 255, 255, 0.78);
        backdrop-filter: blur(14px) saturate(1.35);
        -webkit-backdrop-filter: blur(14px) saturate(1.35);
        box-shadow: 0 26px 80px rgba(0, 0, 0, 0.14);
        transform: translateY(calc(var(--i) * 10px));
      }

      .home-stackCard__media {
        position: relative;
        height: 260px;
        overflow: hidden;
        background:
          radial-gradient(900px 420px at 20% 10%, rgba(59, 130, 246, 0.22), rgba(255, 255, 255, 0) 55%),
          radial-gradient(900px 420px at 90% 12%, rgba(168, 85, 247, 0.18), rgba(255, 255, 255, 0) 58%),
          linear-gradient(180deg, rgba(17, 24, 39, 0.08), rgba(17, 24, 39, 0.02));
      }

      .home-stackCard__media img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transform: scale(1.02);
        filter: saturate(1.05) contrast(1.03);
      }

      .home-stackCard__media.is-fallback img {
        display: none;
      }

      .home-stackCard__media.is-fallback::after {
        content: 'Premium imagery loading…';
        position: absolute;
        inset: 0;
        display: grid;
        place-items: center;
        color: rgba(17, 24, 39, 0.55);
        font-weight: 750;
        letter-spacing: -0.01em;
      }

      .home-stackCard__content {
        padding: 18px 18px 20px 18px;
      }

      .home-stackCard__label {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        height: 28px;
        padding: 0 10px;
        border-radius: 999px;
        border: 1px solid rgba(17, 24, 39, 0.12);
        background: rgba(255, 255, 255, 0.85);
        font-size: 12px;
        font-weight: 800;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: rgba(17, 24, 39, 0.7);
      }

      @media (max-width: 768px) {
        .home-stackCard {
          top: 78px;
        }
        .home-stackCard__media {
          height: 220px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .reveal {
          transition: none !important;
          opacity: 1 !important;
          transform: none !important;
          filter: none !important;
        }
      }
    `
  ]
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  categories = signal<Category[]>([]);
  featuredProducts = signal<Product[]>([]);
  isLoading = signal<boolean>(true);
  private revealObserver: IntersectionObserver | null = null;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (els.length === 0) return;

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'));
      return;
    }

    this.revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add('is-in');
            this.revealObserver?.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -10% 0px' }
    );

    els.forEach((el) => this.revealObserver?.observe(el));
  }

  ngOnDestroy(): void {
    this.revealObserver?.disconnect();
    this.revealObserver = null;
  }

  onHeroImgError(event: Event): void {
    const img = event.target as HTMLImageElement | null;
    if (!img) return;
    img.style.display = 'none';
  }

  onStackImgError(event: Event): void {
    const img = event.target as HTMLImageElement | null;
    if (!img) return;
    const media = img.closest('.home-stackCard__media') as HTMLElement | null;
    media?.classList.add('is-fallback');
    img.removeAttribute('src');
  }

  private loadData(): void {
    this.isLoading.set(true);

    // Load categories
    this.productService.getCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
      }
    });

    // Load featured products
    this.productService.getFeaturedProducts().subscribe({
      next: (products) => {
        this.featuredProducts.set(products);
        this.isLoading.set(false);
      }
    });
  }
}