import { Component, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { ToastService } from '../../services/toast.service';

declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  username    = '';
  password    = '';
  showPass    = false;
  loading     = false;
  errorMsg    = '';
  successMsg  = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService,
    private toastService: ToastService,
    private ngZone: NgZone
  ) {
    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }
  ngOnInit(): void {
    this.initGoogleAuth();
  }
  // ── Initialize Google Auth ────────────────────────
  initGoogleAuth(): void {
    const waitForGoogle = setInterval(() => {
      if (typeof google !== 'undefined' && google.accounts) {
        clearInterval(waitForGoogle);
        google.accounts.id.initialize({
          client_id: '1013858391313-89l8lfcc0rtbqmef4b16afiseh0o9gde.apps.googleusercontent.com',
          callback: (response: any) => {
            this.ngZone.run(() => {
              this.handleGoogleCallback(response);
            });
          }
        });
      }
    }, 100);
  }
   // ── Handle Google Callback ────────────────────────
  handleGoogleCallback(response: any): void {
    if (response && response.credential) {
      this.handleGoogleLogin(response.credential);
    } else {
      this.toastService.error('Google sign in failed.');
    }
  }
  //SignIn with google
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



  // ── Handle Google Login ───────────────────────────
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
      complete: () => {
        this.loading = false;
      }
    });
  }

  // ── Toggle Password ──────────────────────────────
  togglePassword(): void {
    this.showPass = !this.showPass;
  }

  // ── Login ─────────────────────────────────────────
  onLogin(): void {

    if (!this.username || !this.password) {
      this.toastService.error('Please fill in all fields.');
      return;
    }

    this.loading = true;

    this.authService.login(this.username, this.password)
      .subscribe({
        next: (response) => {
          this.toastService.success( `Welcome back, ${response.username}!`);
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1000);
        },
        error: (err) => {
          this.toastService.error (err.error?.message || 'Invalid username or password.'
          );
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
  }
    toggleTheme(): void { this.themeService.toggle(); }
    getThemeIcon(): string { return this.themeService.getIcon(); }
}