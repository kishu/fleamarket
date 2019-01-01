import { TestBed } from '@angular/core/testing';

import { GoodsService } from './goods.service';

describe('GoodsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GoodsService = TestBed.get(GoodsService);
    expect(service).toBeTruthy();
  });
});
