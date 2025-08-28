import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { StatisticsComponent } from '../statistics/statistics.component';
import { CourseCarouselComponent } from '../course-carousel/course-carousel.component';
import { CourseService } from '../services/course.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    StatisticsComponent,
    CourseCarouselComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  user: any;
  lastViewedCourses: any[] = [];
  newlyLaunchedCourses: any[] = [];
  statistics = {
    myGoals: 3,
    enrolledCourses: 8,
    certificatesEarned: 2
  };

  constructor(
    private courseService: CourseService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loadUserData();
    this.loadCourses();
  }

  private loadUserData() {
    this.user = this.userService.getCurrentUser();
  }

  private loadCourses() {
    this.courseService.getLastViewedCourses().subscribe({
      next: (courses: any[]) => {
        this.lastViewedCourses = courses;
      },
      error: (error: any) => {
        console.error('Error loading last viewed courses:', error);
        this.lastViewedCourses = [];
      }
    });

    this.courseService.getNewlyLaunchedCourses().subscribe({
      next: (courses: any[]) => {
        this.newlyLaunchedCourses = courses;
      },
      error: (error: any) => {
        console.error('Error loading newly launched courses:', error);
        this.newlyLaunchedCourses = [];
      }
    });
  }
}
