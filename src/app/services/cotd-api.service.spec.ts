import { TestBed } from '@angular/core/testing';

import { CotdAPIService } from './cotd-api.service';

describe('CotdAPIService', () => {
  let service: CotdAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CotdAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
