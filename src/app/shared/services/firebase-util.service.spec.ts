import { TestBed } from '@angular/core/testing';

import { FirebaseUtilService } from './firebase-util.service';

describe('FirebaseUtilService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FirebaseUtilService = TestBed.get(FirebaseUtilService);
    expect(service).toBeTruthy();
  });
});
