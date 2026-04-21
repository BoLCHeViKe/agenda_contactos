import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contact, ContactForm } from '../models/contact.model';

@Injectable({ providedIn: 'root' })
export class ContactService {
  // En prod, Nginx hace proxy de /api → backend:3001
  private base = '/api';

  constructor(private http: HttpClient) {}

  getContacts(search?: string, favorite?: boolean): Observable<Contact[]> {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    if (favorite) params = params.set('favorite', '1');
    return this.http.get<Contact[]>(`${this.base}/contacts`, { params });
  }

  getContact(id: number): Observable<Contact> {
    return this.http.get<Contact>(`${this.base}/contacts/${id}`);
  }

  createContact(data: Partial<ContactForm>): Observable<Contact> {
    return this.http.post<Contact>(`${this.base}/contacts`, data);
  }

  updateContact(id: number, data: Partial<ContactForm>): Observable<Contact> {
    return this.http.put<Contact>(`${this.base}/contacts/${id}`, data);
  }

  deleteContact(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.base}/contacts/${id}`);
  }

  toggleFavorite(id: number): Observable<Contact> {
    return this.http.patch<Contact>(`${this.base}/contacts/${id}/favorite`, {});
  }

  uploadPhoto(file: File): Observable<{ url: string; filename: string }> {
    const form = new FormData();
    form.append('photo', file);
    return this.http.post<{ url: string; filename: string }>(`${this.base}/upload/photo`, form);
  }

  getPhotoUrl(url: string | null): string {
    if (!url) return '';
    return url;
  }
}
