import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface Quiz {
  id: number;
  title: string;
  questions: QuizQuestion[];
}

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="quiz-container" *ngIf="quiz">
      <div class="quiz-header">
        <h3>{{ quiz.title }}</h3>
        <div class="quiz-progress">
          Question {{ currentQuestionIndex + 1 }} of {{ quiz.questions.length }}
        </div>
      </div>

      <div class="quiz-content" *ngIf="!showResults">
        <div class="question-card" *ngIf="currentQuestion">
          <h4 class="question-text">{{ currentQuestion.question }}</h4>
          
          <div class="options-list">
            <button 
              *ngFor="let option of currentQuestion.options; let i = index"
              class="option-btn"
              [class.selected]="selectedAnswer === i"
              [class.correct]="showAnswer && i === currentQuestion.correctAnswer"
              [class.incorrect]="showAnswer && selectedAnswer === i && i !== currentQuestion.correctAnswer"
              [disabled]="showAnswer"
              (click)="selectAnswer(i)">
              {{ option }}
            </button>
          </div>

          <div class="explanation" *ngIf="showAnswer && currentQuestion.explanation">
            <h5>Explanation:</h5>
            <p>{{ currentQuestion.explanation }}</p>
          </div>

          <div class="quiz-actions">
            <button 
              class="submit-btn"
              [disabled]="selectedAnswer === null"
              *ngIf="!showAnswer"
              (click)="submitAnswer()">
              Submit Answer
            </button>

            <button 
              class="next-btn"
              *ngIf="showAnswer && !isLastQuestion"
              (click)="nextQuestion()">
              Next Question
            </button>

            <button 
              class="finish-btn"
              *ngIf="showAnswer && isLastQuestion"
              (click)="finishQuiz()">
              Finish Quiz
            </button>
          </div>
        </div>
      </div>

      <div class="quiz-results" *ngIf="showResults">
        <div class="results-header">
          <i class="fas fa-trophy" *ngIf="score >= 80"></i>
          <i class="fas fa-medal" *ngIf="score >= 60 && score < 80"></i>
          <i class="fas fa-thumbs-up" *ngIf="score < 60"></i>
          <h3>Quiz Complete!</h3>
        </div>

        <div class="score-display">
          <div class="score-circle">
            <span class="score-percentage">{{ score }}%</span>
          </div>
          <p class="score-text">
            You got {{ correctAnswers }} out of {{ quiz.questions.length }} questions correct.
          </p>
        </div>

        <div class="results-actions">
          <button class="retake-btn" (click)="retakeQuiz()">
            <i class="fas fa-redo"></i>
            Retake Quiz
          </button>
          <button class="continue-btn" (click)="continueToNext()">
            <i class="fas fa-arrow-right"></i>
            Continue Learning
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .quiz-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .quiz-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e2e8f0;

      h3 {
        font-size: 1.5rem;
        font-weight: 600;
        color: #1e293b;
        margin: 0;
      }

      .quiz-progress {
        font-size: 0.875rem;
        color: #64748b;
        font-weight: 500;
      }
    }

    .question-card {
      .question-text {
        font-size: 1.25rem;
        font-weight: 600;
        color: #1e293b;
        margin: 0 0 2rem;
        line-height: 1.5;
      }
    }

    .options-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .option-btn {
      padding: 1rem 1.5rem;
      border: 2px solid #e2e8f0;
      background: #ffffff;
      border-radius: 8px;
      font-size: 1rem;
      text-align: left;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover:not(:disabled) {
        border-color: #3b82f6;
        background: #f8fafc;
      }

      &.selected {
        border-color: #3b82f6;
        background: #eff6ff;
      }

      &.correct {
        border-color: #10b981;
        background: #ecfdf5;
        color: #065f46;
      }

      &.incorrect {
        border-color: #ef4444;
        background: #fef2f2;
        color: #991b1b;
      }

      &:disabled {
        cursor: not-allowed;
        opacity: 0.7;
      }
    }

    .explanation {
      padding: 1.5rem;
      background: #f8fafc;
      border-radius: 8px;
      border-left: 4px solid #3b82f6;
      margin-bottom: 2rem;

      h5 {
        font-size: 1rem;
        font-weight: 600;
        color: #1e293b;
        margin: 0 0 0.5rem;
      }

      p {
        color: #64748b;
        margin: 0;
        line-height: 1.5;
      }
    }

    .quiz-actions {
      display: flex;
      justify-content: center;
      gap: 1rem;
    }

    .submit-btn, .next-btn, .finish-btn {
      padding: 0.75rem 2rem;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .submit-btn {
      background: #3b82f6;
      color: white;

      &:hover:not(:disabled) {
        background: #2563eb;
      }

      &:disabled {
        background: #cbd5e1;
        cursor: not-allowed;
      }
    }

    .next-btn, .finish-btn {
      background: #10b981;
      color: white;

      &:hover {
        background: #059669;
      }
    }

    .quiz-results {
      text-align: center;

      .results-header {
        margin-bottom: 2rem;

        i {
          font-size: 3rem;
          margin-bottom: 1rem;
          
          &.fa-trophy {
            color: #fbbf24;
          }
          
          &.fa-medal {
            color: #a78bfa;
          }
          
          &.fa-thumbs-up {
            color: #3b82f6;
          }
        }

        h3 {
          font-size: 2rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }
      }

      .score-display {
        margin-bottom: 3rem;

        .score-circle {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;

          .score-percentage {
            font-size: 2rem;
            font-weight: bold;
            color: white;
          }
        }

        .score-text {
          font-size: 1.125rem;
          color: #64748b;
          margin: 0;
        }
      }

      .results-actions {
        display: flex;
        justify-content: center;
        gap: 1rem;
      }

      .retake-btn, .continue-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .retake-btn {
        background: #6b7280;
        color: white;

        &:hover {
          background: #4b5563;
        }
      }

      .continue-btn {
        background: #10b981;
        color: white;

        &:hover {
          background: #059669;
        }
      }
    }

    @media (max-width: 768px) {
      .quiz-container {
        padding: 1rem;
        margin: 1rem;
      }

      .quiz-header {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }

      .quiz-actions {
        flex-direction: column;
        align-items: stretch;
      }

      .results-actions {
        flex-direction: column;
        align-items: stretch;
      }
    }
  `]
})
export class QuizComponent {
  @Input() quiz: Quiz | null = null;
  @Output() quizCompleted = new EventEmitter<{ score: number; passed: boolean }>();

  currentQuestionIndex = 0;
  selectedAnswer: number | null = null;
  showAnswer = false;
  showResults = false;
  answers: number[] = [];
  correctAnswers = 0;
  score = 0;

  get currentQuestion(): QuizQuestion | null {
    return this.quiz ? this.quiz.questions[this.currentQuestionIndex] : null;
  }

  get isLastQuestion(): boolean {
    return this.quiz ? this.currentQuestionIndex === this.quiz.questions.length - 1 : false;
  }

  selectAnswer(answerIndex: number) {
    this.selectedAnswer = answerIndex;
  }

  submitAnswer() {
    if (this.selectedAnswer === null || !this.currentQuestion) return;

    this.answers[this.currentQuestionIndex] = this.selectedAnswer;
    
    if (this.selectedAnswer === this.currentQuestion.correctAnswer) {
      this.correctAnswers++;
    }

    this.showAnswer = true;
  }

  nextQuestion() {
    this.currentQuestionIndex++;
    this.selectedAnswer = null;
    this.showAnswer = false;
  }

  finishQuiz() {
    this.score = Math.round((this.correctAnswers / this.quiz!.questions.length) * 100);
    this.showResults = true;
    
    const passed = this.score >= 60; // 60% passing score
    this.quizCompleted.emit({ score: this.score, passed });
  }

  retakeQuiz() {
    this.currentQuestionIndex = 0;
    this.selectedAnswer = null;
    this.showAnswer = false;
    this.showResults = false;
    this.answers = [];
    this.correctAnswers = 0;
    this.score = 0;
  }

  continueToNext() {
    // This would typically navigate to the next lecture or course content
    console.log('Continue to next content');
  }
}
