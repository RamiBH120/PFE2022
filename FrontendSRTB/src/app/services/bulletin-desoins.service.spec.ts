import { TestBed } from '@angular/core/testing';

import { BulletinDesoinsService } from './bulletin-desoins.service';

describe('BulletinDesoinsService', () => {
  let service: BulletinDesoinsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BulletinDesoinsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
