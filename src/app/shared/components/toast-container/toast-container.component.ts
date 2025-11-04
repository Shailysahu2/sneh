import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-[10000] space-y-3 w-80">
      @for (t of toasts(); track t.id) {
        <div class="rounded-lg shadow-lg p-3 text-white flex items-start gap-3 toast-enter"
             [ngClass]="{
               'bg-green-600': t.type === 'success',
               'bg-red-600': t.type === 'error',
               'bg-blue-600': t.type === 'info',
               'bg-yellow-600': t.type === 'warning'
             }">
          <div class="flex-1">
            @if (t.title) { <div class="font-semibold">{{ t.title }}</div> }
            <div class="text-sm leading-snug">{{ t.message }}</div>
          </div>
          <button class="text-white/80 hover:text-white" (click)="dismiss(t.id)">✕</button>
        </div>
      }
    </div>
  `
})
export class ToastContainerComponent {
  toasts = computed<ToastMessage[]>(() => this.toastService.toasts());

  constructor(private toastService: ToastService) {}

  dismiss(id: string): void {
    this.toastService.dismiss(id);
  }
}


