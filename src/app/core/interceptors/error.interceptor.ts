import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.logout();
        router.navigate(['/auth/login']);
        toast.error('Your session expired. Please log in again.', 'Unauthorized');
      } else if (error.status === 0) {
        toast.error('Network error. Check your internet connection.');
      } else if (error.status >= 500) {
        toast.error('Server error. Please try again later.');
      } else {
        const msg = (error.error && (error.error.message || error.error.error)) || error.message || 'An error occurred';
        toast.error(msg);
      }

      return throwError(() => error);
    })
  );
};