import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { first, map } from 'rxjs/operators';
import { FirebaseUtilService, FirebaseQueryBuilderOptions } from '@app/shared/services';
import { Goods } from '@app/core/models';
import { Observable } from 'rxjs';
import { LoggedIn } from '@app/core/logged-in.service';

@Injectable({
  providedIn: 'root'
})
export class GoodsListService {
  private goodsCollection: AngularFirestoreCollection<Goods>;

  constructor(
    private afs: AngularFirestore,
    private loggedIn: LoggedIn
  ) {
    this.goodsCollection = this.afs.collection<Goods>('goods');
  }

  getGoodsListBy(market: string, exceptSoldOut: boolean): Observable<Goods[]> {
    if (market === 'group') {
      return this.getGoodsListByGroup(this.loggedIn.user.groupRef, exceptSoldOut);
    } else if (market === 'lounge') {
      return this.getGoodsListByLounge(exceptSoldOut);
    }
  }

  getGoodsListByGroup(groupRef: DocumentReference, exceptSoldOut: boolean): Observable<Goods[]> {
    const options: FirebaseQueryBuilderOptions = {
      where: [
        ['groupRef', '==', groupRef],
        ['market.group', '==', true],
        exceptSoldOut ? ['soldOut', '==', false] : undefined
      ],
      orderBy: [
        ['updated', 'desc']
      ]
    };
    return this.getGoodsList(options);
  }

  getGoodsListByLounge(exceptSoldOut: boolean): Observable<Goods[]> {
    const options: FirebaseQueryBuilderOptions = {
      where: [
        ['market.lounge', '==', true],
        exceptSoldOut ? ['soldOut', '==', false] : undefined
      ],
      orderBy: [
        ['updated', 'desc']
      ]
    };
    return this.getGoodsList(options);
  }

  getGoodsList(options: FirebaseQueryBuilderOptions): Observable<Goods[]> {
    return this.afs.collection(
      'goods',
      ref => FirebaseUtilService.buildQuery(ref, options)
    ).snapshotChanges().pipe(
      first(),
      map(FirebaseUtilService.sirializeDocumentChangeActions)
    );
  }

  getGoodsListByUser(userRef: DocumentReference, market: string): Observable<Goods[]> {
    const options: FirebaseQueryBuilderOptions = {
      where: [
        ['userRef', '==', userRef],
        [`market.${market}`, '==', true]
      ],
      orderBy: [
        ['updated', 'desc']
      ]
    };
    return this.getGoodsList(options);
  }

}
