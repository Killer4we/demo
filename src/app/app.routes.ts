import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { CourseDetailComponent } from './course-detail/course-detail.component';
import { CoursePlayerComponent } from './course-player/course-player.component';
import { MyCoursesComponent } from './my-courses/my-courses.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'search', component: SearchResultsComponent },
  { path: 'course/:id', component: CourseDetailComponent },
  { path: 'learn/:courseId/lecture/:lectureId', component: CoursePlayerComponent },
  { path: 'my-courses', component: MyCoursesComponent },
  { path: '**', redirectTo: '/dashboard' }
];
