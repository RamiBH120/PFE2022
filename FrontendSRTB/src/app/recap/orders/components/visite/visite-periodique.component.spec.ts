import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitePeriodiqueComponentComponent } from './visite-periodique.component';

describe('VisitePeriodiqueComponentComponent', () => {
  let component: VisitePeriodiqueComponentComponent;
  let fixture: ComponentFixture<VisitePeriodiqueComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitePeriodiqueComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitePeriodiqueComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
