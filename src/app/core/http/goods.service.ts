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

  updateSoldout(id, soldout: boolean) {
    return this.goodsCollection.doc(id).update({ soldout });
  }

  deleteGoods(id: string) {
    return this.goodsCollection.doc(id).delete();
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

  getGoodsByUser(userRef: firebase.firestore.DocumentReference, list: string): Observable<Goods[]> {
    return this.afs.collection('goods', ref => {
      let query = ref.where('userRef', '==',  userRef);
      if (list === 'group') {
        query = query.where('market.group', '==', true);
      } else if (list === 'lounge') {
        query = query.where('market.lounge', '==', true);
      }
      return query.orderBy('updated', 'desc').limit(30);
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

  getGoodsByGroup(groupRef: firebase.firestore.DocumentReference, soldout: boolean) {
    return this.afs.collection('goods', ref => {
      let query = ref as firebase.firestore.Query;
      query = query.where('groupRef', '==',  groupRef);
      query = query.where('market.group', '==', true);
      if (!soldout) {
        query = query.where('soldout', '==', false);
      }
      query = query.orderBy('updated', 'desc');
      return query;
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

  getGoodsByLounge(soldout: boolean) {
    return this.afs.collection('goods', ref => {
      let query = ref as firebase.firestore.Query;
      query = query.where('market.lounge', '==', true);
      if (!soldout) {
        query = query.where('soldout', '==', false);
      }
      query = query.orderBy('updated', 'desc');
      return query;
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

  getGoodsRef(goodsId: string) {
    return this.afs.collection('goods').doc<Goods>(goodsId).ref;
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
