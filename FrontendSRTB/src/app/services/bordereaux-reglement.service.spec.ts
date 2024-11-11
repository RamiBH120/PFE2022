import { TestBed } from '@angular/core/testing';

import { BordereauxReglementService } from './bordereaux-reglement.service';

describe('BordereauxReglementService', () => {
  let service: BordereauxReglementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BordereauxReglementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
