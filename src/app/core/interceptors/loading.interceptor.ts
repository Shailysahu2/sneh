import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, finalize } from 'rxjs';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private activeRequestsCount$ = new BehaviorSubject<number>(0);
  public isLoading$ = this.activeRequestsCount$.asObservable();

  constructor() {}

  private updateBodyClass(): void {
    const documentRef = inject(DOCUMENT);
    const isActive = this.activeRequestsCount$.value > 0;
    if (isActive) {
      documentRef.body.classList.add('app-loading');
    } else {
      documentRef.body.classList.remove('app-loading');
    }
  }

  start(): void {
    this.activeRequestsCount$.next(this.activeRequestsCount$.value + 1);
    this.updateBodyClass();
  }

  stop(): void {
    const next = Math.max(0, this.activeRequestsCount$.value - 1);
    this.activeRequestsCount$.next(next);
    this.updateBodyClass();
  }
}

export const loadingInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const loadingService = inject(LoadingService);
  loadingService.start();

  return next(req).pipe(
    finalize(() => loadingService.stop())
  );
};


