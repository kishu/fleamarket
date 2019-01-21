import { TestBed, async, inject } from '@angular/core/testing';

import { GoodsAuthorityGuard } from './goods-authority-guard.service';

describe('GoodsAuthorityGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GoodsAuthorityGuard]
    });
  });

  it('should ...', inject([GoodsAuthorityGuard], (guard: GoodsAuthorityGuard) => {
    expect(guard).toBeTruthy();
  }));
});
