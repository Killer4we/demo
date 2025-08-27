import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000';
  private currentUser: any = null;

  constructor(private http: HttpClient) {
    // Initialize with mock user data - Author role for testing
    this.currentUser = {
      id: 1,
      fullName: 'Harry Shimron',
      role: 'Author', // Changed to Author to test My Courses functionality
      email: 'harry.shimron@company.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      totalStudents: 125843,
      rating: 4.8,
      totalCourses: 8
    };
  }

  getCurrentUser() {
    return this.currentUser;
  }

  setCurrentUser(user: any) {
    this.currentUser = user;
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }

  getUserById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/${id}`);
  }

  updateUser(user: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/users/${user.id}`, user);
  }

  hasAuthorAccess(): boolean {
    return this.currentUser && (this.currentUser.role === 'Author' || this.currentUser.role === 'Admin');
  }

  logout() {
    this.currentUser = null;
    // Implement logout logic - clear tokens, redirect, etc.
  }
}
