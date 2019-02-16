import * as firebase from 'firebase/app';
import { Injectable } from '@angular/core';
import { Group, User } from '@app/core/models';
import { AngularFirestore } from '@angular/fire/firestore';
import { of, zip } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { FirebaseUtilService } from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class SignInService {
  user: User;
  group: Group;

  constructor(private afs: AngularFirestore) { }

  user$(id: string | null) {
    const user$ = () => {
      return this.afs.doc(`users/${id}`).snapshotChanges()
        .pipe(map(FirebaseUtilService.dispatchAction));
    };

    const group$ = (user: User) => {
      return user.groupRef.get()
        .then(FirebaseUtilService.dispatchSnapshot);
    };

    return user$().pipe(
      tap(() => {
        this.user = null;
        this.group = null;
      }),
      filter(() => id !== null),
      switchMap((user: User) => zip(of(user), group$(user))),
      tap(([user, group]) => {
        this.user = user;
        this.group = group;
      })
    );
  }

  subscribeUser(id: string) {
    this.user$(id).subscribe();
  }

  getUserRef(): firebase.firestore.DocumentReference {
    return this.afs.collection('users').doc<User>(this.user.id).ref;
  }

}
