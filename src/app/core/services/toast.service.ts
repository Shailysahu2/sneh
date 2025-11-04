import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  timeoutMs?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<ToastMessage[]>([]);

  show(type: ToastType, message: string, title?: string, timeoutMs = 3500): void {
    const id = this.generateSecureId();
    const toast: ToastMessage = { id, type, title, message, timeoutMs };
    this.toasts.update(list => [toast, ...list]);
    if (timeoutMs && timeoutMs > 0) {
      setTimeout(() => this.dismiss(id), timeoutMs);
    }
  }

  success(message: string, title?: string, timeoutMs?: number): void {
    this.show('success', message, title, timeoutMs);
  }

  error(message: string, title?: string, timeoutMs?: number): void {
    this.show('error', message, title, timeoutMs);
  }

  info(message: string, title?: string, timeoutMs?: number): void {
    this.show('info', message, title, timeoutMs);
  }

  warning(message: string, title?: string, timeoutMs?: number): void {
    this.show('warning', message, title, timeoutMs);
  }

  dismiss(id: string): void {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }

  private generateSecureId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      // @ts-ignore
      return crypto.randomUUID();
    }
    if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
      const arr = new Uint8Array(16);
      // @ts-ignore
      crypto.getRandomValues(arr);
      return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
    }
    return `${Date.now()}-${Math.floor(Math.random()*1e9)}`;
  }
}


