import { TestBed } from '@angular/core/testing';

import { ActemedicalService } from './actemedical.service';

describe('ActemedicalService', () => {
  let service: ActemedicalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActemedicalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
