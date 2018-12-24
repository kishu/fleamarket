import { TestBed } from '@angular/core/testing';

import { CorpService } from './corp.service';

describe('CorpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CorpService = TestBed.get(CorpService);
    expect(service).toBeTruthy();
  });
});
