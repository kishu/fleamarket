import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Goods} from '../../shared/models';
import {Observable} from 'rxjs';
import {GoodsService} from '../../core/http';

@Injectable()
export class GoodsResolver implements Resolve<Goods> {
  constructor(private goodsService: GoodsService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<Goods> {
    return Observable.create(observer => {
      const goodsId = route.paramMap.get('goodsId');
      this.goodsService.getGoods(goodsId).subscribe(goods => {
        observer.next(goods);
        observer.complete();
      });
    });
  }

}
