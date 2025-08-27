import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private lastViewedCourses = [
    {
      id: 1,
      title: 'Google Data Analytics',
      provider: 'Google',
      providerLogo: 'https://cdn-icons-png.flaticon.com/512/300/300221.png',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop&crop=center',
      rating: 4.3,
      reviews: 1156,
      enrollments: '635 Enrolled',
      difficulty: 'Beginner',
      duration: '6 months',
      progress: 21,
      isEnrolled: true,
      isCompleted: false,
      price: 'Free',
      tags: ['Data Analysis', 'Statistics', 'Excel', 'Tableau']
    },
    {
      id: 2,
      title: 'Big Data Analytics',
      provider: 'IBM',
      providerLogo: 'https://cdn-icons-png.flaticon.com/512/732/732221.png',
      thumbnail: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=200&fit=crop&crop=center',
      rating: 4.5,
      reviews: 892,
      enrollments: '412 Enrolled',
      difficulty: 'Advanced',
      duration: '8 months',
      progress: 45,
      isEnrolled: true,
      isCompleted: false,
      price: '$49/month',
      tags: ['Big Data', 'Hadoop', 'Spark', 'Python']
    },
    {
      id: 3,
      title: 'Google Data Analytics',
      provider: 'Google',
      providerLogo: 'https://cdn-icons-png.flaticon.com/512/300/300221.png',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop&crop=center',
      rating: 4.8,
      reviews: 2341,
      enrollments: '1.2k Enrolled',
      difficulty: 'Intermediate',
      duration: '4 months',
      progress: 78,
      isEnrolled: true,
      isCompleted: false,
      price: 'Free',
      tags: ['Analytics', 'SQL', 'Data Visualization']
    },
    {
      id: 4,
      title: 'Google Data Analytics',
      provider: 'Google',
      providerLogo: 'https://cdn-icons-png.flaticon.com/512/300/300221.png',
      thumbnail: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400&h=200&fit=crop&crop=center',
      rating: 4.2,
      reviews: 567,
      enrollments: '345 Enrolled',
      difficulty: 'Beginner',
      duration: '3 months',
      progress: 100,
      isEnrolled: true,
      isCompleted: true,
      price: 'Free',
      tags: ['Data Science', 'R', 'Statistics']
    },
    {
      id: 5,
      title: 'Google Cloud Platform',
      provider: 'Google',
      providerLogo: 'https://cdn-icons-png.flaticon.com/512/300/300221.png',
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop&crop=center',
      rating: 4.6,
      reviews: 1423,
      enrollments: '876 Enrolled',
      difficulty: 'Intermediate',
      duration: '5 months',
      progress: 33,
      isEnrolled: true,
      isCompleted: false,
      price: '$39/month',
      tags: ['Cloud Computing', 'GCP', 'DevOps']
    }
  ];

  private newlyLaunchedCourses = [
    {
      id: 6,
      title: 'Machine Learning Fundamentals',
      provider: 'Stanford Online',
      providerLogo: 'https://cdn-icons-png.flaticon.com/512/906/906334.png',
      thumbnail: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc?w=400&h=200&fit=crop&crop=center',
      rating: 4.7,
      reviews: 234,
      enrollments: '156 Enrolled',
      difficulty: 'Intermediate',
      duration: '6 months',
      isEnrolled: false,
      isCompleted: false,
      price: '$79/month',
      tags: ['Machine Learning', 'Python', 'AI', 'Algorithms']
    },
    {
      id: 7,
      title: 'React Advanced Patterns',
      provider: 'LinkedIn Learning',
      providerLogo: 'https://cdn-icons-png.flaticon.com/512/174/174857.png',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=200&fit=crop&crop=center',
      rating: 4.4,
      reviews: 445,
      enrollments: '289 Enrolled',
      difficulty: 'Advanced',
      duration: '4 months',
      isEnrolled: false,
      isCompleted: false,
      price: '$29.99/month',
      tags: ['React', 'JavaScript', 'Frontend', 'Hooks']
    },
    {
      id: 8,
      title: 'AWS Cloud Practitioner',
      provider: 'Amazon Web Services',
      providerLogo: 'https://cdn-icons-png.flaticon.com/512/873/873120.png',
      thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=200&fit=crop&crop=center',
      rating: 4.5,
      reviews: 678,
      enrollments: '432 Enrolled',
      difficulty: 'Beginner',
      duration: '3 months',
      isEnrolled: false,
      isCompleted: false,
      price: 'Free',
      tags: ['AWS', 'Cloud', 'Infrastructure', 'Certification']
    },
    {
      id: 9,
      title: 'Cybersecurity Fundamentals',
      provider: 'Cisco Networking Academy',
      providerLogo: 'https://cdn-icons-png.flaticon.com/512/2092/2092063.png',
      thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=200&fit=crop&crop=center',
      rating: 4.3,
      reviews: 512,
      enrollments: '367 Enrolled',
      difficulty: 'Intermediate',
      duration: '7 months',
      isEnrolled: false,
      isCompleted: false,
      price: '$59/month',
      tags: ['Cybersecurity', 'Network Security', 'Ethical Hacking']
    },
    {
      id: 10,
      title: 'UX/UI Design Masterclass',
      provider: 'Adobe',
      providerLogo: 'https://cdn-icons-png.flaticon.com/512/5968/5968520.png',
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=200&fit=crop&crop=center',
      rating: 4.8,
      reviews: 891,
      enrollments: '654 Enrolled',
      difficulty: 'Beginner',
      duration: '5 months',
      isEnrolled: false,
      isCompleted: false,
      price: '$49/month',
      tags: ['UX Design', 'UI Design', 'Figma', 'Adobe XD']
    }
  ];

  getLastViewedCourses() {
    return this.lastViewedCourses;
  }

  getNewlyLaunchedCourses() {
    return this.newlyLaunchedCourses;
  }

  searchCourses(query: string, extended: boolean = false) {
    const allCourses = [...this.lastViewedCourses, ...this.newlyLaunchedCourses];
    const results = allCourses
      .filter(course => 
        course.title.toLowerCase().includes(query.toLowerCase()) ||
        course.provider.toLowerCase().includes(query.toLowerCase()) ||
        course.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
    
    if (extended) {
      // Return more comprehensive results for search results page
      return this.generateExtendedResults(query, results);
    }
    
    return results.slice(0, 5); // Limit to 5 suggestions for autocomplete
  }

  private generateExtendedResults(query: string, baseResults: any[]) {
    // Add more mock courses for demonstration
    const extendedCourses = [
      ...baseResults,
      {
        id: 11,
        title: 'Advanced Python Programming',
        provider: 'MIT',
        providerLogo: 'https://cdn-icons-png.flaticon.com/512/906/906334.png',
        thumbnail: 'https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?w=400&h=200&fit=crop&crop=center',
        rating: 4.7,
        reviews: 1234,
        enrollments: '2.3k Enrolled',
        difficulty: 'Advanced',
        duration: '8 months',
        isEnrolled: false,
        isCompleted: false,
        price: '$99/month',
        tags: ['Python', 'Advanced Programming', 'AI', 'Data Science']
      },
      {
        id: 12,
        title: 'Python for Beginners',
        provider: 'CodeAcademy',
        providerLogo: 'https://cdn-icons-png.flaticon.com/512/906/906334.png',
        thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&h=200&fit=crop&crop=center',
        rating: 4.2,
        reviews: 892,
        enrollments: '1.8k Enrolled',
        difficulty: 'Beginner',
        duration: '2 weeks',
        isEnrolled: false,
        isCompleted: false,
        price: 'Free',
        tags: ['Python', 'Programming', 'Beginner']
      },
      {
        id: 13,
        title: 'Python Web Development',
        provider: 'Django Foundation',
        providerLogo: 'https://cdn-icons-png.flaticon.com/512/906/906334.png',
        thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop&crop=center',
        rating: 4.5,
        reviews: 667,
        enrollments: '1.2k Enrolled',
        difficulty: 'Intermediate',
        duration: '5 months',
        isEnrolled: false,
        isCompleted: false,
        price: '$79/month',
        tags: ['Python', 'Web Development', 'Django', 'Backend']
      },
      {
        id: 14,
        title: 'Python Data Analysis',
        provider: 'Pandas Foundation',
        providerLogo: 'https://cdn-icons-png.flaticon.com/512/906/906334.png',
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop&crop=center',
        rating: 4.6,
        reviews: 1445,
        enrollments: '3.1k Enrolled',
        difficulty: 'Intermediate',
        duration: '4 months',
        isEnrolled: false,
        isCompleted: false,
        price: '$59/month',
        tags: ['Python', 'Data Analysis', 'Pandas', 'NumPy', 'AI']
      }
    ];

    // Filter based on query relevance
    return extendedCourses.filter(course => 
      course.title.toLowerCase().includes(query.toLowerCase()) ||
      course.provider.toLowerCase().includes(query.toLowerCase()) ||
      course.tags.some((tag: string) => tag.toLowerCase().includes(query.toLowerCase()))
 ||
      course.difficulty.toLowerCase().includes(query.toLowerCase())
    );
  }

  getCourseById(id: number) {
    const allCourses = [...this.lastViewedCourses, ...this.newlyLaunchedCourses];
    return allCourses.find(course => course.id === id);
  }
}
