import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HistoryItem } from '../models/quantity';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  private apiUrl = 'https://quantitymeasurementapp-ly1a.onrender.com/api/v1/quantities';

  constructor(private http: HttpClient) {}

  // ── Get All History ───────────────────────────────
  getAllHistory(): Observable<HistoryItem[]> {
    return this.http.get<HistoryItem[]>(
      `${this.apiUrl}/history`
    );
  }

  // ── Get My History ────────────────────────────────
  getMyHistory(): Observable<HistoryItem[]> {
    return this.http.get<HistoryItem[]>(
      `${this.apiUrl}/history/my`
    );
  }

  // ── Get History By Operation ──────────────────────
  getByOperation(operation: string): Observable<HistoryItem[]> {
    return this.http.get<HistoryItem[]>(
      `${this.apiUrl}/history/my/operation/${operation}`
    );
  }

  // ── Get History By Measurement ────────────────────
  getByMeasurement(type: string): Observable<HistoryItem[]> {
    return this.http.get<HistoryItem[]>(
      `${this.apiUrl}/history/my/measurement/${type}`
    );
  }

  // ── Get Total Count ───────────────────────────────
  getTotalCount(): Observable<any> {
    return this.http.get(`${this.apiUrl}/count`);
  }

  // ── Get Count By Operation ────────────────────────
  getCountByOperation(operation: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/count/${operation}`
    );
  }
  // ── Get Stats ─────────────────────────────────────
  getMyStats(): Observable<HistoryItem[]> {
    return this.http.get<HistoryItem[]>(
      `${this.apiUrl}/history/my`
    );
  }

}