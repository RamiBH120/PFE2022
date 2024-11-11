import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActesmedicauxComponent } from './actesmedicaux.component';

describe('ActesmedicauxComponent', () => {
  let component: ActesmedicauxComponent;
  let fixture: ComponentFixture<ActesmedicauxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActesmedicauxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActesmedicauxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
