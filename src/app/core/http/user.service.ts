import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { merge } from 'rxjs';
import { filter, first, map, mapTo } from 'rxjs/operators';
import { User, Group } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersCollection: AngularFirestoreCollection<User>;

  constructor(private afs: AngularFirestore) {
    this.usersCollection = afs.collection<User>('users');
  }

  getUser(uid) {
    const user$ = this.afs.doc<User>(`users/${uid}`)
      .snapshotChanges().pipe(first());

    const noUser$ = user$.pipe(
      filter(user => !user.payload.exists),
      mapTo(null)
    );

    const existUser$ = user$.pipe(
      filter(user => user.payload.exists),
      map(user => {
        return {
          id: user.payload.id,
          ...user.payload.data()
        };
      })
    );

    return merge(noUser$, existUser$);
  }

  setUser(uid: string, user: User) {
    if (typeof user.groupRef === 'string') {
      user.groupRef = this.afs.collection('groups').doc<Group>(user.groupRef).ref;
    }

    return this.usersCollection.doc(uid).set(user);
  }

}
