import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private isDark = true;

  constructor() {
    // Load saved theme from localStorage
    const saved = localStorage.getItem('theme');
    this.isDark  = saved ? saved === 'dark' : true;
    this.applyTheme();
  }

  // ── Toggle Theme ──────────────────────────────────
  toggle(): void {
    this.isDark = !this.isDark;
    localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
    this.applyTheme();
  }

  // ── Apply Theme to DOM ────────────────────────────
  private applyTheme(): void {
    const root = document.documentElement;
    if (this.isDark) {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', 'light');
    }
  }

  // ── Get Current State ─────────────────────────────
  isDarkMode(): boolean {
    return this.isDark;
  }

  getIcon(): string {
    return this.isDark ? '🌙' : '☀️';
  }

  getLabel(): string {
    return this.isDark ? 'Dark Mode' : 'Light Mode';
  }
}