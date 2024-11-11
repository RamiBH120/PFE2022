import { TestBed } from '@angular/core/testing';

import { NgModalService } from './ng-modal.service';

describe('NgModalService', () => {
  let service: NgModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
