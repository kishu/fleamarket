import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
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
    const userGroupRef = this.authService.user.groupRef as DocumentReference;
    const goodsId = next.paramMap.get('goodsId');
    const market = next.paramMap.get('market').toUpperCase();

    return this.goodsService.getGoods(goodsId).pipe(
      first(),
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
