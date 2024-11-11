import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BordereauxEnvoiComponent } from './bordereaux-envoi.component';

describe('BordereauxEnvoiComponent', () => {
  let component: BordereauxEnvoiComponent;
  let fixture: ComponentFixture<BordereauxEnvoiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BordereauxEnvoiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BordereauxEnvoiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
