import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BordereauxReglementComponent } from './bordereaux-reglement.component';

describe('BorderauxReglementComponent', () => {
  let component: BordereauxReglementComponent;
  let fixture: ComponentFixture<BordereauxReglementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BordereauxReglementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BordereauxReglementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
