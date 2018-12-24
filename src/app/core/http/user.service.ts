import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { first, map } from 'rxjs/operators';
import { User } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersCollection: AngularFirestoreCollection<User>;

  constructor(private afs: AngularFirestore) {
    this.usersCollection = afs.collection<User>('users');
  }

  getUser(uid) {
    return this.afs.doc<User>(`users/${uid}`)
      .snapshotChanges()
      .pipe(
        first(),
        map(user => {
          const data = user.payload.data();
          const id = user.payload.id;
          return { id, ...data };
        })
      );
  }

  addUser(uid: string, userExt: User) {
    return this.usersCollection.doc(uid).set(userExt);
  }

}
