import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService, GoodsService } from '../../core/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GoodsAuthorityGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private goodsService: GoodsService
  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const user = this.authService.user;
    const goodsId = next.paramMap.get('goodsId');

    return this.goodsService.getGoods(goodsId).pipe(
      map(goods => user.id === goods.userRef.id )
    );
  }
}
