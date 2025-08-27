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

  // Mock data for author courses
  mockAuthorCourses: AuthorCourse[] = [
    {
      id: 1,
      title: "Google Data Analytics Professional Certificate",
      provider: "Google",
      providerLogo: "https://cdn-icons-png.flaticon.com/512/300/300221.png",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop",
      rating: 4.8,
      reviews: 1276,
      enrollments: "45,908",
      difficulty: "Beginner",
      duration: "6 months",
      price: "Free",
      tags: ["Data Analysis", "Statistics", "Excel", "Tableau"],
      status: "Published",
      authorId: 1,
      createdDate: "2024-01-15",
      publishedDate: "2024-02-01",
      lastModified: "2024-06-15"
    },
    {
      id: 2,
      title: "Advanced Data Visualization with Python",
      provider: "Google",
      providerLogo: "https://cdn-icons-png.flaticon.com/512/300/300221.png",
      thumbnail: "https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?w=400&h=200&fit=crop",
      rating: 4.7,
      reviews: 892,
      enrollments: "23,445",
      difficulty: "Advanced",
      duration: "8 months",
      price: "$49/month",
      tags: ["Python", "Data Visualization", "Matplotlib", "Seaborn"],
      status: "Published",
      authorId: 1,
      createdDate: "2024-03-10",
      publishedDate: "2024-04-01",
      lastModified: "2024-07-20"
    },
    {
      id: 3,
      title: "Machine Learning Fundamentals",
      provider: "Google",
      providerLogo: "https://cdn-icons-png.flaticon.com/512/300/300221.png",
      thumbnail: "https://images.unsplash.com/photo-1527474305487-b87b222841cc?w=400&h=200&fit=crop",
      rating: 4.9,
      reviews: 1534,
      enrollments: "67,234",
      difficulty: "Intermediate",
      duration: "10 months",
      price: "$79/month",
      tags: ["Machine Learning", "AI", "Python", "Algorithms"],
      status: "Draft",
      authorId: 1,
      createdDate: "2024-05-15",
      publishedDate: null,
      lastModified: "2024-08-10"
    },
    {
      id: 4,
      title: "Statistical Analysis with R",
      provider: "Google",
      providerLogo: "https://cdn-icons-png.flaticon.com/512/300/300221.png",
      thumbnail: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400&h=200&fit=crop",
      rating: 4.6,
      reviews: 445,
      enrollments: "12,890",
      difficulty: "Intermediate",
      duration: "5 months",
      price: "$39/month",
      tags: ["R Programming", "Statistics", "Data Analysis"],
      status: "Published",
      authorId: 1,
      createdDate: "2024-02-20",
      publishedDate: "2024-03-15",
      lastModified: "2024-05-30"
    },
    {
      id: 5,
      title: "Business Intelligence with Tableau",
      provider: "Google",
      providerLogo: "https://cdn-icons-png.flaticon.com/512/300/300221.png",
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop",
      rating: 4.5,
      reviews: 678,
      enrollments: "18,567",
      difficulty: "Beginner",
      duration: "4 months",
      price: "Free",
      tags: ["Tableau", "Business Intelligence", "Data Visualization"],
      status: "Archived",
      authorId: 1,
      createdDate: "2023-11-10",
      publishedDate: "2023-12-01",
      lastModified: "2024-01-15"
    },
    {
      id: 6,
      title: "SQL for Data Analysis",
      provider: "Google",
      providerLogo: "https://cdn-icons-png.flaticon.com/512/300/300221.png",
      thumbnail: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=200&fit=crop",
      rating: 4.7,
      reviews: 923,
      enrollments: "31,245",
      difficulty: "Beginner",
      duration: "3 months",
      price: "Free",
      tags: ["SQL", "Database", "Data Analysis"],
      status: "Published",
      authorId: 1,
      createdDate: "2024-01-05",
      publishedDate: "2024-01-20",
      lastModified: "2024-04-10"
    },
    {
      id: 7,
      title: "Deep Learning with TensorFlow",
      provider: "Google",
      providerLogo: "https://cdn-icons-png.flaticon.com/512/300/300221.png",
      thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=200&fit=crop",
      rating: 0,
      reviews: 0,
      enrollments: "0",
      difficulty: "Advanced",
      duration: "12 months",
      price: "$99/month",
      tags: ["Deep Learning", "TensorFlow", "Neural Networks", "AI"],
      status: "Draft",
      authorId: 1,
      createdDate: "2024-07-01",
      publishedDate: null,
      lastModified: "2024-08-25"
    },
    {
      id: 8,
      title: "Excel for Data Analysis",
      provider: "Google",
      providerLogo: "https://cdn-icons-png.flaticon.com/512/300/300221.png",
      thumbnail: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=200&fit=crop",
      rating: 4.4,
      reviews: 556,
      enrollments: "28,934",
      difficulty: "Beginner",
      duration: "2 months",
      price: "Free",
      tags: ["Excel", "Data Analysis", "Spreadsheets"],
      status: "Archived",
      authorId: 1,
      createdDate: "2023-09-15",
      publishedDate: "2023-10-01",
      lastModified: "2024-01-01"
    }
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
    
    // In a real app, this would fetch from the API
    setTimeout(() => {
      this.allCourses = this.mockAuthorCourses;
      this.filterAndSortCourses();
      this.isLoading = false;
    }, 500);
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
