import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { HeaderComponent } from '../header/header.component';
import { CourseService } from '../services/course.service';
import { UserService } from '../services/user.service';

interface Course {
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
  progress?: number;
  isEnrolled?: boolean;
  isCompleted?: boolean;
  price?: string;
  tags?: string[];
  category?: string;
  publishedDate?: string;
  description?: string;
  whatYoullLearn?: string[];
  skillsYoullGain?: string[];
  requirements?: string[];
}

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss']
})
export class CourseDetailComponent implements OnInit, OnDestroy {
  course: Course | null = null;
  user: any = null;
  activeTab: string = 'overview';
  expandedSections: Set<number> = new Set();
  allSectionsExpanded = false;
  isLoading = true;

  private destroy$ = new Subject<void>();

  // Mock course content data
  courseContent = {
    totalSections: 7,
    totalLectures: 25,
    totalDuration: '18h 30m',
    sections: [
      {
        id: 1,
        title: 'Introduction to Data Analytics',
        lectureCount: 4,
        duration: '2h 15m',
        lectures: [
          { id: 1, title: 'What is Data Analytics?', duration: '15m', type: 'video' },
          { id: 2, title: 'The Data Analytics Process', duration: '25m', type: 'video' },
          { id: 3, title: 'Tools and Technologies Overview', duration: '35m', type: 'video' },
          { id: 4, title: 'Setting up Your Environment', duration: '20m', type: 'video' }
        ]
      },
      {
        id: 2,
        title: 'Data Collection and Cleaning',
        lectureCount: 5,
        duration: '3h 45m',
        lectures: [
          { id: 5, title: 'Data Sources and Types', duration: '30m', type: 'video' },
          { id: 6, title: 'Data Collection Methods', duration: '40m', type: 'video' },
          { id: 7, title: 'Data Quality Assessment', duration: '45m', type: 'video' },
          { id: 8, title: 'Data Cleaning Techniques', duration: '50m', type: 'video' },
          { id: 9, title: 'Hands-on: Cleaning Real Data', duration: '1h 20m', type: 'lab' }
        ]
      },
      {
        id: 3,
        title: 'Exploratory Data Analysis',
        lectureCount: 4,
        duration: '2h 50m',
        lectures: [
          { id: 10, title: 'Statistical Foundations', duration: '35m', type: 'video' },
          { id: 11, title: 'Data Visualization Principles', duration: '40m', type: 'video' },
          { id: 12, title: 'Creating Charts and Graphs', duration: '45m', type: 'video' },
          { id: 13, title: 'EDA Project', duration: '50m', type: 'project' }
        ]
      },
      {
        id: 4,
        title: 'Advanced Analytics Techniques',
        lectureCount: 6,
        duration: '4h 20m',
        lectures: [
          { id: 14, title: 'Regression Analysis', duration: '45m', type: 'video' },
          { id: 15, title: 'Classification Techniques', duration: '50m', type: 'video' },
          { id: 16, title: 'Clustering Methods', duration: '40m', type: 'video' },
          { id: 17, title: 'Time Series Analysis', duration: '55m', type: 'video' },
          { id: 18, title: 'Predictive Modeling', duration: '1h 10m', type: 'video' },
          { id: 19, title: 'Advanced Analytics Project', duration: '1h', type: 'project' }
        ]
      },
      {
        id: 5,
        title: 'Business Intelligence and Reporting',
        lectureCount: 3,
        duration: '2h 30m',
        lectures: [
          { id: 20, title: 'BI Fundamentals', duration: '40m', type: 'video' },
          { id: 21, title: 'Dashboard Design', duration: '50m', type: 'video' },
          { id: 22, title: 'Creating Interactive Reports', duration: '1h', type: 'lab' }
        ]
      },
      {
        id: 6,
        title: 'Data Visualization with Tableau',
        lectureCount: 2,
        duration: '1h 50m',
        lectures: [
          { id: 23, title: 'Tableau Basics', duration: '55m', type: 'video' },
          { id: 24, title: 'Advanced Tableau Techniques', duration: '55m', type: 'video' }
        ]
      },
      {
        id: 7,
        title: 'Capstone Project',
        lectureCount: 1,
        duration: '1h',
        lectures: [
          { id: 25, title: 'Final Project Presentation', duration: '1h', type: 'project' }
        ]
      }
    ]
  };

