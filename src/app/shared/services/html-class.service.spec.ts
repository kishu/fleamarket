import { TestBed } from '@angular/core/testing';

import { HtmlClassService } from './html-class.service';

describe('HtmlClassService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HtmlClassService = TestBed.get(HtmlClassService);
    expect(service).toBeTruthy();
  });
});
