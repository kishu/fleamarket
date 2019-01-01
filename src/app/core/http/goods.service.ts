import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Goods, Group, User } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class GoodsService {
  private goodsCollection: AngularFirestoreCollection<Goods>;

  constructor(private afs: AngularFirestore) {
    this.goodsCollection = afs.collection<Goods>('goods ');
  }

  addGoods(goods: Goods) {
    if (typeof goods.userRef === 'string') {
      goods.userRef = this.afs.collection('users').doc<User>(goods.userRef).ref;
    }

    if (typeof goods.groupRef === 'string') {
      goods.groupRef = this.afs.collection('groups').doc<Group>(goods.groupRef).ref;
    }

    return this.goodsCollection.add(goods);
  }
}
