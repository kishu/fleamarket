import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { first } from 'rxjs/operators';
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
      .valueChanges()
      .pipe(first());
  }

  addUser(uid: string, userExt: User) {
    return this.usersCollection.doc(uid).set(userExt);
  }

}
