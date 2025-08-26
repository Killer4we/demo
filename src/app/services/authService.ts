import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000'; // JSON server API
  private tokenKey = 'jwt_token';
  userSig = signal<any | null>(null);

  constructor(private http: HttpClient, private router: Router) {}


  login(user: { email: string; password: string }) {
  return this.http.post<{ token: string }>(`${this.apiUrl}/login`, user);
}

register(user: { email: string; password: string }) {
  // Change this line
  return this.http.post(`${this.apiUrl}/users`, user);
  
}

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.userSig.set(null);
    this.router.navigate(['/login']);
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn() {
    return !!this.getToken();
  }
}
