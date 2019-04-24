import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DocumentReference } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { first, map, tap } from 'rxjs/operators';
import { AuthService, GoodsService } from '@app/core/http';
import { Goods } from '@app/core/models';

@Injectable({
  providedIn: 'root'
})
export class GoodsGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private goodsService: GoodsService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const userGroupRef: DocumentReference = this.auth.user.groupRef;
    const goodsId = next.paramMap.get('goodsId');
    const selectedGoods = this.goodsService.cachedGoods;

    let goods$: Observable<Goods>;
    if (selectedGoods && selectedGoods.id === goodsId) {
      goods$ = of(this.goodsService.cachedGoods);
    } else {
      goods$ = this.goodsService.getGoods(goodsId).pipe(
        first(),
        tap(goods => this.goodsService.cachedGoods = goods)
      );
    }

    return goods$.pipe(
      map(goods => {
        if (goods.public) {
          return true;
        } else {
          return goods.groupRef.isEqual(userGroupRef);
        }
      })
    );
  }

}
