import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthResponse } from '../models/auth-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:5092/api/v1/users';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  // ── Register ──────────────────────────────────────
  register(username: string, email: string, password: string)
    : Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/register`,
      { username, email, password }
    ).pipe(
      tap(response => this.saveAuth(response))
    );
  }

  // ── Login ─────────────────────────────────────────
  login(username: string, password: string)
    : Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/login`,
      { username, password }
    ).pipe(
      tap(response => this.saveAuth(response))
    );
  }

  // ── Get Profile ───────────────────────────────────
  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`);
  }

  // ── Save Auth to LocalStorage ─────────────────────
  private saveAuth(response: AuthResponse): void {
    localStorage.setItem('accessToken',  response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    localStorage.setItem('username',     response.username);
    localStorage.setItem('role',         response.role);
  }

  // ── Sign Out ──────────────────────────────────────
  signOut(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  // ── Is Logged In ──────────────────────────────────
  isLoggedIn(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  // ── Get Username ──────────────────────────────────
  getUsername(): string {
    return localStorage.getItem('username') || 'User';
  }
  // ── Google Login ──────────────────────────────────
  googleLogin(idToken: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/google-login`,
      { idToken }
    ).pipe(
      tap(response => this.saveAuth(response))
    );
  }
}