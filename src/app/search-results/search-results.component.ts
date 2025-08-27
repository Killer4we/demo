import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../services/course.service';
import { UserService } from '../services/user.service';
import { CourseCardComponent } from '../course-card/course-card.component';
import { HeaderComponent } from '../header/header.component';

interface FilterOptions {
  duration: string[];
  rating: number[];
  publishedDate: string[];
  courseLevel: string[];
  aiContent: boolean;
}

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, FormsModule, CourseCardComponent, HeaderComponent],
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {
  user: any;
  searchQuery: string = '';
  originalResults: any[] = [];
  filteredResults: any[] = [];
  totalResults: number = 0;
  sortBy: string = 'latest';
  showFilters: boolean = true;

  filters: FilterOptions = {
    duration: [],
    rating: [],
    publishedDate: [],
    courseLevel: [],
    aiContent: false
  };

  // Filter options
  durationOptions = [
    { label: '< 1 week', value: '<1week', count: 15 },
    { label: '1 - 4 weeks', value: '1-4weeks', count: 24 },
    { label: '1 - 3 Months', value: '1-3months', count: 32 },
    { label: '3 - 6 Months', value: '3-6months', count: 18 },
    { label: '6+ Months', value: '6+months', count: 8 }
  ];

  ratingOptions = [
    { stars: 4.5, label: '4.5 & up', value: 4.5, count: 120 },
    { stars: 4.0, label: '4.0 & up', value: 4.0, count: 98 },
    { stars: 3.5, label: '3.5 & up', value: 3.5, count: 67 },
    { stars: 3.0, label: '3.0 & up', value: 3.0, count: 45 }
  ];

  publishedDateOptions = [
    { label: 'All', value: 'all', count: 110 },
    { label: 'Past Month', value: 'past-month', count: 28 },
    { label: 'This Month', value: 'this-month', count: 15 },
    { label: 'Last 6 Months', value: 'last-6months', count: 52 },
    { label: 'This year', value: 'this-year', count: 89 }
  ];

  courseLevelOptions = [
    { label: 'All Levels', value: 'all', count: 110 },
    { label: 'Beginner', value: 'beginner', count: 45 },
    { label: 'Intermediate', value: 'intermediate', count: 38 },
    { label: 'Advanced', value: 'advanced', count: 27 }
  ];

  sortOptions = [
    { label: 'Latest', value: 'latest' },
    { label: 'Most Popular', value: 'popular' },
    { label: 'Highest Rated', value: 'rating' },
    { label: 'A-Z', value: 'alphabetical' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.user = this.userService.getCurrentUser();
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['q'] || '';
      if (this.searchQuery) {
        this.performSearch();
      }
    });
  }

  performSearch() {
    // Get search results from service
    this.originalResults = this.courseService.searchCourses(this.searchQuery, true); // true for extended search
    this.filteredResults = [...this.originalResults];
    this.totalResults = this.filteredResults.length;
    this.applyFilters();
  }

  onFilterChange() {
    this.applyFilters();
  }

  applyFilters() {
    this.filteredResults = this.originalResults.filter(course => {
      // Duration filter
      if (this.filters.duration.length > 0) {
        const matchesDuration = this.filters.duration.some(duration => {
          return this.checkDurationMatch(course.duration, duration);
        });
        if (!matchesDuration) return false;
      }

      // Rating filter
      if (this.filters.rating.length > 0) {
        const minRating = Math.min(...this.filters.rating);
        if (course.rating < minRating) return false;
      }

      // Course level filter
      if (this.filters.courseLevel.length > 0 && !this.filters.courseLevel.includes('all')) {
        const matchesLevel = this.filters.courseLevel.some(level => 
          course.difficulty.toLowerCase() === level.toLowerCase()
        );
        if (!matchesLevel) return false;
      }

      // AI content filter
      if (this.filters.aiContent) {
        const hasAIContent = course.tags.some((tag: string) => 
          tag.toLowerCase().includes('ai') || 
          tag.toLowerCase().includes('artificial intelligence') ||
          tag.toLowerCase().includes('machine learning')
        );
        if (!hasAIContent) return false;
      }

      return true;
    });

    this.applySorting();
    this.totalResults = this.filteredResults.length;
  }

  private checkDurationMatch(courseDuration: string, filterDuration: string): boolean {
    // Convert course duration to weeks for comparison
    const courseWeeks = this.parseDurationToWeeks(courseDuration);
    
    switch (filterDuration) {
      case '<1week': return courseWeeks < 1;
      case '1-4weeks': return courseWeeks >= 1 && courseWeeks <= 4;
      case '1-3months': return courseWeeks >= 4 && courseWeeks <= 12;
      case '3-6months': return courseWeeks >= 12 && courseWeeks <= 24;
      case '6+months': return courseWeeks > 24;
      default: return true;
    }
  }

  private parseDurationToWeeks(duration: string): number {
    const months = duration.match(/(\d+)\s*month/i);
    if (months) return parseInt(months[1]) * 4;
    
    const weeks = duration.match(/(\d+)\s*week/i);
    if (weeks) return parseInt(weeks[1]);
    
    return 8; // Default to 2 months if unclear
  }

  applySorting() {
    switch (this.sortBy) {
      case 'latest':
        // Sort by newest first (mock implementation)
        this.filteredResults.sort((a, b) => b.id - a.id);
        break;
      case 'popular':
        this.filteredResults.sort((a, b) => parseInt(b.enrollments) - parseInt(a.enrollments));
        break;
      case 'rating':
        this.filteredResults.sort((a, b) => b.rating - a.rating);
        break;
      case 'alphabetical':
        this.filteredResults.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
  }

  onSortChange() {
    this.applySorting();
  }

  clearAllFilters() {
    this.filters = {
      duration: [],
      rating: [],
      publishedDate: [],
      courseLevel: [],
      aiContent: false
    };
    this.applyFilters();
  }

  toggleFilter(filterType: keyof FilterOptions, value: any) {
    if (filterType === 'aiContent') {
      this.filters.aiContent = !this.filters.aiContent;
    } else {
      const filterArray = this.filters[filterType] as any[];
      const index = filterArray.indexOf(value);
      if (index > -1) {
        filterArray.splice(index, 1);
      } else {
        filterArray.push(value);
      }
    }
    this.onFilterChange();
  }

  isFilterSelected(filterType: keyof FilterOptions, value: any): boolean {
    if (filterType === 'aiContent') {
      return this.filters.aiContent;
    }
    return (this.filters[filterType] as any[]).includes(value);
  }

  getStarArray(rating: number): number[] {
    return Array(5).fill(0).map((_, index) => index < Math.floor(rating) ? 1 : 0);
  }

  toggleFiltersVisibility() {
    this.showFilters = !this.showFilters;
  }
}
