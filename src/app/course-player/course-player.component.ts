import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CourseService } from '../services/course.service';
import { UserService } from '../services/user.service';
import { QuizComponent } from '../quiz/quiz.component';

interface Lecture {
  id: number;
  title: string;
  duration: string;
  type: 'video' | 'pdf' | 'text' | 'quiz';
  videoUrl?: string;
  pdfUrl?: string;
  textContent?: string;
  quizData?: any;
  isCompleted: boolean;
}

interface CourseSection {
  id: number;
  title: string;
  lectureCount: number;
  duration: string;
  lectures: Lecture[];
  isExpanded?: boolean;
}

interface Course {
  id: number;
  title: string;
  instructor: string;
  description: string;
  thumbnail: string;
  sections: CourseSection[];
  totalLectures: number;
  totalDuration: string;
}

@Component({
  selector: 'app-course-player',
  standalone: true,
  imports: [CommonModule, QuizComponent],
  templateUrl: './course-player.component.html',
  styleUrl: './course-player.component.scss'
})
export class CoursePlayerComponent implements OnInit, OnDestroy {
  @ViewChild('videoPlayer', { static: false }) videoPlayer!: ElementRef<HTMLVideoElement>;

  course!: Course;
  currentLecture!: Lecture;
  courseId!: number;
  lectureId!: number;
  activeContentTab = 'overview';
  
  // Video player state
  isPlaying = false;
  currentTime = 0;
  duration = 0;
  volume = 1;
  playbackSpeed = 1;
  isFullscreen = false;
  showControls = true;
  controlsTimeout: any;
  videoReady = false;
  videoError = false;
  videoErrorMessage = '';

  // Course progress
  completedLectures = new Set<number>();

  private destroy$ = new Subject<void>();

  // Mock course data
  mockCourse: Course = {
    id: 1,
    title: 'Google Data Analytics Professional Certificate',
    instructor: 'Dr. Sarah Johnson',
    description: 'Master data analytics with hands-on projects and real-world applications.',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
    totalLectures: 25,
    totalDuration: '18h 30m',
    sections: [
      {
        id: 1,
        title: 'Introduction to Data Analytics',
        lectureCount: 4,
        duration: '2h 15m',
        isExpanded: true,
        lectures: [
          {
            id: 1,
            title: 'What is Data Analytics?',
            duration: '15m',
            type: 'video',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            isCompleted: false
          },
          {
            id: 2,
            title: 'The Data Analytics Process',
            duration: '25m',
            type: 'video',
            videoUrl: 'https://www.w3schools.com/html/movie.mp4',
            isCompleted: false
          },
          {
            id: 3,
            title: 'Tools and Technologies Overview',
            duration: '35m',
            type: 'pdf',
            pdfUrl: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
            isCompleted: false
          },
          {
            id: 4,
            title: 'Setting up Your Environment',
            duration: '20m',
            type: 'text',
            textContent: `
# Setting up Your Data Analytics Environment

## Prerequisites
Before we begin setting up your data analytics environment, ensure you have:
- A computer with at least 8GB RAM
- Stable internet connection
- Administrative privileges on your system

## Software Installation

### 1. Python Installation
Python is a fundamental tool for data analytics. Follow these steps:
1. Visit python.org
2. Download Python 3.9 or later
3. Run the installer and check "Add Python to PATH"
4. Verify installation by opening command prompt and typing: python --version

### 2. Installing Required Libraries
Open your command prompt or terminal and install these essential libraries:

\`\`\`bash
pip install pandas numpy matplotlib seaborn jupyter
\`\`\`

### 3. Jupyter Notebook Setup
Jupyter Notebook provides an interactive environment for data analysis:
1. Install Jupyter: pip install jupyter
2. Launch Jupyter: jupyter notebook
3. Your browser will open with the Jupyter interface

## Database Tools

### SQLite
For practicing SQL queries, we'll use SQLite:
1. Download SQLite from sqlite.org
2. Install SQLite Browser for a graphical interface
3. Create your first database

### Excel/Google Sheets
Ensure you have access to either:
- Microsoft Excel (desktop version preferred)
- Google Sheets (free alternative)

## Data Visualization Tools

### Tableau Public (Optional)
1. Download Tableau Public (free version)
2. Create an account
3. Complete the tutorial

## Verification
To verify your setup is complete:
1. Open Python and import pandas: import pandas as pd
2. Launch Jupyter Notebook
3. Create a new notebook and run a simple data analysis

Congratulations! Your data analytics environment is now ready.
            `,
            isCompleted: false
          }
        ]
      },
      {
        id: 2,
        title: 'Data Collection and Cleaning',
        lectureCount: 5,
        duration: '3h 45m',
        lectures: [
          {
            id: 5,
            title: 'Data Sources and Types',
            duration: '30m',
            type: 'video',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            isCompleted: false
          },
          {
            id: 6,
            title: 'Data Collection Methods',
            duration: '40m',
            type: 'video',
            videoUrl: 'https://www.w3schools.com/html/movie.mp4',
            isCompleted: false
          },
          {
            id: 7,
            title: 'Data Quality Assessment',
            duration: '45m',
            type: 'pdf',
            pdfUrl: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
            isCompleted: false
          },
          {
            id: 8,
            title: 'Data Collection Quiz',
            duration: '10m',
            type: 'quiz',
            quizData: {
              id: 1,
              title: 'Data Collection and Quality Assessment Quiz',
              questions: [
                {
                  id: 1,
                  question: 'Which of the following is NOT a common data source?',
                  options: [
                    'Databases',
                    'APIs',
                    'Social media platforms',
                    'Physical documents only'
                  ],
                  correctAnswer: 3,
                  explanation: 'While physical documents can be data sources, limiting to "only" physical documents is not common in modern data analytics where digital sources are prevalent.'
                },
                {
                  id: 2,
                  question: 'What is the most important aspect of data quality?',
                  options: [
                    'Volume of data',
                    'Accuracy and completeness',
                    'Data storage format',
                    'Collection speed'
                  ],
                  correctAnswer: 1,
                  explanation: 'Accuracy and completeness are fundamental to data quality - without these, analysis results can be misleading regardless of other factors.'
                },
                {
                  id: 3,
                  question: 'Which data collection method is best for real-time analytics?',
                  options: [
                    'Batch processing',
                    'Manual data entry',
                    'Stream processing',
                    'File uploads'
                  ],
                  correctAnswer: 2,
                  explanation: 'Stream processing allows for real-time data collection and analysis as data flows continuously from sources.'
                }
              ]
            },
            isCompleted: false
          },
          {
            id: 9,
            title: 'Hands-on: Cleaning Real Data',
            duration: '1h 20m',
            type: 'text',
            textContent: 'Lab content for data cleaning exercises...',
            isCompleted: false
          }
        ]
      }
    ]
  };

