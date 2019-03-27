import { TestBed } from '@angular/core/testing';

import { GlobalToggleService } from './global-toggle.service';

describe('GlobalToggleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GlobalToggleService = TestBed.get(GlobalToggleService);
    expect(service).toBeTruthy();
  });
});
