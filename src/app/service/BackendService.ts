import { Inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BackendService {
  private apiUrl = 'https://localhost:5001/Spending';

  constructor(private http: HttpClient) { }

  fetchSpendings(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getSpendingsByMonth(month: number): Observable<any[]> {
    return this.http.post<any>(`${this.apiUrl}/byMonth`, { month });
  }
}
