import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'https://api.github.com/users';

  constructor(private http: HttpClient) {}

  getDatos(username: string = 'MateoCatalogna'): Observable<any> {
    // Asegurate de usar un usuario válido de GitHub
    return this.http.get(`${this.baseUrl}/${username}`);
  }
}