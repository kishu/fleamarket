import { TestBed } from '@angular/core/testing';

import { GoodsListService } from './goods-list.service';

describe('Goods2Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GoodsListService = TestBed.get(GoodsListService);
    expect(service).toBeTruthy();
  });
});
