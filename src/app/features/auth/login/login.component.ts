import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="auth">
      <div class="auth__grid">
        <section class="auth__side" aria-hidden="true">
          <img
            class="auth__sideImg"
            src="https://images.unsplash.com/photo-1743742566156-f1745850281a?auto=format&fit=crop&w=1600&q=80"
            alt=""
            loading="eager"
            fetchpriority="high"
          />
          <div class="auth__sideScrim"></div>
          <div class="auth__sideContent">
            <div class="auth__kicker">Support • Pumps • Service</div>
            <div class="auth__sideTitle">Welcome back.</div>
            <div class="auth__sideText">
              Sign in to track orders, manage your profile, and get help instantly through Support Bot.
            </div>
          </div>
        </section>

        <main class="auth__main">
          <div class="auth__card card">
            <div class="auth__head">
              <div class="auth__mark" aria-hidden="true">
                <span class="auth__markDot"></span>
              </div>
              <h1 class="auth__title">Sign in</h1>
              <p class="auth__sub">
                New here?
                <a routerLink="/auth/register" class="auth__link">Create an account</a>
              </p>
            </div>

            <form class="auth__form" [formGroup]="loginForm" (ngSubmit)="onSubmit()">
              @if (errorMessage()) {
                <div class="auth__error" role="alert">
                  {{ errorMessage() }}
                </div>
              }

              <div class="auth__fields">
                <div>
                  <label for="email" class="auth__label">Email address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    formControlName="email"
                    class="form-input auth__input"
                    placeholder="name@example.com"
                    autocomplete="email"
                  />
                  @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
                    <p class="auth__fieldError">Please enter a valid email address</p>
                  }
                </div>

                <div>
                  <label for="password" class="auth__label">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    formControlName="password"
                    class="form-input auth__input"
                    placeholder="Your password"
                    autocomplete="current-password"
                  />
                  @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
                    <p class="auth__fieldError">Password is required</p>
                  }
                </div>
              </div>

              <div class="auth__row">
                <label class="auth__check">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    formControlName="rememberMe"
                  />
                  <span>Remember me</span>
                </label>

                <a class="auth__mutedLink" routerLink="/support">Need help?</a>
              </div>

              <button type="submit" [disabled]="loginForm.invalid || isLoading()" class="btn-primary auth__submit">
                @if (isLoading()) {
                  <span class="auth__submitInner">
                    <span class="spinner auth__spinner"></span>
                    Signing in…
                  </span>
                } @else {
                  Sign in
                }
              </button>

              <div class="auth__footer">
                <a routerLink="/" class="btn-secondary auth__secondary">Back to Home</a>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [
    `
      .auth {
        min-height: 100vh;
        padding: 22px;
        display: grid;
        place-items: center;
      }

      .auth__grid {
        width: min(1080px, 100%);
        display: grid;
        grid-template-columns: 1fr;
        gap: 18px;
        align-items: stretch;
      }

      .auth__side {
        display: none;
        position: relative;
        border-radius: 22px;
        overflow: hidden;
        border: 1px solid rgba(17, 24, 39, 0.12);
        box-shadow: 0 26px 80px rgba(0, 0, 0, 0.14);
        min-height: 520px;
      }

      .auth__sideImg {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        filter: saturate(1.05) contrast(1.05);
        transform: scale(1.02);
      }

      .auth__sideScrim {
        position: absolute;
        inset: 0;
        background:
          radial-gradient(900px 520px at 20% 10%, rgba(59, 130, 246, 0.35), rgba(255, 255, 255, 0) 55%),
          radial-gradient(900px 540px at 90% 12%, rgba(168, 85, 247, 0.30), rgba(255, 255, 255, 0) 58%),
          radial-gradient(1100px 680px at 50% 120%, rgba(34, 197, 94, 0.22), rgba(255, 255, 255, 0) 60%),
          linear-gradient(180deg, rgba(17, 24, 39, 0.46), rgba(17, 24, 39, 0.86));
      }

      .auth__sideContent {
        position: absolute;
        inset: auto 22px 22px 22px;
        color: rgba(255, 255, 255, 0.92);
      }

      .auth__kicker {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        height: 30px;
        padding: 0 12px;
        border-radius: 999px;
        border: 1px solid rgba(255, 255, 255, 0.18);
        background: rgba(255, 255, 255, 0.08);
        backdrop-filter: blur(14px) saturate(1.35);
        -webkit-backdrop-filter: blur(14px) saturate(1.35);
        font-weight: 800;
        font-size: 12px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .auth__sideTitle {
        margin-top: 12px;
        font-weight: 900;
        letter-spacing: -0.04em;
        font-size: 40px;
        line-height: 1.05;
      }

      .auth__sideText {
        margin-top: 10px;
        color: rgba(255, 255, 255, 0.82);
        max-width: 46ch;
      }

      .auth__main {
        display: grid;
        align-items: center;
      }

      .auth__card {
        padding: 22px;
      }

      .auth__head {
        text-align: left;
      }

      .auth__mark {
        height: 44px;
        width: 44px;
        border-radius: 16px;
        border: 1px solid rgba(17, 24, 39, 0.12);
        background: rgba(255, 255, 255, 0.78);
        backdrop-filter: blur(14px) saturate(1.35);
        -webkit-backdrop-filter: blur(14px) saturate(1.35);
        display: grid;
        place-items: center;
        box-shadow: 0 18px 55px rgba(0, 0, 0, 0.12);
      }

      .auth__markDot {
        height: 12px;
        width: 12px;
        border-radius: 999px;
        background: radial-gradient(circle at 30% 30%, rgba(34, 197, 94, 0.95), rgba(59, 130, 246, 0.9), rgba(168, 85, 247, 0.88));
        box-shadow: 0 14px 40px rgba(0, 0, 0, 0.22);
      }

      .auth__title {
        margin-top: 14px;
        font-size: 30px;
        letter-spacing: -0.03em;
        font-weight: 900;
        color: rgba(17, 24, 39, 0.92);
      }

      .auth__sub {
        margin-top: 6px;
        color: rgba(17, 24, 39, 0.62);
      }

      .auth__link {
        margin-left: 6px;
        color: rgba(17, 24, 39, 0.92);
        font-weight: 800;
        text-decoration: none;
        border-bottom: 1px solid rgba(17, 24, 39, 0.16);
      }

      .auth__form {
        margin-top: 16px;
      }

      .auth__error {
        border-radius: 14px;
        border: 1px solid rgba(220, 38, 38, 0.18);
        background: rgba(220, 38, 38, 0.08);
        color: rgba(185, 28, 28, 0.92);
        padding: 12px 12px;
        font-weight: 650;
      }

      .auth__fields {
        margin-top: 14px;
        display: grid;
        gap: 12px;
      }

      .auth__label {
        display: block;
        font-size: 13px;
        font-weight: 800;
        color: rgba(17, 24, 39, 0.72);
        letter-spacing: -0.01em;
      }

      .auth__input {
        margin-top: 8px;
      }

      .auth__fieldError {
        margin-top: 8px;
        color: rgba(185, 28, 28, 0.92);
        font-size: 12px;
        font-weight: 650;
      }

      .auth__row {
        margin-top: 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
      }

      .auth__check {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        color: rgba(17, 24, 39, 0.84);
        font-weight: 650;
        font-size: 13px;
        user-select: none;
      }

      .auth__check input {
        width: 16px;
        height: 16px;
        accent-color: #111827;
      }

      .auth__mutedLink {
        color: rgba(17, 24, 39, 0.62);
        font-weight: 750;
        font-size: 13px;
        text-decoration: none;
        border-bottom: 1px solid rgba(17, 24, 39, 0.14);
      }

      .auth__submit {
        margin-top: 14px;
        width: 100%;
        height: 46px;
        border-radius: 14px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      .auth__submitInner {
        display: inline-flex;
        align-items: center;
        gap: 10px;
      }

      .auth__spinner {
        width: 18px;
        height: 18px;
        border-width: 3px;
      }

      .auth__footer {
        margin-top: 12px;
        display: flex;
        justify-content: center;
      }

      .auth__secondary {
        width: 100%;
        height: 44px;
        border-radius: 14px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      @media (min-width: 1024px) {
        .auth__grid {
          grid-template-columns: 1.1fr 0.9fr;
          gap: 18px;
        }
        .auth__side {
          display: block;
        }
        .auth__card {
          padding: 26px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .auth__sideImg {
          transform: none !important;
        }
      }
    `
  ]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal('');

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.isLoading.set(false);
          
          // Redirect based on user role
          const user = response.user;
          if (user.role === 'admin' || user.role === 'super_admin') {
            this.router.navigate(['/admin']);
          } else if (user.role === 'employee') {
            this.router.navigate(['/employee']);
          } else {
            this.router.navigate(['/']);
          }
        },
        error: (error) => {
          this.isLoading.set(false);
          console.error('Login error:', error);
          this.errorMessage.set(error.error?.error || error.message || 'Login failed. Please try again.');
        }
      });
    }
  }
}