  // Mock author and testimonials data (reused from course detail)
  author = {
    name: 'Dr. Sarah Johnson',
    title: 'Senior Data Scientist at Google',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    rating: 4.8,
    students: '125,000+',
    courses: 12,
    bio: `Dr. Sarah Johnson is a Senior Data Scientist at Google with over 10 years of experience in data analytics and machine learning. She holds a Ph.D. in Statistics from Stanford University and has published numerous papers on data science methodologies.`,
    faqs: [
      {
        question: 'What makes this course different?',
        answer: 'This course focuses on practical, real-world applications with hands-on projects using actual industry datasets.'
      },
      {
        question: 'Do I need prior programming experience?',
        answer: 'No programming experience is required. We start with the basics and gradually build up your skills.'
      }
    ]
  };

  testimonials = [
    {
      id: 1,
      rating: 5,
      text: 'This course completely changed my career trajectory. The practical approach made complex concepts easy to understand.',
      reviewer: {
        name: 'Michael Chen',
        title: 'Data Analyst at Microsoft',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face'
      }
    },
    {
      id: 2,
      rating: 5,
      text: 'Sarah\'s teaching style is exceptional. The hands-on projects were particularly valuable.',
      reviewer: {
        name: 'Emily Rodriguez',
        title: 'Business Intelligence Developer',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face'
      }
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.route.params.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      this.courseId = +params['courseId'];
      this.lectureId = +params['lectureId'];
      this.loadCourse();
      this.loadCompletedLectures();
    });

