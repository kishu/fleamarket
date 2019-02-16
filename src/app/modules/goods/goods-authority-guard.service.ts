import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { SignInService } from '@app/core/sign-in.service';
import { GoodsService } from '@app/core/http';

@Injectable({
  providedIn: 'root'
})
export class GoodsAuthorityGuard implements CanActivate {
  constructor(
    private signIn: SignInService,
    private goodsService: GoodsService
  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const user = this.signIn.user;
    const goodsId = next.paramMap.get('goodsId');

    if (goodsId === 'new') {
      return of(true);
    } else {
      return this.goodsService.getGoods(goodsId).pipe(
        tap(g => this.goodsService.cachedGoods = g),
        map(g => user.id === g.userRef.id)
      );
    }
  }
}