  // Mock author data
  author = {
    name: 'Dr. Sarah Johnson',
    title: 'Senior Data Scientist at Google',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    rating: 4.8,
    students: '125,000+',
    courses: 12,
    bio: `Dr. Sarah Johnson is a Senior Data Scientist at Google with over 10 years of experience in data analytics and machine learning. She holds a Ph.D. in Statistics from Stanford University and has published numerous papers on data science methodologies.

    Sarah has worked with Fortune 500 companies to implement data-driven solutions and has been recognized as a leader in the field of data analytics. She is passionate about teaching and has helped thousands of students launch their careers in data science.

    Her expertise spans across statistical modeling, machine learning, data visualization, and business intelligence. She specializes in making complex data concepts accessible to learners of all levels.`,
    faqs: [
      {
        question: 'What makes this course different from other data analytics courses?',
        answer: 'This course focuses on practical, real-world applications with hands-on projects using actual industry datasets. You\'ll learn not just the theory, but how to apply these concepts in professional settings.'
      },
      {
        question: 'Do I need prior programming experience?',
        answer: 'No programming experience is required. We start with the basics and gradually build up your skills. The course is designed for complete beginners who want to enter the field of data analytics.'
      },
      {
        question: 'What kind of support do you provide?',
        answer: 'I personally review and respond to questions in the course discussion forums. We also have weekly live Q&A sessions where you can ask questions directly.'
      }
    ]
  };

  // Mock testimonials data
  testimonials = [
    {
      id: 1,
      rating: 5,
      text: 'This course completely changed my career trajectory. The practical approach and real-world examples made complex concepts easy to understand. I landed my dream job as a data analyst within 3 months of completing the course!',
      reviewer: {
        name: 'Michael Chen',
        title: 'Data Analyst at Microsoft',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face'
      }
    },
    {
      id: 2,
      rating: 5,
      text: 'Sarah\'s teaching style is exceptional. She breaks down complex statistical concepts into digestible pieces. The hands-on projects were particularly valuable in building my portfolio.',
      reviewer: {
        name: 'Emily Rodriguez',
        title: 'Business Intelligence Developer',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face'
      }
    },
    {
      id: 3,
      rating: 4,
      text: 'Great course with comprehensive content. The Tableau section was especially helpful for my current role. Would recommend to anyone starting in data analytics.',
      reviewer: {
        name: 'James Wilson',
        title: 'Marketing Analyst',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face'
      }
    },
    {
      id: 4,
      rating: 5,
      text: 'The course structure is perfect for working professionals. I could learn at my own pace and the content is immediately applicable to my work projects.',
      reviewer: {
        name: 'Lisa Thompson',
        title: 'Operations Manager at Amazon',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face'
      }
    }
  ];

