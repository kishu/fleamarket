import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import 'firebase/firestore';
import { Observable } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { first, map } from 'rxjs/operators';
import { Goods, Group, User } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class GoodsService {
  private goodsCollection: AngularFirestoreCollection<Goods>;
  private _selectedGoods: Goods;

  constructor(private afs: AngularFirestore) {
    this.goodsCollection = afs.collection<Goods>('goods');
  }

  get selectedGoods() { return this._selectedGoods; }
  set selectedGoods(goods: Goods) { this._selectedGoods = goods; }

  getUserRef(userId): firestore.DocumentReference {
    return this.afs.collection('users').doc<User>(userId).ref;
  }

  getGroupRef(groupId): firestore.DocumentReference {
    return this.afs.collection('groups').doc<Group>(groupId).ref;
  }

  getGoodsUser(userRef: firestore.DocumentReference): Observable<User | any> {
    return fromPromise(userRef.get()).pipe(
      map(user => ({ id: user.id, ...user.data() }))
    );
  }

  getServerTimeStamp(): firestore.FieldValue {
    return firestore.FieldValue.serverTimestamp();
  }

  addGoods(goods: Goods) {
    return this.goodsCollection.add(goods);
  }

  getGoodsByGroup(groupRef: firestore.DocumentReference) {
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
}
