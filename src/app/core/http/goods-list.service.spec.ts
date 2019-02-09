import { TestBed } from '@angular/core/testing';

import { GoodsListService } from './goods-list.service';

describe('GoodsListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GoodsListService = TestBed.get(GoodsListService);
    expect(service).toBeTruthy();
  });
});
