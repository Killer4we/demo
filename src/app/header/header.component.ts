import { Component, Input, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CourseService } from '../services/course.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() user: any;
  @ViewChild('searchInput') searchInput!: ElementRef;

  productName = 'LearnHub Pro';
  searchQuery = '';
  searchSuggestions: any[] = [];
  showSuggestions = false;
  showProfileDropdown = false;
  showMobileSearch = false;
  notificationCount = 3;
  isMobile = false;

  constructor(
    private courseService: CourseService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.checkScreenSize();
    // Set default user if none provided
    if (!this.user) {
      this.user = {
        id: 1,
        fullName: 'Harry Shimron',
        role: 'DC Software Engineer',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        email: 'harry.shimron@company.com'
      };
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
    if (!this.isMobile) {
      this.showMobileSearch = false;
    }
  }

  toggleMobileSearch() {
    this.showMobileSearch = !this.showMobileSearch;
    if (this.showMobileSearch && this.searchInput) {
      setTimeout(() => this.searchInput.nativeElement.focus(), 100);
    }
  }

  onSearchInput() {
    if (this.searchQuery.length > 0) {
      this.searchSuggestions = this.courseService.searchCourses(this.searchQuery);
      this.showSuggestions = this.searchSuggestions.length > 0;
    } else {
      this.showSuggestions = false;
    }
  }

  selectSuggestion(suggestion: any) {
    this.searchQuery = suggestion.title;
    this.showSuggestions = false;
    this.showMobileSearch = false;
    // Navigate to search results with the selected suggestion
    this.performSearch();
  }

  performSearch() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], { 
        queryParams: { q: this.searchQuery.trim() } 
      });
      this.showSuggestions = false;
      this.showMobileSearch = false;
    }
  }

  onSearchKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.performSearch();
    } else if (event.key === 'Escape') {
      this.showSuggestions = false;
      this.showMobileSearch = false;
    }
  }

  clearSearch() {
    this.searchQuery = '';
    this.showSuggestions = false;
    if (this.searchInput) {
      this.searchInput.nativeElement.focus();
    }
  }

  toggleProfileDropdown() {
    this.showProfileDropdown = !this.showProfileDropdown;
  }

  onProfileAction(action: string) {
    console.log('Profile action:', action);
    this.showProfileDropdown = false;
    
    switch (action) {
      case 'profile':
        // Navigate to profile
        break;
      case 'admin':
        // Navigate to admin console
        break;
      case 'courses':
        // Navigate to my courses - only for Authors and Admins
        if (this.hasAuthorAccess()) {
          this.router.navigate(['/my-courses']);
        }
        break;
      case 'blog':
        // Navigate to blog
        break;
      case 'logout':
        // Implement logout logic
        break;
    }
  }

  hasAuthorAccess(): boolean {
    return this.userService.hasAuthorAccess();
  }

  // Close dropdowns when clicking outside
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.search-container') && !target.closest('.mobile-search-btn')) {
      this.showSuggestions = false;
      this.showMobileSearch = false;
    }
    if (!target.closest('.profile-container')) {
      this.showProfileDropdown = false;
    }
  }
}
