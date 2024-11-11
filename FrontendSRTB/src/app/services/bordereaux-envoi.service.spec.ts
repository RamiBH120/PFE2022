import { TestBed } from '@angular/core/testing';

import { BordereauxEnvoiService } from './bordereaux-envoi.service';

describe('BordereauxEnvoiService', () => {
  let service: BordereauxEnvoiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BordereauxEnvoiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
