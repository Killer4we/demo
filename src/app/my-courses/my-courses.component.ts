import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { CourseCardComponent } from '../course-card/course-card.component';
import { UserService } from '../services/user.service';
import { CourseService } from '../services/course.service';

interface AuthorCourse {
  id: number;
  title: string;
  provider: string;
  providerLogo: string;
  thumbnail: string;
  rating: number;
  reviews: number;
  enrollments: string;
  difficulty: string;
  duration: string;
  price: string;
  tags: string[];
  status: 'Published' | 'Draft' | 'Archived';
  authorId: number;
  createdDate: string;
  publishedDate: string | null;
  lastModified: string;
  progress?: number;
  isEnrolled?: boolean;
  isCompleted?: boolean;
}

@Component({
  selector: 'app-my-courses',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, CourseCardComponent],
  templateUrl: './my-courses.component.html',
  styleUrls: ['./my-courses.component.scss']
})
export class MyCoursesComponent implements OnInit {
  user: any = null;
  allCourses: AuthorCourse[] = [];
  filteredCourses: AuthorCourse[] = [];
  activeTab: 'Published' | 'Draft' | 'Archived' = 'Published';
  searchQuery: string = '';
  sortOption: string = 'Latest';
  isLoading = true;

  sortOptions = [
    { value: 'Latest', label: 'Latest' },
    { value: 'Oldest', label: 'Oldest' },
    { value: 'HighestRating', label: 'Highest Rating' },
    { value: 'HighestReviewed', label: 'Highest Reviewed' },
    { value: 'AZ', label: 'A-Z' },
    { value: 'ZA', label: 'Z-A' }
  ];

  constructor(
    private router: Router,
    private userService: UserService,
    private courseService: CourseService
  ) {}

  ngOnInit() {
    this.user = this.userService.getCurrentUser();
    
    // Check if user has author role
    if (!this.hasAuthorAccess()) {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.loadAuthorCourses();
  }

  hasAuthorAccess(): boolean {
    return this.user && (this.user.role === 'Author' || this.user.role === 'Admin');
  }

  loadAuthorCourses() {
    this.isLoading = true;
    
    if (this.user && this.user.id) {
      this.courseService.getCoursesByAuthor(this.user.id).subscribe({
        next: (courses: any[]) => {
          this.allCourses = courses.map(course => ({
            ...course,
            status: 'Published' as 'Published' | 'Draft' | 'Archived',
            authorId: this.user.id,
            createdDate: '2024-01-15',
            lastModified: '2024-01-20'
          }));
          this.filterAndSortCourses();
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Error loading author courses:', error);
          this.allCourses = [];
          this.filterAndSortCourses();
          this.isLoading = false;
        }
      });
    } else {
      this.isLoading = false;
    }
  }

  switchTab(tab: 'Published' | 'Draft' | 'Archived') {
    this.activeTab = tab;
    this.filterAndSortCourses();
  }

  onSearchChange() {
    this.filterAndSortCourses();
  }

  onSortChange() {
    this.filterAndSortCourses();
  }

  filterAndSortCourses() {
    let filtered = this.allCourses.filter(course => course.status === this.activeTab);

    // Apply search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(query) ||
        course.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply sorting
    filtered = this.sortCourses(filtered);

    this.filteredCourses = filtered;
  }

  sortCourses(courses: AuthorCourse[]): AuthorCourse[] {
    switch (this.sortOption) {
      case 'Latest':
        return courses.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
      case 'Oldest':
        return courses.sort((a, b) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime());
      case 'HighestRating':
        return courses.sort((a, b) => b.rating - a.rating);
      case 'HighestReviewed':
        return courses.sort((a, b) => b.reviews - a.reviews);
      case 'AZ':
        return courses.sort((a, b) => a.title.localeCompare(b.title));
      case 'ZA':
        return courses.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return courses;
    }
  }

  getTabCount(status: 'Published' | 'Draft' | 'Archived'): number {
    return this.allCourses.filter(course => course.status === status).length;
  }

  createNewCourse() {
    // Navigate to course creation page
    console.log('Navigate to course creation');
    // this.router.navigate(['/courses/create']);
  }

  editCourse(courseId: number) {
    // Navigate to course edit page
    console.log('Edit course:', courseId);
    // this.router.navigate(['/courses/edit', courseId]);
  }

  viewCourse(courseId: number) {
    // Navigate to course details page
    this.router.navigate(['/course', courseId]);
  }

  duplicateCourse(courseId: number) {
    console.log('Duplicate course:', courseId);
    // Implement course duplication logic
  }

  archiveCourse(courseId: number) {
    console.log('Archive course:', courseId);
    // Implement course archiving logic
  }

  deleteCourse(courseId: number) {
    console.log('Delete course:', courseId);
    // Implement course deletion logic
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Published': return 'status-published';
      case 'Draft': return 'status-draft';
      case 'Archived': return 'status-archived';
      default: return '';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  goHome() {
    this.router.navigate(['/dashboard']);
  }
}
