import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuantityInput, QuantityResponse } from '../models/quantity';

@Injectable({
  providedIn: 'root'
})
export class QuantityService {

  private apiUrl = 'http://localhost:5092/api/v1/quantities';

  constructor(private http: HttpClient) {}

  // ── Compare ───────────────────────────────────────
  compare(input: QuantityInput): Observable<QuantityResponse> {
    return this.http.post<QuantityResponse>(
      `${this.apiUrl}/compare`, input
    );
  }

  // ── Convert ───────────────────────────────────────
  convert(input: QuantityInput): Observable<QuantityResponse> {
    return this.http.post<QuantityResponse>(
      `${this.apiUrl}/convert`, input
    );
  }

  // ── Add ───────────────────────────────────────────
  add(input: QuantityInput): Observable<QuantityResponse> {
    return this.http.post<QuantityResponse>(
      `${this.apiUrl}/add`, input
    );
  }

  // ── Subtract ──────────────────────────────────────
  subtract(input: QuantityInput): Observable<QuantityResponse> {
    return this.http.post<QuantityResponse>(
      `${this.apiUrl}/subtract`, input
    );
  }

  // ── Divide ────────────────────────────────────────
  divide(input: QuantityInput): Observable<QuantityResponse> {
    return this.http.post<QuantityResponse>(
      `${this.apiUrl}/divide`, input
    );
  }
}