import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { first, map } from 'rxjs/operators';
import { LoggedIn } from '../logged-in.service';
import { Goods, Group, User } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class GoodsService {
  private goodsCollection: AngularFirestoreCollection<Goods>;
  private _selectedGoods: Goods;

  constructor(
    private loggedIn: LoggedIn,
    private afs: AngularFirestore
  ) {
    this.goodsCollection = afs.collection<Goods>('goods');
  }

  // todo remove
  get selectedGoods() { return this._selectedGoods; }
  set selectedGoods(goods: Goods) { this._selectedGoods = goods; }

  addGoods(goods: Goods) {
    return this.goodsCollection.add(goods);
  }

  updateGoods(id: string, goods: Goods) {
    delete goods.id;
    return this.goodsCollection.doc(id).update(goods);
  }

  getGoods(id: string): Observable<Goods | null> {
    return this.afs.doc<Goods>(`goods/${id}`).snapshotChanges().pipe(
      first(),
      map(goods => goods.payload.exists ? (
          { id: goods.payload.id, ...goods.payload.data() } as Goods
        ) : (
          null
        )
      )
    );
  }

  getGoodsByGroup(groupRef: firebase.firestore.DocumentReference) {
    return this.afs.collection('goods', ref => {
      return ref.where('groupRef', '==',  groupRef)
        .where('market.group', '==', true)
        .orderBy('updated', 'desc');
    }).snapshotChanges().pipe(
      first(),
      map(goodsList => {
        return goodsList.map(goods => {
          return {
            id: goods.payload.doc.id,
            ...goods.payload.doc.data()
          } as Goods;
        });
      })
    );
  }

  getGoodsByLounge() {
    return this.afs.collection('goods', ref => {
      return ref.where('market.lounge', '==', true)
        .orderBy('updated', 'desc');
    }).snapshotChanges().pipe(
      first(),
      map(goodsList => {
        return goodsList.map(goods => {
          return {
            id: goods.payload.doc.id,
            ...goods.payload.doc.data()
          } as Goods;
        });
      })
    );
  }

  getGoodsUser(userRef: firebase.firestore.DocumentReference): Observable<User | any> {
    return fromPromise(userRef.get()).pipe(
      map(user => ({ id: user.id, ...user.data() }))
    );
  }

  getGroupRef(groupId): firebase.firestore.DocumentReference {
    return this.afs.collection('groups').doc<Group>(groupId).ref;
  }

  getNewGoods(): Goods {
    const user = this.loggedIn.user;
    return {
      userRef: this.loggedIn.getUserRef(),
      user: {
        displayName: user.displayName,
        photoURL: user.photoURL
      },
      groupRef: user.groupRef,
      market: {
        group: true,
        lounge: false
      },
      images: [],
      category: '가전/디지털',
      purchase: '알 수 없음',
      condition: '미개봉',
      title: '',
      desc: '',
      price: 0,
      delivery: '직거래',
      contact: '',
      donation: 0,
      commentCnt: 0,
      favoriteCnt: 0,
      soldout: false,
      created: this.getServerTimeStamp(),
      updated: this.getServerTimeStamp()
    } as Goods;
  }

  getSelectedGoods(): Goods {
    return this._selectedGoods;
  }

  getServerTimeStamp(): firebase.firestore.FieldValue {
    return firebase.firestore.FieldValue.serverTimestamp();
  }

  getUserRef(userId): firebase.firestore.DocumentReference {
    return this.afs.collection('users').doc<User>(userId).ref;
  }

  incrementCommentCnt(id) {
    const goodsRef = this.goodsCollection.doc(id).ref;

    return this.afs.firestore.runTransaction(transaction => {
      return transaction.get(goodsRef)
        .then(goodsDoc => {
          transaction.update(goodsRef, {commentCnt: goodsDoc.data().commentCnt + 1});
        });
    });
  }
}
