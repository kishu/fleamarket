import { TestBed } from '@angular/core/testing';

import { SendgridService } from './sendgrid.service';

describe('SendgridService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SendgridService = TestBed.get(SendgridService);
    expect(service).toBeTruthy();
  });
});
