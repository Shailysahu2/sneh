import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-10">
      <div class="mb-8 text-center">
        <div class="text-xs font-extrabold tracking-widest uppercase" style="color: rgba(17,24,39,.60);">
          Employee
        </div>
        <h1 class="text-3xl md:text-4xl font-extrabold mt-2" style="letter-spacing: -0.03em; color: rgba(17,24,39,.92);">
          Dashboard
        </h1>
        <p class="mt-2 max-w-2xl mx-auto" style="color: rgba(17,24,39,.62);">
          Quick access to daily tasks, customer support, and order help.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section class="card p-6 lg:col-span-2">
          <div class="flex items-start justify-between gap-4">
            <div>
              <div class="text-xs font-extrabold tracking-widest uppercase" style="color: rgba(17,24,39,.60);">
                Today
              </div>
              <h2 class="text-xl font-extrabold mt-2" style="letter-spacing: -0.02em; color: rgba(17,24,39,.92);">
                Stay on top of customer needs.
              </h2>
              <p class="mt-2" style="color: rgba(17,24,39,.62);">
                Use Support for directions/contact, and Products to help customers choose the right pump.
              </p>
            </div>
            <span class="pill pill--active" style="height: 32px; padding: 0 12px;">Active</span>
          </div>

          <div class="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <a routerLink="/products" class="pill" style="height: 42px;">Browse products</a>
            <a routerLink="/support" class="pill" style="height: 42px;">Open support</a>
            <a routerLink="/cart" class="pill" style="height: 42px;">View cart</a>
          </div>

          <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="card p-5" style="background: rgba(255,255,255,.60);">
              <div class="text-xs font-extrabold tracking-widest uppercase" style="color: rgba(17,24,39,.60);">Tickets</div>
              <div class="mt-2 text-2xl font-extrabold" style="color: rgba(17,24,39,.92);">—</div>
              <div class="mt-1 text-sm" style="color: rgba(17,24,39,.62);">Coming soon</div>
            </div>
            <div class="card p-5" style="background: rgba(255,255,255,.60);">
              <div class="text-xs font-extrabold tracking-widest uppercase" style="color: rgba(17,24,39,.60);">Orders</div>
              <div class="mt-2 text-2xl font-extrabold" style="color: rgba(17,24,39,.92);">—</div>
              <div class="mt-1 text-sm" style="color: rgba(17,24,39,.62);">Coming soon</div>
            </div>
            <div class="card p-5" style="background: rgba(255,255,255,.60);">
              <div class="text-xs font-extrabold tracking-widest uppercase" style="color: rgba(17,24,39,.60);">Inventory</div>
              <div class="mt-2 text-2xl font-extrabold" style="color: rgba(17,24,39,.92);">—</div>
              <div class="mt-1 text-sm" style="color: rgba(17,24,39,.62);">Coming soon</div>
            </div>
          </div>
        </section>

        <aside class="card p-6">
          <div class="text-xs font-extrabold tracking-widest uppercase" style="color: rgba(17,24,39,.60);">
            Shortcuts
          </div>
          <h3 class="text-lg font-extrabold mt-2" style="letter-spacing:-0.02em; color: rgba(17,24,39,.92);">
            Fast actions
          </h3>
          <p class="mt-2" style="color: rgba(17,24,39,.62);">
            Use the chatbot in the header for quick answers and ticket creation.
          </p>

          <div class="mt-5 grid gap-3">
            <a routerLink="/" class="btn-secondary text-center" style="border-radius: 14px;">Home</a>
            <a routerLink="/profile" class="btn-secondary text-center" style="border-radius: 14px;">Profile</a>
            <a routerLink="/support" class="btn-primary text-center" style="border-radius: 14px;">Support</a>
          </div>
        </aside>
      </div>
    </div>
  `
})
export class EmployeeDashboardComponent {}