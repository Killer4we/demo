import { Component, Input, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseCardComponent } from '../course-card/course-card.component';

@Component({
  selector: 'app-course-carousel',
  standalone: true,
  imports: [CommonModule, CourseCardComponent],
  templateUrl: './course-carousel.component.html',
  styleUrls: ['./course-carousel.component.scss']
})
export class CourseCarouselComponent implements AfterViewInit {
  @Input() title = '';
  @Input() courses: any[] = [];
  @ViewChild('carousel') carousel!: ElementRef;

  canScrollLeft = false;
  canScrollRight = true;

  ngAfterViewInit() {
    this.updateScrollButtons();
  }

  scrollLeft() {
    const carousel = this.carousel.nativeElement;
    const cardWidth = 340; // card width + gap
    carousel.scrollBy({
      left: -cardWidth * 2,
      behavior: 'smooth'
    });
    
    setTimeout(() => this.updateScrollButtons(), 300);
  }

  scrollRight() {
    const carousel = this.carousel.nativeElement;
    const cardWidth = 340; // card width + gap
    carousel.scrollBy({
      left: cardWidth * 2,
      behavior: 'smooth'
    });
    
    setTimeout(() => this.updateScrollButtons(), 300);
  }

  private updateScrollButtons() {
    const carousel = this.carousel.nativeElement;
    this.canScrollLeft = carousel.scrollLeft > 0;
    this.canScrollRight = carousel.scrollLeft < (carousel.scrollWidth - carousel.clientWidth);
  }

  onScroll() {
    this.updateScrollButtons();
  }
}
