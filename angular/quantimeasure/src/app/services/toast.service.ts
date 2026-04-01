import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id:      number;
  message: string;
  type:    'success' | 'error' | 'info' | 'warning';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private toasts: Toast[] = [];
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toastsSubject.asObservable();
  private counter = 0;

  // ── Show Toast ────────────────────────────────────
  show(message: string, type: Toast['type'] = 'success'): void {
    const toast: Toast = {
      id:      ++this.counter,
      message,
      type
    };

    this.toasts = [...this.toasts, toast];
    this.toastsSubject.next(this.toasts);

    // Auto dismiss after 3 seconds
    setTimeout(() => this.dismiss(toast.id), 3000);
  }

  // ── Shorthand Methods ─────────────────────────────
  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error');
  }

  info(message: string): void {
    this.show(message, 'info');
  }

  warning(message: string): void {
    this.show(message, 'warning');
  }

  // ── Dismiss ───────────────────────────────────────
  dismiss(id: number): void {
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.toastsSubject.next(this.toasts);
  }
}