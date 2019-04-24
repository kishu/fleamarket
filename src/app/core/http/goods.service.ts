import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { first, map } from 'rxjs/operators';
import { AuthService } from '@app/core/http/auth.service';
import { Goods, User } from '@app/core/models';

import * as firebase from 'firebase/app';
import FieldValue = firebase.firestore.FieldValue;
import DocumentReference = firebase.firestore.DocumentReference;


@Injectable({
  providedIn: 'root'
})
export class GoodsService {
  cachedGoods: Goods;

  private goodsCollection: AngularFirestoreCollection<Goods>;

  constructor(
    private auth: AuthService,
    private afs: AngularFirestore
  ) {
    this.goodsCollection = afs.collection<Goods>('goods');
  }

  addGoods(goods: Goods) {
    return this.goodsCollection.add(goods);
  }

  getGoods(id: string): Observable<Goods> {
    return this.goodsCollection.doc(id).snapshotChanges().pipe(
      first(),
      map(goods => {
        return {id: goods.payload.id, ...goods.payload.data()} as Goods;
      })
    );
  }

  updateGoods(id: string, goods: Goods) {
    delete goods.id;
    return this.goodsCollection.doc(id).update(goods);
  }

  updateSoldOut(id, soldOut: boolean) {
    return this.goodsCollection.doc(id).update({ soldOut });
  }

  updateUser(id: string, user: User) {
    return this.goodsCollection.doc(id).update({
      user: {
        displayName: user.displayName,
        photoURL: user.photoURL,
        desc: user.desc
      }
    });
  }

  incrementCommentCnt(goodsId) {
    const goodsRef = this.getGoodsRef(goodsId);
    return this.afs.firestore.runTransaction(transaction => {
      return transaction.get(goodsRef)
        .then(goodsDoc => {
          let commentCnt = goodsDoc.data().commentCnt;
          commentCnt = commentCnt + 1;
          transaction.update(goodsRef, { commentCnt });
        });
    });
  }

  decrementCommentCnt(goodsId) {
    const goodsRef = this.getGoodsRef(goodsId);
    return this.afs.firestore.runTransaction(transaction => {
      return transaction.get(goodsRef)
        .then(goodsDoc => {
          let commentCnt = goodsDoc.data().commentCnt;
          commentCnt = commentCnt > 0 ? commentCnt - 1 : 0;
          transaction.update(goodsRef, { commentCnt });
        });
    });
  }

  deleteGoods(id: string) {
    return this.goodsCollection.doc(id).delete();
  }

  getNewGoods(): Goods {
    const user = this.auth.user;
    return {
      userRef: this.auth.getUserRef(),
      user: {
        displayName: user.displayName,
        photoURL: user.photoURL,
        desc: user.desc
      },
      groupRef: user.groupRef,
      groupName: this.auth.group.name,
      share: true,
      images: [],
      purchase: '알 수 없음',
      condition: '미개봉',
      title: '',
      desc: '',
      price: undefined,
      delivery: '직거래',
      contact: '',
      commentCnt: 0,
      interestCnt: 0,
      interests: [],
      soldOut: false,
      created: this.getServerTimeStamp(),
      updated: this.getServerTimeStamp()
    } as Goods;
  }

  getSelectedGoods(): Goods {
    return this.cachedGoods;
  }

  getGoodsRef(goodsId: string) {
    return this.goodsCollection.doc(goodsId).ref;
  }

  getGoodsUser(userRef: DocumentReference): Observable<User> {
    return fromPromise(userRef.get()).pipe(
      map(user => ({ id: user.id, ...user.data() } as User))
    );
  }

  getServerTimeStamp(): FieldValue {
    return FieldValue.serverTimestamp();
  }
}
