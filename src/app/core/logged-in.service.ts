import * as firebase from 'firebase/app';
import { Injectable } from '@angular/core';
import { Group, User } from '@app/core/models';
import { AngularFirestore } from '@angular/fire/firestore';
import { of, Subject, zip } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { FirebaseUtilService } from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class LoggedIn {
  user: User;
  group: Group;
  userSource = new Subject<string>();

  constructor(private afs: AngularFirestore) {

  }

  subscribe() {
    if (!this.userSource.closed) {
      const user$ = (userId: string) => {
        return this.afs.doc(`users/${userId}`).snapshotChanges()
          .pipe(map(FirebaseUtilService.dispatchAction));
      };

      const group$ = (user: User) => {
        return user.groupRef.get()
          .then(FirebaseUtilService.dispatchSnapshot);
      };

      this.userSource.asObservable().pipe(
        switchMap(user$),
        switchMap((user: User) => zip(of(user), group$(user))),
        tap(_ => console.log('loggedin subscribe user', _))
      ).subscribe(([user, group]) => {
        this.user = user;
        this.group = group;
      });
    }
  }

  unsubscribe() {
    this.user = null;
    this.group = null;
    this.userSource.unsubscribe();
  }

  getUserRef(): firebase.firestore.DocumentReference {
    return this.afs.collection('users').doc<User>(this.user.id).ref;
  }

}
