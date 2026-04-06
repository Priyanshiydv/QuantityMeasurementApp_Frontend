import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent implements OnInit {

  toasts: Toast[] = [];

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.toastService.toasts$.subscribe(toasts => {
      this.toasts = toasts;
    });
  }

  dismiss(id: number): void {
    this.toastService.dismiss(id);
  }

  getIcon(type: string): string {
    const icons: { [key: string]: string } = {
      success: '✅',
      error:   '❌',
      info:    'ℹ️',
      warning: '⚠️'
    };
    return icons[type] || '✅';
  }
}