  // Mock related courses
  relatedCourses = [
    {
      id: 2,
      title: 'Advanced Python for Data Science',
      thumbnail: 'https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?w=300&h=180&fit=crop',
      duration: '8 weeks',
      rating: 4.7,
      badge: 'Bestseller',
      badgeType: 'bestseller'
    },
    {
      id: 3,
      title: 'Machine Learning Fundamentals',
      thumbnail: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc?w=300&h=180&fit=crop',
      duration: '10 weeks',
      rating: 4.8,
      badge: 'Highest Rated',
      badgeType: 'highest-rated'
    },
    {
      id: 4,
      title: 'Business Intelligence with Power BI',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=180&fit=crop',
      duration: '6 weeks',
      rating: 4.6,
      badge: 'New',
      badgeType: 'new'
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.user = this.userService.getCurrentUser();
    
    this.route.params.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      const courseId = +params['id'];
      if (courseId) {
        this.loadCourse(courseId);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCourse(courseId: number) {
    this.isLoading = true;
    
    // Try to get course from the service first
    const courseFromService = this.courseService.getCourseById(courseId);
    
    if (courseFromService) {
      // If found in service, use it and enhance with additional properties
      this.course = {
        ...courseFromService,
        category: 'Data Science',
        publishedDate: '2024-01-15',
        description: 'Become a Prompt Engineering Expert. Master prompt engineering patterns, techniques, and approaches to effectively leverage Generative AI.',
        whatYoullLearn: [
          'Analyze data using spreadsheets, SQL, and R programming',
          'Create visualizations and dashboards using Tableau',
          'Apply statistical analysis and hypothesis testing',
          'Clean and organize data for analysis',
          'Present findings through compelling storytelling',
          'Understand the data analytics process from start to finish'
        ],
        skillsYoullGain: ['Data Analysis', 'Statistical Analysis', 'Data Visualization', 'SQL', 'Tableau', 'R Programming', 'Spreadsheets', 'Data Cleaning'],
        requirements: [
          'No prior experience required',
          'Basic computer skills',
          'Access to a computer with internet connection',
          'Willingness to learn and practice'
        ]
      };
      this.isLoading = false;
    } else {
      // Fallback to mock data if course not found in service
      setTimeout(() => {
        this.course = {
          id: courseId,
          title: 'Google Data Analytics',
          provider: 'Google',
          providerLogo: 'https://cdn-icons-png.flaticon.com/512/300/300221.png',
          thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
          rating: 4.8,
          reviews: 1276,
          enrollments: '45,908 already enrolled',
          difficulty: 'Beginner Level',
          duration: '05 Weeks',
          progress: 0,
          isEnrolled: false,
          isCompleted: false,
          price: 'Free',
          tags: ['Data Analysis', 'Statistics', 'Excel', 'Tableau'],
          category: 'Data Science',
          publishedDate: '2024-01-15',
          description: 'Become a Prompt Engineering Expert. Master prompt engineering patterns, techniques, and approaches to effectively leverage Generative AI.',
          whatYoullLearn: [
            'Analyze data using spreadsheets, SQL, and R programming',
            'Create visualizations and dashboards using Tableau',
            'Apply statistical analysis and hypothesis testing',
            'Clean and organize data for analysis',
            'Present findings through compelling storytelling',
            'Understand the data analytics process from start to finish'
          ],
          skillsYoullGain: ['Data Analysis', 'Statistical Analysis', 'Data Visualization', 'SQL', 'Tableau', 'R Programming', 'Spreadsheets', 'Data Cleaning'],
          requirements: [
            'No prior experience required',
            'Basic computer skills',
            'Access to a computer with internet connection',
            'Willingness to learn and practice'
          ]
        };
        this.isLoading = false;
      }, 500);
    }
  }

  switchTab(tab: string) {
    this.activeTab = tab;
  }

  toggleSection(sectionId: number) {
    if (this.expandedSections.has(sectionId)) {
      this.expandedSections.delete(sectionId);
    } else {
      this.expandedSections.add(sectionId);
    }
  }

  isSectionExpanded(sectionId: number): boolean {
    return this.expandedSections.has(sectionId);
  }

  toggleAllSections() {
    if (this.allSectionsExpanded) {
      this.expandedSections.clear();
    } else {
      this.courseContent.sections.forEach(section => {
        this.expandedSections.add(section.id);
      });
    }
    this.allSectionsExpanded = !this.allSectionsExpanded;
  }

  enrollInCourse() {
    if (this.course) {
      console.log('Enrolling in course:', this.course.id);
      // Navigate to the first lecture of the course
      this.router.navigate(['/learn', this.course.id, 'lecture', 1]);
    }
  }

  getStarArray(rating: number): number[] {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(1); // Full star
      } else if (i === fullStars && hasHalfStar) {
        stars.push(0.5); // Half star
      } else {
        stars.push(0); // Empty star
      }
    }
    
    return stars;
  }

  getLectureIcon(type: string): string {
    switch (type) {
      case 'video': return '▶️';
      case 'lab': return '🔬';
      case 'project': return '📋';
      case 'quiz': return '❓';
      default: return '📄';
    }
  }

  navigateToCourse(courseId: number) {
    this.router.navigate(['/course', courseId]);
  }

  goHome() {
    this.router.navigate(['/dashboard']);
  }
}
