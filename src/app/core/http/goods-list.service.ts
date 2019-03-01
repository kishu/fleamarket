import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference, QueryFn } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '@app/core/http/auth.service';
import { Goods } from '@app/core/models';
import { Dispatcher } from '@app/shared/utils/snapshot-dispatcher';

@Injectable({
  providedIn: 'root'
})
export class GoodsListService {
  constructor(
    private afs: AngularFirestore,
    private auth: AuthService
  ) { }

  getGoodsListBy(market: string, exceptSoldOut: boolean): Observable<Goods[]> {
    if (market === 'group') {
      return this.getGoodsListByGroup(this.auth.user.groupRef, exceptSoldOut);
    } else if (market === 'lounge') {
      return this.getGoodsListByLounge(exceptSoldOut);
    }
  }

  getGoodsListByGroup(groupRef: DocumentReference, exceptSoldOut: boolean): Observable<Goods[]> {
    const queryFn = (ref) => {
      let query = ref
        .where('groupRef', '==', groupRef)
        .where('market.group', '==', true)
        .orderBy('updated', 'desc');
      if (exceptSoldOut) {
        query = query.where('soldOut', '==', false);
      }
      return query;
    };
    return this.getGoodsList(queryFn);
  }

  getGoodsListByLounge(exceptSoldOut: boolean): Observable<Goods[]> {
    const queryFn = (ref) => {
      let query = ref
        .where('market.lounge', '==', true)
        .orderBy('updated', 'desc');
      if (exceptSoldOut) {
        query = query.where('soldOut', '==', false);
      }
      return query;
    };
    return this.getGoodsList(queryFn);
  }

  getGoodsListByUser(userRef: DocumentReference, market: string): Observable<Goods[]> {
    const queryFn = (ref) => (
      ref
        .where('userRef', '==', userRef)
        .where(`market.${market}`, '==', true)
        .orderBy('updated', 'desc')
    );
    return this.getGoodsList(queryFn);
  }

  getGoodsList(queryFn: QueryFn): Observable<Goods[]> {
    return this.afs.collection('goods', queryFn).get()
      .pipe(map(Dispatcher.querySnapshot));
  }

}
