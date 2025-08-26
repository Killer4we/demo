import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Random } from './random';

describe('Random', () => {
  let component: Random;
  let fixture: ComponentFixture<Random>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Random]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Random);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
