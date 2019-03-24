import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Goods, Market } from '@app/core/models';
import { firestore } from 'firebase';
import { AngularFirestore, DocumentReference, QueryFn } from '@angular/fire/firestore';
import { filter, map, pairwise, switchMap, withLatestFrom } from 'rxjs/operators';
import { Dispatcher } from '@app/shared/utils/snapshot-dispatcher';
import { AuthService } from '@app/core/http/auth.service';

export interface GoodsListQuery {
  market: Market;
  exceptSoldOut: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class GoodsListService {
  forceUpdate = false;
  goodsList$ = new BehaviorSubject<Goods[] | null>(null);
  more$ = new BehaviorSubject<firestore.Timestamp | null>(null);

  query$: BehaviorSubject<GoodsListQuery> = new BehaviorSubject({
    market: null,
    exceptSoldOut: null,
  });

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService
  ) {
    this.query$.asObservable().pipe(
      pairwise(),
      filter(([p, n]) => (
        this.forceUpdate ||
        (p.market !== n.market) || (p.exceptSoldOut !== n.exceptSoldOut))
      ),
      switchMap(([, n]) => this.getGoodsListBy(n.market, n.exceptSoldOut))
    ).subscribe(goodsList => {
      this.goodsList$.next(goodsList);
      this.forceUpdate = false;
    });

    this.more$.asObservable().pipe(
      filter(startAfter => startAfter !== null),
      withLatestFrom(this.query$),
      switchMap(([startAfter, {market, exceptSoldOut}]) => this.getGoodsListBy(market, exceptSoldOut, startAfter)),
      map(goodsList => this.goodsList$.getValue().concat(goodsList))
    ).subscribe(goodsList => this.goodsList$.next(goodsList));
  }

  getGoodsListBy(
    market: string,
    soldOut: boolean,
    startAfter: firestore.Timestamp = null,
    limit = 10): Observable<Goods[]> {
    if (market === 'group') {
      return this.getGoodsListByGroup(this.auth.user.groupRef, soldOut, startAfter, limit);
    } else if (market === 'lounge') {
      return this.getGoodsListByLounge(soldOut, startAfter, limit);
    }
  }

  getGoodsListByGroup(
    groupRef: DocumentReference,
    exceptSoldOut: boolean,
    startAfter: firestore.Timestamp | null,
    limit: number): Observable<Goods[]> {
    const queryFn = (ref) => {
      let query = ref
        .where('groupRef', '==', groupRef)
        .where('market.group', '==', true)
        .orderBy('updated', 'desc')
        .limit(limit);
      if (exceptSoldOut) {
        query = query.where('soldOut', '==', false);
      }
      if (startAfter) {
        query = query.startAfter(startAfter);
      }
      return query;
    };
    return this.getGoodsList(queryFn);
  }

  getGoodsListByLounge(
    exceptSoldOut: boolean,
    startAfter: firestore.Timestamp | null,
    limit: number): Observable<Goods[]> {
    const queryFn = (ref) => {
      let query = ref
        .where('market.lounge', '==', true)
        .orderBy('updated', 'desc')
        .limit(limit);
      if (exceptSoldOut) {
        query = query.where('soldOut', '==', false);
      }
      if (startAfter) {
        query = query.startAfter(startAfter);
      }
      return query;
    };
    return this.getGoodsList(queryFn);
  }

  getGoodsListByUser(
    userRef: DocumentReference,
    market: string,
    limit: number = 30): Observable<Goods[]> {
    const queryFn = (ref) => (
      ref
        .where('userRef', '==', userRef)
        .where(`market.${market}`, '==', true)
        .orderBy('updated', 'desc')
        .limit(limit)
    );
    return this.getGoodsList(queryFn);
  }

  getGoodsList(queryFn: QueryFn): Observable<Goods[]> {
    return this.afs.collection('goods', queryFn).get()
      .pipe(map(Dispatcher.querySnapshot));
  }
}
