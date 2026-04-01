import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { User } from '../../models/user';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  username   = '';
  userAvatar = '';
  profile: User | null = null;
  loading    = true;
  joinedDate = new Date().toLocaleDateString();

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.username   = this.authService.getUsername();
    this.userAvatar = this.username.charAt(0).toUpperCase();
    this.loadProfile();
  }

  // ── Load Profile from Backend ─────────────────────
  loadProfile(): void {
    this.profileService.getProfile().subscribe({
      next: (data) => {
        this.profile  = data;
        this.loading  = false;
      },
      error: () => {
        // Fallback to localStorage if token expired
        this.profile = {
          id:       0,
          username: this.authService.getUsername(),
          email:    '—',
          role:     localStorage.getItem('role') || 'User'
        };
        this.loading = false;
      }
    });
  }

  // ── Get Avatar Letter ─────────────────────────────
  getAvatar(): string {
    return (this.profile?.username || this.username)
      .charAt(0).toUpperCase();
  }

  // ── Sign Out ──────────────────────────────────────
  signOut(): void {
    this.authService.signOut();
  }

  toggleTheme(): void { this.themeService.toggle(); }
  getThemeIcon(): string { return this.themeService.getIcon(); }
  getThemeLabel(): string { return this.themeService.getLabel(); }
}