import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.scss']
})
export class CourseCardComponent {
  @Input() course: any = {};

  get progressPercentage(): number {
    return this.course.progress || 0;
  }

  get difficultyClass(): string {
    switch (this.course.difficulty?.toLowerCase()) {
      case 'beginner':
        return 'difficulty-beginner';
      case 'intermediate':
        return 'difficulty-intermediate';
      case 'advanced':
        return 'difficulty-advanced';
      default:
        return 'difficulty-beginner';
    }
  }

  get ratingStars(): number[] {
    const rating = Math.floor(this.course.rating || 0);
    return Array(5).fill(0).map((_, index) => index < rating ? 1 : 0);
  }

  onCourseClick() {
    console.log('Navigate to course:', this.course);
    // Implement navigation to course details
  }

  onProviderClick(event: Event) {
    event.stopPropagation();
    console.log('Navigate to provider:', this.course.provider);
    // Implement navigation to provider page
  }
}
