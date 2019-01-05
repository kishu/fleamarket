import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { AuthService, UserService, GoodsService } from '../../core/http';
import { Market } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class GoodsGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private goodsService: GoodsService
    ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.loginUserInfo.pipe(
      first(),
      switchMap(user => this.userService.getUser(user.uid)),
      first(),
      switchMap(user => {
        const goodsId = next.paramMap.get('goodsId');
        return forkJoin(of(user), this.goodsService.getGoods(goodsId));
      }),
      first(),
      map(([user, goods]) => {
        const market = next.paramMap.get('market').toUpperCase();
        switch (market) {
          case Market.Group:
            return !!(goods.groupRef.id === user.groupRef.id && goods.market.group);
          case Market.Lounge:
            return goods.market.lounge;
        }
      })
    );
  }
}