    // Hide controls after 3 seconds of inactivity
    this.setupControlsTimeout();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.controlsTimeout) {
      clearTimeout(this.controlsTimeout);
    }
  }

  private loadCourse() {
    // In a real app, this would fetch from the service
    this.course = this.mockCourse;
    this.loadCurrentLecture();
  }

  private loadCurrentLecture() {
    if (this.course) {
      for (const section of this.course.sections) {
        const lecture = section.lectures.find(l => l.id === this.lectureId);
        if (lecture) {
          this.currentLecture = lecture;
          // Reset video state when switching lectures
          this.resetVideoState();
          break;
        }
      }
    }
  }

  private resetVideoState() {
    this.videoReady = false;
    this.videoError = false;
    this.videoErrorMessage = '';
    this.isPlaying = false;
    this.currentTime = 0;
    this.duration = 0;
  }

  private loadCompletedLectures() {
    // Load from localStorage
    const completed = localStorage.getItem(`course-${this.courseId}-completed`);
    if (completed) {
      this.completedLectures = new Set(JSON.parse(completed));
    }
  }

  private saveCompletedLectures() {
    localStorage.setItem(
      `course-${this.courseId}-completed`,
      JSON.stringify(Array.from(this.completedLectures))
    );
  }

  // Video Player Controls
  togglePlay() {
    if (!this.videoPlayer) return;
    
    if (this.isPlaying) {
      this.videoPlayer.nativeElement.pause();
    } else {
      this.videoPlayer.nativeElement.play();
    }
    this.isPlaying = !this.isPlaying;
  }

  onVideoTimeUpdate() {
    if (!this.videoPlayer) return;
    this.currentTime = this.videoPlayer.nativeElement.currentTime;
  }

  onVideoLoadedMetadata() {
    if (!this.videoPlayer) return;
    this.duration = this.videoPlayer.nativeElement.duration;
    this.videoReady = true;
    this.videoError = false;
  }

  onVideoCanPlay() {
    this.videoReady = true;
    this.videoError = false;
  }

  onVideoError(event: any) {
    console.error('Video error:', event);
    this.videoError = true;
    this.videoReady = false;
    
    const error = event.target.error;
    switch(error?.code) {
      case 1:
        this.videoErrorMessage = 'Video loading was aborted.';
        break;
      case 2:
        this.videoErrorMessage = 'Network error while loading video.';
        break;
      case 3:
        this.videoErrorMessage = 'Video format not supported.';
        break;
      case 4:
        this.videoErrorMessage = 'Video source not available.';
        break;
      default:
        this.videoErrorMessage = 'An unknown error occurred while loading the video.';
    }
  }

  retryVideo() {
    if (this.videoPlayer && this.currentLecture?.videoUrl) {
      this.resetVideoState();
      this.videoPlayer.nativeElement.load();
    }
  }

  onVideoEnded() {
    this.isPlaying = false;
    this.markLectureCompleted(this.lectureId);
    this.goToNextLecture();
  }

  seekTo(event: any) {
    if (!this.videoPlayer) return;
    const rect = event.target.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    const newTime = percentage * this.duration;
    this.videoPlayer.nativeElement.currentTime = newTime;
    this.currentTime = newTime;
  }

  setVolume(event: any) {
    this.volume = event.target.value;
    if (this.videoPlayer) {
      this.videoPlayer.nativeElement.volume = this.volume;
    }
  }

  setPlaybackSpeed(speed: number) {
    this.playbackSpeed = speed;
    if (this.videoPlayer) {
      this.videoPlayer.nativeElement.playbackRate = speed;
    }
  }

  toggleFullscreen() {
    if (!this.videoPlayer) return;
    
    if (!this.isFullscreen) {
      if (this.videoPlayer.nativeElement.requestFullscreen) {
        this.videoPlayer.nativeElement.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    this.isFullscreen = !this.isFullscreen;
  }

  // Controls visibility
  showVideoControls() {
    this.showControls = true;
    this.setupControlsTimeout();
  }

   setupControlsTimeout() {
    if (this.controlsTimeout) {
      clearTimeout(this.controlsTimeout);
    }
    this.controlsTimeout = setTimeout(() => {
      if (this.isPlaying) {
        this.showControls = false;
      }
    }, 3000);
  }

  // Course Navigation
  toggleSection(sectionId: number) {
    if (this.course) {
      const section = this.course.sections.find(s => s.id === sectionId);
      if (section) {
        section.isExpanded = !section.isExpanded;
      }
    }
  }

  goToLecture(lectureId: number) {
    this.router.navigate(['/learn', this.courseId, 'lecture', lectureId]);
  }

  goToNextLecture() {
    if (!this.course) return;
    
    let currentFound = false;
    let nextLecture: Lecture | null = null;
    
    for (const section of this.course.sections) {
      for (const lecture of section.lectures) {
        if (currentFound) {
          nextLecture = lecture;
          break;
        }
        if (lecture.id === this.lectureId) {
          currentFound = true;
        }
      }
      if (nextLecture) break;
    }
    
    if (nextLecture) {
      this.goToLecture(nextLecture.id);
    }
  }

  goToPreviousLecture() {
    if (!this.course) return;
    
    let previousLecture: Lecture | null = null;
    
    for (const section of this.course.sections) {
      for (const lecture of section.lectures) {
        if (lecture.id === this.lectureId && previousLecture) {
          this.goToLecture(previousLecture.id);
          return;
        }
        previousLecture = lecture;
      }
    }
  }

  markLectureCompleted(lectureId: number) {
    this.completedLectures.add(lectureId);
    this.saveCompletedLectures();
  }

  isLectureCompleted(lectureId: number): boolean {
    return this.completedLectures.has(lectureId);
  }

  isCurrentLecture(lectureId: number): boolean {
    return this.lectureId === lectureId;
  }

  // Content tabs
  switchContentTab(tab: string) {
    this.activeContentTab = tab;
  }

  // Utility methods
  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  getProgressPercentage(): number {
    if (this.duration === 0) return 0;
    return (this.currentTime / this.duration) * 100;
  }

  getLectureIcon(type: string): string {
    switch (type) {
      case 'video': return '▶️';
      case 'pdf': return '📄';
      case 'text': return '📝';
      case 'quiz': return '❓';
      default: return '📄';
    }
  }

  getStarArray(rating: number): number[] {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < Math.floor(rating)) {
        stars.push(1); // Full star
      } else if (i === Math.floor(rating) && rating % 1 >= 0.5) {
        stars.push(0.5); // Half star
      } else {
        stars.push(0); // Empty star
      }
    }
    return stars;
  }

  goBackToCourse() {
    this.router.navigate(['/course', this.courseId]);
  }

  // Quiz handling
  onQuizCompleted(result: { score: number; passed: boolean }) {
    console.log('Quiz completed:', result);
    if (result.passed) {
      this.markLectureCompleted(this.lectureId);
    }
    // You could show a success message or navigate to next lecture
  }
}
