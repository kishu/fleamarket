import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { filter, first, switchMap, tap } from 'rxjs/operators';
import { Interest } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class InterestService {
  private interestCollection: AngularFirestoreCollection<Interest>;

  constructor(private afs: AngularFirestore) {
    this.interestCollection = afs.collection<Interest>('interests');
  }

  addInterest(interest: Interest) {
    return this.getInterest(interest).pipe(
      filter(action => action.length === 0),
      tap(() => this.interestCollection.add(interest)),
      switchMap(() => {
        return this.afs.firestore.runTransaction(transaction => {
          return transaction.get(interest.goodsRef).then(doc => {
            const goods = doc.data();
            const index = goods.interests.findIndex(item => interest.userRef.isEqual(item));
            if (index === -1) {
              const interests = goods.interests;
              const interestCnt = goods.interestCnt + 1;
              interests.push(interest.userRef);
              transaction.update(interest.goodsRef, {interests, interestCnt});
            }
          });
        });
      })
    );
  }

  getInterest(interest: Interest) {
    return this.afs.collection('interests', ref => {
      return ref.where('userRef', '==', interest.userRef)
        .where('goodsRef', '==', interest.goodsRef);
    }).snapshotChanges().pipe(
      first()
    );
  }

  removeInterest(interest: Interest) {
    return this.getInterest(interest).pipe(
      filter(action => action.length > 0),
      tap(action => action.forEach(snapshot => this.interestCollection.doc(snapshot.payload.doc.id).delete())),
      switchMap(() => {
        return this.afs.firestore.runTransaction(transaction => {
          return transaction.get(interest.goodsRef).then(doc => {
            const goods = doc.data();
            const index = goods.interests.findIndex(item => interest.userRef.isEqual(item));
            if (index > -1) {
              const interests = goods.interests;
              const interestCnt = (goods.interestCnt > 0) ? goods.interestCnt - 1 : 0;
              interests.splice(index, 1);
              transaction.update(interest.goodsRef, {interests, interestCnt});
            }
          });
        });
      })
    );
  }
}
