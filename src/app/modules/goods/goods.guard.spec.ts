import { TestBed, async, inject } from '@angular/core/testing';

import { GoodsGuard } from './goods.guard';

describe('GoodsGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GoodsGuard]
    });
  });

  it('should ...', inject([GoodsGuard], (guard: GoodsGuard) => {
    expect(guard).toBeTruthy();
  }));
});
