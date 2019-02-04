import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable} from 'rxjs';
import { first, map } from 'rxjs/operators';
import { User, Group, UserPreference } from '@app/shared/models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersCollection: AngularFirestoreCollection<User>;

  constructor(private afs: AngularFirestore) {
    this.usersCollection = afs.collection<User>('users');
  }

  getGroupRef(id) {
    return this.afs.collection('groups').doc<Group>(id).ref;
  }

  getUser(uid): Observable<User> | null {
    return this.afs.doc<User>(`users/${uid}`)
      .snapshotChanges().pipe(
        first(),
        map(user => {
          if (user.payload.exists) {
            return {
              id: user.payload.id,
              ...user.payload.data()
            } as User;
          } else {
            return null;
          }
        })
      );
  }

  setUser(uid: string, user: User) {
    return this.usersCollection.doc(uid).set(user);
  }

  updatePreference(id: string, preference: UserPreference) {
    return this.usersCollection.doc(id).update(preference);
  }

}
