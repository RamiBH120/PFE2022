import { TestBed } from '@angular/core/testing';

import { ActeBSService } from './acte-bs.service';

describe('ActeBSService', () => {
  let service: ActeBSService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActeBSService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
