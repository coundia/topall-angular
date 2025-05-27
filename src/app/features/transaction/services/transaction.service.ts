import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Transaction } from '../models/transaction.model';
import { AuthService } from '../../../shared/security/services/auth.service';
import { API_BASE } from '../../../shared/constantes/shared-imports';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly base = `${API_BASE}/v1`;

  readonly transactions = signal<Transaction[]>([]);
  readonly totalPages = signal(0);
  readonly totalElements = signal(0);

  private headers(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.auth.token()}`,
      'Content-Type': 'application/json',
    });
  }

  fetch(page = 0, limit = 10): Observable<{ content: Transaction[]; totalPages: number; totalElements: number }> {
    return this.http
      .get<{ content: Transaction[]; totalPages: number; totalElements: number }>(
        `${this.base}/queries/transactions?page=${page}&limit=${limit}`,
        { headers: this.headers() }
      )
      .pipe(
        tap(res => {
          this.transactions.set(res.content);
          this.totalPages.set(res.totalPages ?? 0);
          this.totalElements.set(res.totalElements ?? 0);
        })
      );
  }

  create(dto: Partial<Transaction>): Observable<any> {
    return this.http.post(`${this.base}/commands/transaction`, dto, {
      headers: this.headers(),
    });
  }

  update(id: string, dto: Partial<Transaction>): Observable<any> {
    return this.http.put(`${this.base}/commands/transaction/${id}`, dto, {
      headers: this.headers(),
    });
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.base}/commands/transaction/${id}`, {
      headers: this.headers(),
    });
  }

  search(field: string, value: string): Observable<Transaction[]> {
    const fieldType = this.getFieldType(field);
    let formattedValue = value;

    if (fieldType === 'boolean') {
      formattedValue = value.toLowerCase() === 'true' ? 'true' : 'false';
    }

    if (fieldType === 'date') {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        formattedValue = date.toISOString().split('T')[0] + 'T00:00:00Z';
      }
    }

    return this.http
      .get<Transaction[]>(
        `${this.base}/queries/transaction/${field}?${field}=${encodeURIComponent(formattedValue)}`,
        { headers: this.headers() }
      )
      .pipe(tap(res => this.transactions.set(res)));
  }

  getById(id: string): Observable<Transaction> {
    return this.http.get<Transaction>(
      `${this.base}/queries/transaction/id?id=${encodeURIComponent(id)}`,
      { headers: this.headers() }
    );
  }

  private getFieldType(field: string): 'string' | 'boolean' | 'date' {
    switch (field) {
      case 'dateTransaction':
        return 'date';
      case 'updatedAt':
        return 'date';
      default:
        return 'string';
    }
  }
}
