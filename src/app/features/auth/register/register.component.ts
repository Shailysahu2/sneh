import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="auth">
      <div class="auth__grid">
        <section class="auth__side" aria-hidden="true">
          <img
            class="auth__sideImg"
            src="https://images.unsplash.com/photo-1698031610511-c7a35d121b17?auto=format&fit=crop&w=1600&q=80"
            alt=""
            loading="eager"
            fetchpriority="high"
          />
          <div class="auth__sideScrim"></div>
          <div class="auth__sideContent">
            <div class="auth__kicker">Create account</div>
            <div class="auth__sideTitle">Get started.</div>
            <div class="auth__sideText">
              Save your details, track orders, and get faster support when you need it.
            </div>
          </div>
        </section>

        <main class="auth__main">
          <div class="auth__card card">
            <div class="auth__head">
              <div class="auth__mark" aria-hidden="true">
                <span class="auth__markDot"></span>
              </div>
              <h1 class="auth__title">Sign up</h1>
              <p class="auth__sub">
                Already have an account?
                <a routerLink="/auth/login" class="auth__link">Sign in</a>
              </p>
            </div>

            <form class="auth__form" [formGroup]="registerForm" (ngSubmit)="onSubmit()">
              @if (errorMessage()) {
                <div class="auth__error" role="alert">
                  {{ errorMessage() }}
                  @if (showLoginSuggestion()) {
                    <span style="margin-left: 6px;">
                      <a routerLink="/auth/login" class="auth__link">Sign in</a>
                    </span>
                  }
                </div>
              }

              <div class="auth__fields">
                <div class="auth__grid2">
                  <div>
                    <label for="firstName" class="auth__label">First name</label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      formControlName="firstName"
                      class="form-input auth__input"
                      placeholder="First name"
                      autocomplete="given-name"
                    />
                    @if (registerForm.get('firstName')?.invalid && registerForm.get('firstName')?.touched) {
                      <p class="auth__fieldError">First name is required</p>
                    }
                  </div>

                  <div>
                    <label for="lastName" class="auth__label">Last name</label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      formControlName="lastName"
                      class="form-input auth__input"
                      placeholder="Last name"
                      autocomplete="family-name"
                    />
                    @if (registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched) {
                      <p class="auth__fieldError">Last name is required</p>
                    }
                  </div>
                </div>

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
                  @if (registerForm.get('email')?.invalid && registerForm.get('email')?.touched) {
                    <p class="auth__fieldError">Please enter a valid email address</p>
                  }
                </div>

                <div>
                  <label for="phone" class="auth__label">Phone (optional)</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    formControlName="phone"
                    class="form-input auth__input"
                    placeholder="Phone number"
                    autocomplete="tel"
                  />
                </div>

                <div>
                  <label for="password" class="auth__label">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    formControlName="password"
                    class="form-input auth__input"
                    placeholder="Create a password"
                    autocomplete="new-password"
                  />
                  @if (registerForm.get('password')?.invalid && registerForm.get('password')?.touched) {
                    <p class="auth__fieldError">Password must be at least 6 characters</p>
                  }
                </div>

                <div>
                  <label for="confirmPassword" class="auth__label">Confirm password</label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    formControlName="confirmPassword"
                    class="form-input auth__input"
                    placeholder="Confirm password"
                    autocomplete="new-password"
                  />
                  @if (registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched) {
                    <p class="auth__fieldError">Passwords do not match</p>
                  }
                </div>
              </div>

              <div class="auth__terms">
                <label class="auth__check">
                  <input id="terms" name="terms" type="checkbox" formControlName="terms" />
                  <span>
                    I agree to the
                    <a href="#" class="auth__mutedLink">Terms</a>
                    and
                    <a href="#" class="auth__mutedLink">Privacy</a>
                  </span>
                </label>
                @if (registerForm.get('terms')?.invalid && registerForm.get('terms')?.touched) {
                  <p class="auth__fieldError">You must agree to the terms and conditions</p>
                }
              </div>

              <button type="submit" [disabled]="registerForm.invalid || isLoading()" class="btn-primary auth__submit">
                @if (isLoading()) {
                  <span class="auth__submitInner">
                    <span class="spinner auth__spinner"></span>
                    Creating account…
                  </span>
                } @else {
                  Create account
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
      .auth { min-height: 100vh; padding: 22px; display: grid; place-items: center; }
      .auth__grid { width: min(1080px, 100%); display: grid; grid-template-columns: 1fr; gap: 18px; align-items: stretch; }
      .auth__side {
        display: none; position: relative; border-radius: 22px; overflow: hidden;
        border: 1px solid rgba(17, 24, 39, 0.12); box-shadow: 0 26px 80px rgba(0, 0, 0, 0.14);
        min-height: 640px;
      }
      .auth__sideImg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; filter: saturate(1.05) contrast(1.05); transform: scale(1.02); }
      .auth__sideScrim {
        position: absolute; inset: 0;
        background:
          radial-gradient(900px 520px at 20% 10%, rgba(59, 130, 246, 0.35), rgba(255, 255, 255, 0) 55%),
          radial-gradient(900px 540px at 90% 12%, rgba(168, 85, 247, 0.30), rgba(255, 255, 255, 0) 58%),
          radial-gradient(1100px 680px at 50% 120%, rgba(34, 197, 94, 0.22), rgba(255, 255, 255, 0) 60%),
          linear-gradient(180deg, rgba(17, 24, 39, 0.46), rgba(17, 24, 39, 0.86));
      }
      .auth__sideContent { position: absolute; inset: auto 22px 22px 22px; color: rgba(255, 255, 255, 0.92); }
      .auth__kicker {
        display: inline-flex; align-items: center; justify-content: center; height: 30px; padding: 0 12px;
        border-radius: 999px; border: 1px solid rgba(255, 255, 255, 0.18); background: rgba(255, 255, 255, 0.08);
        backdrop-filter: blur(14px) saturate(1.35); -webkit-backdrop-filter: blur(14px) saturate(1.35);
        font-weight: 800; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase;
      }
      .auth__sideTitle { margin-top: 12px; font-weight: 900; letter-spacing: -0.04em; font-size: 40px; line-height: 1.05; }
      .auth__sideText { margin-top: 10px; color: rgba(255, 255, 255, 0.82); max-width: 46ch; }
      .auth__main { display: grid; align-items: center; }
      .auth__card { padding: 22px; }
      .auth__head { text-align: left; }
      .auth__mark {
        height: 44px; width: 44px; border-radius: 16px; border: 1px solid rgba(17, 24, 39, 0.12);
        background: rgba(255, 255, 255, 0.78);
        backdrop-filter: blur(14px) saturate(1.35); -webkit-backdrop-filter: blur(14px) saturate(1.35);
        display: grid; place-items: center; box-shadow: 0 18px 55px rgba(0, 0, 0, 0.12);
      }
      .auth__markDot {
        height: 12px; width: 12px; border-radius: 999px;
        background: radial-gradient(circle at 30% 30%, rgba(34, 197, 94, 0.95), rgba(59, 130, 246, 0.9), rgba(168, 85, 247, 0.88));
        box-shadow: 0 14px 40px rgba(0, 0, 0, 0.22);
      }
      .auth__title { margin-top: 14px; font-size: 30px; letter-spacing: -0.03em; font-weight: 900; color: rgba(17, 24, 39, 0.92); }
      .auth__sub { margin-top: 6px; color: rgba(17, 24, 39, 0.62); }
      .auth__link {
        margin-left: 6px;
        color: rgba(17, 24, 39, 0.92);
        font-weight: 800;
        text-decoration: none;
        border-bottom: 1px solid rgba(17, 24, 39, 0.16);
      }
      .auth__form { margin-top: 16px; }
      .auth__error {
        border-radius: 14px; border: 1px solid rgba(220, 38, 38, 0.18);
        background: rgba(220, 38, 38, 0.08); color: rgba(185, 28, 28, 0.92);
        padding: 12px 12px; font-weight: 650;
      }
      .auth__fields { margin-top: 14px; display: grid; gap: 12px; }
      .auth__grid2 { display: grid; grid-template-columns: 1fr; gap: 12px; }
      .auth__label { display: block; font-size: 13px; font-weight: 800; color: rgba(17, 24, 39, 0.72); letter-spacing: -0.01em; }
      .auth__input { margin-top: 8px; }
      .auth__fieldError { margin-top: 8px; color: rgba(185, 28, 28, 0.92); font-size: 12px; font-weight: 650; }
      .auth__terms { margin-top: 12px; }
      .auth__check { display: inline-flex; align-items: flex-start; gap: 10px; color: rgba(17, 24, 39, 0.84); font-weight: 650; font-size: 13px; user-select: none; }
      .auth__check input { width: 16px; height: 16px; margin-top: 3px; accent-color: #111827; }
      .auth__mutedLink {
        color: rgba(17, 24, 39, 0.62);
        font-weight: 800;
        text-decoration: none;
        border-bottom: 1px solid rgba(17, 24, 39, 0.14);
      }
      .auth__submit { margin-top: 14px; width: 100%; height: 46px; border-radius: 14px; display: inline-flex; align-items: center; justify-content: center; }
      .auth__submitInner { display: inline-flex; align-items: center; gap: 10px; }
      .auth__spinner { width: 18px; height: 18px; border-width: 3px; }
      .auth__footer { margin-top: 12px; display: flex; justify-content: center; }
      .auth__secondary { width: 100%; height: 44px; border-radius: 14px; display: inline-flex; align-items: center; justify-content: center; }
      @media (min-width: 640px) { .auth__grid2 { grid-template-columns: 1fr 1fr; } }
      @media (min-width: 1024px) {
        .auth__grid { grid-template-columns: 1.1fr 0.9fr; gap: 18px; }
        .auth__side { display: block; }
        .auth__card { padding: 26px; }
      }
      @media (prefers-reduced-motion: reduce) { .auth__sideImg { transform: none !important; } }
    `
  ]
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal('');
  showLoginSuggestion = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }
    
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');

      const { confirmPassword, terms, ...userData } = this.registerForm.value;

      this.authService.register(userData).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.isLoading.set(false);
          
          if (error.message === 'User already exists') {
            this.errorMessage.set('An account with this email already exists.');
            this.showLoginSuggestion.set(true);
            // Clear the email field
            this.registerForm.get('email')?.setValue('');
            this.registerForm.get('email')?.markAsTouched();
          } else {
            this.errorMessage.set(
              error.message || 
              error.error?.message || 
              'Registration failed. Please try again.'
            );
            this.showLoginSuggestion.set(false);
          }
        }
      });
    } else {
      this.errorMessage.set('Please fix the highlighted errors and try again.');
    }
  }
}