import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DocumentReference } from '@angular/fire/firestore';
import {Observable, of} from 'rxjs';
import {first, map, tap} from 'rxjs/operators';
import { AuthService, UserService, GoodsService } from '../../core/http';
import {Goods, Market} from '../../shared/models';


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
    const userGroupRef = this.authService.user.groupRef as DocumentReference;
    const goodsId = next.paramMap.get('goodsId');
    const market = next.paramMap.get('market').toUpperCase();
    let goods$: Observable<Goods>;

    if (this.goodsService.selectedGoods &&
      this.goodsService.selectedGoods.id === goodsId) {
      goods$ = of(this.goodsService.selectedGoods);
    } else {
      goods$ = this.goodsService.getGoods(goodsId);
    }

    return goods$.pipe(
      first(),
      tap(goods => {
        if (!this.goodsService.selectedGoods) {
          this.goodsService.selectedGoods = goods;
        }
      }),
      map(goods => {
        switch (market) {
          case Market.Group:
            return !!(goods.groupRef.id === userGroupRef.id && goods.market.group);
          case Market.Lounge:
            return goods.market.lounge;
        }
      })
    );
  }

}
