import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DocumentReference } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { first, map, tap } from 'rxjs/operators';
import { UserService, GoodsService } from '@app/core/http';
import { LoggedIn } from '@app/core/logged-in.service';
import { Goods } from '@app/shared/models';

@Injectable({
  providedIn: 'root'
})
export class GoodsGuard implements CanActivate {
  constructor(
    private loggedIn: LoggedIn,
    private userService: UserService,
    private goodsService: GoodsService
    ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const list = next.paramMap.get('market');
    const userGroupRef: DocumentReference = this.loggedIn.user.groupRef;
    const goodsId = next.paramMap.get('goodsId');
    const selectedGoods = this.goodsService.cachedGoods;

    let goods$: Observable<Goods>;
    if (selectedGoods && selectedGoods.id === goodsId) {
      goods$ = of(this.goodsService.cachedGoods);
    } else {
      goods$ = this.goodsService.getGoods(goodsId).pipe(
        tap(goods => this.goodsService.cachedGoods = goods)
      );
    }

    return goods$.pipe(
      first(),
      map(goods => {
        if (list === 'lounge') {
          return true;
        } else {
          return !!(goods.groupRef.id === userGroupRef.id && goods.market.group);
        }
      })
    );
  }

}
