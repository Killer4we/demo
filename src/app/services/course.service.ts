import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Course {
  id: number;
  title: string;
  provider: string;
  providerLogo?: string;
  thumbnail: string;
  rating: number;
  reviews: number;
  enrollments: string;
  difficulty: string;
  duration: string;
  progress?: number;
  isEnrolled?: boolean;
  isCompleted?: boolean;
  price?: string;
  tags?: string[];
  category?: string;
  publishedDate?: string;
  author?: string;
  description?: string;
  whatYoullLearn?: string[];
  skillsYoullGain?: string[];
  requirements?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'http://localhost:3000/courses';

  constructor(private http: HttpClient) { }

  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl);
  }

  getLastViewedCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}?_limit=5`);
  }

  getNewlyLaunchedCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}?_limit=6`);
  }

  searchCourses(query: string): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}?q=${encodeURIComponent(query)}`);
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`);
  }

  getCoursesByAuthor(authorName: string): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}?author=${encodeURIComponent(authorName)}`);
  }
}
