import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent {
  @Input() statistics = {
    myGoals: 3,
    enrolledCourses: 8,
    certificatesEarned: 2
  };

  statisticsData = [
    {
      title: 'My Goals',
      value: this.statistics.myGoals,
      icon: 'fas fa-bullseye',
      color: '#3498db',
      action: 'View All'
    },
    {
      title: 'Enrolled Courses',
      value: this.statistics.enrolledCourses,
      icon: 'fas fa-book',
      color: '#2ecc71',
      action: 'View All'
    },
    {
      title: 'Certificates Earned',
      value: this.statistics.certificatesEarned,
      icon: 'fas fa-certificate',
      color: '#f39c12',
      action: 'Download'
    }
  ];

  ngOnInit() {
    // Update values from input
    this.statisticsData[0].value = this.statistics.myGoals;
    this.statisticsData[1].value = this.statistics.enrolledCourses;
    this.statisticsData[2].value = this.statistics.certificatesEarned;
  }

  onStatisticClick(statistic: any) {
    console.log('Statistic clicked:', statistic);
    // Implement navigation or action based on statistic type
  }
}
