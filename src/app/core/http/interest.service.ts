import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { zip } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Interest } from '@app/core/models';

import * as firebase from 'firebase/app';
import FieldValue = firebase.firestore.FieldValue;

@Injectable({
  providedIn: 'root'
})
export class InterestService {
  constructor(private afs: AngularFirestore) {}

  addInterest(interest: Interest) {
    const addInterests = this.afs.collection('interests').add(interest);
    const addGoodsInterestUser = this.afs.doc(`goods/${interest.goodsRef.id}`)
        .update({ interests: FieldValue.arrayUnion(interest.userRef) });

    return zip(addInterests, addGoodsInterestUser);
  }

  removeInterest(interest: Interest) {
    const queryFn = (ref) => ref
      .where('goodsRef', '==', interest.goodsRef)
      .where('userRef', '==', interest.userRef);

    const removeInterests = this.afs.collection('interests', queryFn).get()
      .pipe(tap(qs => qs.forEach(doc => doc.ref.delete())));

    const removeGoodsInterestUser = this.afs.doc(`goods/${interest.goodsRef.id}`)
      .update({ interests: FieldValue.arrayRemove(interest.userRef) });

    return zip(removeInterests, removeGoodsInterestUser);
  }

}
