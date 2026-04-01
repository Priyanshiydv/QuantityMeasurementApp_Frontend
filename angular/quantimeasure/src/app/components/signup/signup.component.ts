import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { Toast, ToastService } from '../../services/toast.service';
import { NgZone } from '@angular/core';

declare const google: any;

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit{

  username   = '';
  email      = '';
  password   = '';
  showPass   = false;
  loading    = false;
  errorMsg   = '';
  successMsg = '';
  strengthWidth  = '0%';
  strengthColor  = 'transparent';

  constructor(
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService,
    private toastService: ToastService,
    private ngZone: NgZone
  ) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }
  // Add ngOnInit:
  ngOnInit(): void {
    this.initGoogleAuth();
  }

  // Add methods:
  initGoogleAuth(): void {
    const waitForGoogle = setInterval(() => {
      if (typeof google !== 'undefined' && google.accounts) {
        clearInterval(waitForGoogle);
        google.accounts.id.initialize({
          client_id: '1013858391313-89l8lfcc0rtbqmef4b16afiseh0o9gde.apps.googleusercontent.com',
          callback: (response: any) => {
            this.ngZone.run(() => {
              if (response && response.credential) {
                this.handleGoogleLogin(response.credential);
              }
            });
          }
        });
      }
    }, 100);
  }
  
  signInWithGoogle(): void {
    try {
      const client = google.accounts.oauth2.initTokenClient({
        client_id: '1013858391313-89l8lfcc0rtbqmef4b16afiseh0o9gde.apps.googleusercontent.com',
        scope: 'openid email profile',
        callback: (tokenResponse: any) => {
          this.ngZone.run(() => {
            if (tokenResponse && tokenResponse.access_token) {
              this.exchangeTokenForIdToken(
                tokenResponse.access_token
              );
            } else {
              this.toastService.error('Google sign in failed.');
            }
          });
        }
      });
      client.requestAccessToken();
    } catch (err: any) {
      console.error('Google error:', err);
      this.toastService.error('Google sign in failed.');
    }
  }

  // ── Exchange Access Token for User Info ───────────
  exchangeTokenForIdToken(accessToken: string): void {
    this.loading = true;

    fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    .then(res => res.json())
    .then(userInfo => {
      console.log('Google user info:', userInfo);
      // Now call backend with access token
      this.handleGoogleLogin(accessToken);
    })
    .catch(() => {
      this.toastService.error('Failed to get Google user info.');
      this.loading = false;
    });
  }

  // ── Toggle Password ──────────────────────────────
  togglePassword(): void {
    this.showPass = !this.showPass;
  }

  // ── Password Strength ────────────────────────────
  checkStrength(): void {
    const v = this.password;
    let strength = 0;

    if (v.length >= 6)          strength++;
    if (v.length >= 10)         strength++;
    if (/[A-Z]/.test(v))        strength++;
    if (/[0-9]/.test(v))        strength++;
    if (/[^A-Za-z0-9]/.test(v)) strength++;

    const colors = [
      'transparent', '#f78166', '#f0a500',
      '#f0a500', '#34d399', '#34d399'
    ];
    const widths = ['0%', '20%', '40%', '60%', '80%', '100%'];

    this.strengthWidth = widths[strength];
    this.strengthColor = colors[strength];
  }

  // ── Signup ────────────────────────────────────────
  onSignup(): void {

    if (!this.username || !this.email || !this.password) {
      this.toastService.error ('Please fill in all fields.');
      return;
    }

    if (this.password.length < 6) {
      this.toastService.error('Password must be at least 6 characters.');
      return;
    }

    this.loading = true;

    this.authService.register(
      this.username, this.email, this.password
    ).subscribe({
      next: (response) => {
        this.toastService.success(`Welcome, ${response.username}! Account created.`);
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1000);
      },
      error: (err) => {
        this.toastService.error(err.error?.message || 'Registration failed. Please try again.');
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  // Add method:
  handleGoogleLogin(idToken: string): void {
    this.loading = true;
    this.authService.googleLogin(idToken).subscribe({
      next: (response) => {
        this.toastService.success(
          `Welcome, ${response.username}!`
        );
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1000);
      },
      error: () => {
        this.toastService.error(
          'Google login failed. Please try again.'
        );
        this.loading = false;
      },
      complete: () => { this.loading = false; }
    });
  }
  toggleTheme(): void { this.themeService.toggle(); }
  getThemeIcon(): string { return this.themeService.getIcon(); }
}