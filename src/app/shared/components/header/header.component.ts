import { Component, HostListener, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/user.model';
import { ToastContainerComponent } from '../toast-container/toast-container.component';
import { ChatbotWidgetComponent } from '../chatbot-widget/chatbot-widget.component';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, ToastContainerComponent, ChatbotWidgetComponent],
  template: `
    <header class="ah" role="banner">
      <div class="ah__bar">
        <div class="container mx-auto px-4">
          <div class="ah__inner">
            <!-- Logo -->
            <div class="ah__left">
              <a routerLink="/" class="ah__logo" aria-label="SnehKrishiKendra home">
                <img
                  src="assets/240_F_1526505345_Y0orkkdbHTvBtrlOHDjgMFe7y9DiOAx6.jpg"
                  alt="SnehKrishiKendra Logo"
                  class="ah__logoImg"
                />
                <span class="ah__brand">SnehKrishiKendra</span>
              </a>
            </div>

            <!-- Navigation -->
            <nav class="ah__nav" aria-label="Primary">
              <a
                routerLink="/"
                [routerLinkActiveOptions]="{ exact: true }"
                routerLinkActive="ah__link--active"
                class="ah__link"
              >
                Home
              </a>
              <a routerLink="/products" routerLinkActive="ah__link--active" class="ah__link">Products</a>
              <a routerLink="/support" routerLinkActive="ah__link--active" class="ah__link">Support</a>
            </nav>

            <!-- Search -->
            <div class="ah__searchWrap">
              <div class="ah__search">
                <svg class="ah__searchIcon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <input
                  type="text"
                  placeholder="Search products…"
                  class="ah__searchInput"
                  (input)="onSearchInput($event)"
                  (keyup.enter)="onSearchEnter()"
                  aria-label="Search products"
                />
              </div>
            </div>

            <!-- Actions -->
            <div class="ah__right">
              <app-chatbot-widget></app-chatbot-widget>

              <a routerLink="/cart" class="ah__iconBtn" aria-label="Cart">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9m-9 0h9"></path>
                </svg>
                <span class="ah__badge" [attr.aria-label]="'Cart items: ' + cartItemCount()">{{ cartItemCount() }}</span>
              </a>

              @if (isAuthenticated()) {
                <div class="ah__user">
                  <button type="button" class="ah__userBtn" (click)="toggleUserMenu($event)" aria-label="Open user menu">
                    <span class="ah__avatar" aria-hidden="true">{{ userInitials() }}</span>
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>

                  @if (showUserMenu()) {
                    <div class="ah__menu anim-scale-in" (click)="$event.stopPropagation()">
                      <a routerLink="/profile" class="ah__menuItem">Profile</a>
                      <a routerLink="/profile/orders" class="ah__menuItem">Orders</a>

                      @if (isAdmin()) {
                        <div class="ah__menuSep"></div>
                        <a routerLink="/admin" class="ah__menuItem">Admin Dashboard</a>
                      }

                      @if (isEmployee()) {
                        <div class="ah__menuSep"></div>
                        <a routerLink="/employee" class="ah__menuItem">Employee Panel</a>
                      }

                      <div class="ah__menuSep"></div>
                      <button type="button" (click)="logout()" class="ah__menuItem ah__menuItem--danger">Logout</button>
                    </div>
                  }
                </div>
              } @else {
                <div class="ah__auth">
                  <a routerLink="/auth/login" class="btn-secondary">Login</a>
                  <a routerLink="/auth/register" class="btn-primary">Sign Up</a>
                </div>
              }

              <button type="button" class="ah__burger" (click)="toggleMobileMenu($event)" aria-label="Open menu">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        @if (showMobileMenu()) {
          <div class="ah__mobile anim-slide-down" (click)="$event.stopPropagation()">
            <div class="container mx-auto px-4 py-4">
              <div class="flex flex-col gap-3">
                <a routerLink="/" class="pill">Home</a>
                <a routerLink="/products" class="pill">Products</a>
                <a routerLink="/support" class="pill">Support</a>

                @if (!isAuthenticated()) {
                  <div class="mt-2 pt-4" style="border-top: 1px solid rgba(17,24,39,.10);">
                    <a routerLink="/auth/login" class="btn-secondary text-center">Login</a>
                    <a routerLink="/auth/register" class="btn-primary text-center">Sign Up</a>
                  </div>
                }
              </div>
            </div>
          </div>
        }
      </div>
      <app-toast-container></app-toast-container>
    </header>
  `
  ,
  styles: [
    `
      .ah { position: sticky; top: 0; z-index: 60; }
      .ah__bar {
        background: rgba(255, 255, 255, 0.72);
        border-bottom: 1px solid rgba(17, 24, 39, 0.10);
        backdrop-filter: blur(14px) saturate(1.35);
        -webkit-backdrop-filter: blur(14px) saturate(1.35);
      }
      .ah__inner { height: 68px; display: flex; align-items: center; justify-content: space-between; gap: 14px; }
      .ah__left { display: flex; align-items: center; gap: 12px; min-width: 0; }
      .ah__logo { display: inline-flex; align-items: center; gap: 10px; text-decoration: none; min-width: 0; }
      .ah__logoImg {
        width: 38px; height: 38px; border-radius: 12px; object-fit: cover;
        border: 1px solid rgba(17, 24, 39, 0.10);
        box-shadow: 0 14px 36px rgba(0, 0, 0, 0.10);
        background: rgba(255, 255, 255, 0.85);
      }
      .ah__brand {
        font-weight: 850; letter-spacing: -0.02em; color: rgba(17, 24, 39, 0.92);
        font-size: 16px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .ah__nav { display: none; gap: 10px; align-items: center; }
      .ah__link {
        display: inline-flex; align-items: center; justify-content: center;
        height: 36px; padding: 0 14px; border-radius: 999px;
        border: 1px solid rgba(17, 24, 39, 0.12);
        background: rgba(255, 255, 255, 0.78);
        backdrop-filter: blur(14px) saturate(1.35);
        -webkit-backdrop-filter: blur(14px) saturate(1.35);
        color: rgba(17, 24, 39, 0.84);
        font-weight: 750; font-size: 13px; text-decoration: none;
        box-shadow: 0 14px 36px rgba(0, 0, 0, 0.08);
        transition: transform 180ms ease, box-shadow 180ms ease, background-color 180ms ease, border-color 180ms ease;
      }
      .ah__link:hover { transform: translateY(-1px); border-color: rgba(17, 24, 39, 0.18); box-shadow: 0 18px 46px rgba(0, 0, 0, 0.10); }
      .ah__link--active {
        border: 0;
        background: linear-gradient(135deg, rgba(17, 24, 39, 0.92), rgba(17, 24, 39, 0.74));
        color: rgba(255, 255, 255, 0.96);
        box-shadow: 0 20px 54px rgba(0, 0, 0, 0.18);
      }
      .ah__searchWrap { display: none; flex: 1 1 auto; justify-content: center; min-width: 0; }
      .ah__search { position: relative; width: min(520px, 100%); }
      .ah__searchIcon {
        position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
        height: 18px; width: 18px; color: rgba(17, 24, 39, 0.45); pointer-events: none;
      }
      .ah__searchInput {
        width: 100%; height: 40px; padding: 0 12px 0 38px;
        border-radius: 14px; border: 1px solid rgba(17, 24, 39, 0.14);
        background: rgba(255, 255, 255, 0.86);
        color: rgba(17, 24, 39, 0.92);
        box-shadow: 0 18px 50px rgba(0, 0, 0, 0.10);
        backdrop-filter: blur(14px) saturate(1.35);
        -webkit-backdrop-filter: blur(14px) saturate(1.35);
        outline: none;
        transition: box-shadow 160ms ease, border-color 160ms ease;
      }
      .ah__searchInput::placeholder { color: rgba(17, 24, 39, 0.42); }
      .ah__searchInput:focus { border-color: rgba(59, 130, 246, 0.55); box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.14), 0 18px 50px rgba(0, 0, 0, 0.10); }
      .ah__right { display: flex; align-items: center; gap: 10px; }
      .ah__iconBtn {
        position: relative;
        height: 42px; width: 42px; border-radius: 14px;
        border: 1px solid rgba(17, 24, 39, 0.12);
        background: rgba(255, 255, 255, 0.78);
        backdrop-filter: blur(14px) saturate(1.35);
        -webkit-backdrop-filter: blur(14px) saturate(1.35);
        color: rgba(17, 24, 39, 0.86);
        display: inline-grid; place-items: center; text-decoration: none;
        box-shadow: 0 14px 36px rgba(0, 0, 0, 0.10);
        transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
      }
      .ah__iconBtn:hover { transform: translateY(-1px); border-color: rgba(17, 24, 39, 0.18); box-shadow: 0 18px 46px rgba(0, 0, 0, 0.12); }
      .ah__badge {
        position: absolute; right: -6px; top: -6px;
        min-width: 18px; height: 18px; padding: 0 5px;
        border-radius: 999px; display: inline-flex; align-items: center; justify-content: center;
        font-size: 11px; font-weight: 800; letter-spacing: -0.01em;
        color: rgba(255, 255, 255, 0.96);
        background: linear-gradient(135deg, #ef4444, #f97316);
        box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.92), 0 18px 40px rgba(0, 0, 0, 0.18);
      }
      .ah__user { position: relative; }
      .ah__userBtn {
        height: 42px; padding: 0 10px 0 8px; border-radius: 14px;
        border: 1px solid rgba(17, 24, 39, 0.12);
        background: rgba(255, 255, 255, 0.78);
        backdrop-filter: blur(14px) saturate(1.35);
        -webkit-backdrop-filter: blur(14px) saturate(1.35);
        display: inline-flex; align-items: center; gap: 8px;
        cursor: pointer;
        box-shadow: 0 14px 36px rgba(0, 0, 0, 0.10);
        transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
        color: rgba(17, 24, 39, 0.84);
      }
      .ah__userBtn:hover { transform: translateY(-1px); border-color: rgba(17, 24, 39, 0.18); box-shadow: 0 18px 46px rgba(0, 0, 0, 0.12); }
      .ah__userBtn:focus-visible { outline: none; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.16), 0 18px 46px rgba(0, 0, 0, 0.12); }
      .ah__avatar {
        width: 28px; height: 28px; border-radius: 999px;
        display: inline-grid; place-items: center;
        font-weight: 850; font-size: 12px;
        color: rgba(255, 255, 255, 0.96);
        background: radial-gradient(circle at 30% 30%, rgba(34, 197, 94, 0.85), rgba(59, 130, 246, 0.78), rgba(168, 85, 247, 0.75));
        box-shadow: 0 10px 26px rgba(0, 0, 0, 0.18);
      }
      .ah__menu {
        position: absolute; right: 0; margin-top: 10px; width: 240px;
        border-radius: 18px; border: 1px solid rgba(17, 24, 39, 0.12);
        background: rgba(255, 255, 255, 0.86);
        backdrop-filter: blur(14px) saturate(1.35);
        -webkit-backdrop-filter: blur(14px) saturate(1.35);
        box-shadow: 0 26px 80px rgba(0, 0, 0, 0.18);
        overflow: hidden; padding: 8px;
      }
      .ah__menuItem {
        display: flex; width: 100%;
        text-decoration: none; align-items: center;
        border-radius: 14px; padding: 10px 12px;
        color: rgba(17, 24, 39, 0.86);
        font-weight: 700; font-size: 13px;
        border: 1px solid rgba(17, 24, 39, 0.00);
        background: transparent;
        cursor: pointer;
        transition: background-color 160ms ease, border-color 160ms ease;
      }
      .ah__menuItem:hover { background: rgba(17, 24, 39, 0.06); border-color: rgba(17, 24, 39, 0.06); }
      .ah__menuItem--danger { color: #dc2626; }
      .ah__menuSep { height: 1px; margin: 6px 6px; background: rgba(17, 24, 39, 0.10); }
      .ah__auth { display: none; gap: 10px; align-items: center; }
      .ah__burger {
        display: inline-grid; place-items: center;
        height: 42px; width: 42px; border-radius: 14px;
        border: 1px solid rgba(17, 24, 39, 0.12);
        background: rgba(255, 255, 255, 0.78);
        backdrop-filter: blur(14px) saturate(1.35);
        -webkit-backdrop-filter: blur(14px) saturate(1.35);
        color: rgba(17, 24, 39, 0.86);
        cursor: pointer;
        box-shadow: 0 14px 36px rgba(0, 0, 0, 0.10);
      }
      .ah__mobile {
        border-top: 1px solid rgba(17, 24, 39, 0.10);
        background: rgba(255, 255, 255, 0.72);
        backdrop-filter: blur(14px) saturate(1.35);
        -webkit-backdrop-filter: blur(14px) saturate(1.35);
      }
      @media (min-width: 768px) { .ah__nav { display: flex; } .ah__auth { display: inline-flex; } .ah__burger { display: none; } }
      @media (min-width: 1024px) { .ah__searchWrap { display: flex; } }
      @media (prefers-reduced-motion: reduce) { .ah__link, .ah__iconBtn, .ah__userBtn, .ah__searchInput { transition: none !important; } }
    `
  ]
})
export class HeaderComponent {
  showUserMenu = signal(false);
  showMobileMenu = signal(false);
  cartItemCount = signal(0);
  private searchInput$ = new Subject<string>();
  private latestQuery = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.searchInput$
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(q => {
        this.latestQuery = q;
        this.router.navigate(['/products'], { queryParams: { q } });
      });
  }

  isAuthenticated = computed(() => this.authService.isAuthenticated());
  currentUser = computed(() => this.authService.currentUser());
  
  userInitials = computed(() => {
    const user = this.currentUser();
    if (!user) return '';
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  });

  isAdmin = computed(() => {
    const user = this.currentUser();
    return user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN;
  });

  isEmployee = computed(() => {
    const user = this.currentUser();
    return user?.role === UserRole.EMPLOYEE || user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN;
  });

  @HostListener('document:click')
  onDocumentClick(): void {
    this.showUserMenu.set(false);
    this.showMobileMenu.set(false);
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    this.showUserMenu.set(false);
    this.showMobileMenu.set(false);
  }

  toggleUserMenu(event?: Event): void {
    event?.stopPropagation();
    this.showUserMenu.update(show => !show);
  }

  toggleMobileMenu(event?: Event): void {
    event?.stopPropagation();
    this.showMobileMenu.update(show => !show);
  }

  logout(): void {
    this.authService.logout();
    this.showUserMenu.set(false);
  }

  onSearchInput(event: any): void {
    const value = (event?.target?.value || '').trim();
    this.searchInput$.next(value);
  }

  onSearchEnter(): void {
    this.router.navigate(['/products'], { queryParams: { q: this.latestQuery } });
  }
}