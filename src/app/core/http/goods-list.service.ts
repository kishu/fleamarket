import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { LoggedIn } from '@app/core/logged-in.service';
import { FirebaseUtilService, FirebaseQueryBuilderOptions } from '@app/shared/services';
import { Goods } from '@app/shared/models';

export interface GoodsListFilter {
  market: string;
  exceptSoldOut: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class GoodsListService {
  goodsList$ = new BehaviorSubject<Goods[]>([]);
  private goodsListFilter: GoodsListFilter;
  private goodsListFilter$: Subject<GoodsListFilter> = new Subject();

  constructor(
    private afs: AngularFirestore,
    private loggedIn: LoggedIn
  ) {
    this.goodsListFilter$.pipe(
      filter(goodsListfilter => !!goodsListfilter),
      tap(goodsListfilter => this.goodsListFilter = goodsListfilter),
      switchMap(goodsListFilter => {
        console.log(goodsListFilter);
        if (goodsListFilter.market === 'group') {
          return this.getGoods$ByGroup(this.loggedIn.user.groupRef, goodsListFilter.exceptSoldOut);
        } else if (goodsListFilter.market === 'lounge') {
          return this.getGoods$ByLounge(goodsListFilter.exceptSoldOut);
        }
      })
    ).subscribe(goodsList => {
      console.log(goodsList);
      this.goodsList$.next(goodsList);
    });
  }

  updateGoodsListFilter(goodsListFilter: GoodsListFilter) {
    if (!Object.is(this.goodsListFilter, goodsListFilter)) {
      this.goodsListFilter$.next(goodsListFilter);
    }
  }

  private getGoods$ByGroup(groupRef: DocumentReference, exceptSoldout: boolean) {
    const options: FirebaseQueryBuilderOptions = {
      where: [
        ['groupRef', '==', groupRef],
        ['market.group', '==', true],
      ],
      orderBy: [
        ['updated', 'desc']
      ]
    };

    if (exceptSoldout) {
      options.where.push(['soldout', '==', false]);
    }

    return this.getGoods$(options);
  }

  private getGoods$ByLounge(exceptSoldout: boolean) {
    const options: FirebaseQueryBuilderOptions = {
      where: [
        ['market.lounge', '==', true],
      ],
      orderBy: [
        ['updated', 'desc']
      ]
    };

    if (exceptSoldout) {
      options.where.push(['soldout', '==', false]);
    }

    return this.getGoods$(options);
  }

  private getGoods$(options: FirebaseQueryBuilderOptions) {
    return this.afs.collection(
      'goods',
      ref => FirebaseUtilService.buildQuery(ref, options)
    ).snapshotChanges().pipe(
      map(FirebaseUtilService.sirializeDocumentChangeActions)
    );
  }

}
