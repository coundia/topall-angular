import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Chat } from '../models/chat.model';
import { AuthService } from '../../../shared/security/services/auth.service';
import { API_BASE } from '../../../shared/constantes/shared-imports';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly base = `${API_BASE}/v1`;

  readonly chats = signal<Chat[]>([]);
  readonly totalPages = signal(0);
  readonly totalElements = signal(0);

  private headers(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  fetch(page = 0, limit = 10): Observable<{ content: Chat[]; totalPages: number; totalElements: number }> {
    return this.http
      .get<{ content: Chat[]; totalPages: number; totalElements: number }>(
        `${this.base}/queries/chats?page=${page}&limit=${limit}`,
        { headers: this.headers() }
      )
      .pipe(
        tap(res => {
          this.chats.set(res.content);
          this.totalPages.set(res.totalPages ?? 0);
          this.totalElements.set(res.totalElements ?? 0);
        })
      );
  }

  create(dto:   Partial<Chat>): Observable<Chat> {
    const form = new FormData();
    if(dto.id != undefined && dto.id !== null && dto.id.length > 0) {
        form.append('id', dto.id);
    }
    if(dto.messages != undefined && dto.messages !== null && dto.messages.length > 0) {
        form.append('messages', dto.messages);
    }
    if(dto.responses != undefined && dto.responses !== null && dto.responses.length > 0) {
        form.append('responses', dto.responses);
    }
    if(dto.responsesJson != undefined && dto.responsesJson !== null && dto.responsesJson.length > 0) {
        form.append('responsesJson', dto.responsesJson);
    }
    if(dto.state != undefined && dto.state !== null && dto.state.length > 0) {
        form.append('state', dto.state);
    }
    if(dto.account != undefined && dto.account !== null && dto.account.length > 0) {
        form.append('account', dto.account);
    }
    if (dto.files) {
      for (const file of dto.files) {
        form.append('files', file);
      }
    }

    return this.http.post<Chat>(`${this.base}/commands/chat`, form);
  }


  update(id: string, dto: Partial<Chat>): Observable<any> {
    return this.http.put(`${this.base}/commands/chat/${id}`, dto, {
      headers: this.headers(),
    });
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.base}/commands/chat/${id}`, {
      headers: this.headers(),
    });
  }

  search(field: string, value: string): Observable<Chat[]> {
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
      .get<Chat[]>(
        `${this.base}/queries/chat/${field}?${field}=${encodeURIComponent(formattedValue)}`,
        { headers: this.headers() }
      )
      .pipe(tap(res => this.chats.set(res)));
  }

  getById(id: string): Observable<Chat> {
    return this.http.get<Chat>(
      `${this.base}/queries/chat/id?id=${encodeURIComponent(id)}`,
      { headers: this.headers() }
    );
  }

  private getFieldType(field: string): 'string' | 'boolean' | 'date' {
    switch (field) {
      default:
        return 'string';
    }
  }
}
