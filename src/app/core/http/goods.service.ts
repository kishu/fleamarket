import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { firestore } from 'firebase';
import { first, map } from 'rxjs/operators';
import { Goods, Group, User } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class GoodsService {
  private goodsCollection: AngularFirestoreCollection<Goods>;

  constructor(private afs: AngularFirestore) {
    this.goodsCollection = afs.collection<Goods>('goods');
  }

  getUserRef(userId): firestore.DocumentReference {
    return this.afs.collection('users').doc<User>(userId).ref;
  }

  getGroupRef(groupId): firestore.DocumentReference {
    return this.afs.collection('groups').doc<Group>(groupId).ref;
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
        .orderBy('created', 'desc');
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
}
