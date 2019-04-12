import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { iif, Observable } from 'rxjs';
import { filter, first, map, pluck } from 'rxjs/operators';
import { User, UserPreference } from '@app/core/models';
import { FirebaseUtilService } from '@app/shared/services';

import * as firebase from 'firebase/app';
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersCollection: AngularFirestoreCollection<User>;

  constructor(
    private afs: AngularFirestore,
    private firebaseUtilService: FirebaseUtilService
  ) {
    this.usersCollection = afs.collection<User>('users');
  }

  getUser(uid): Observable<User | null> {
    return this.afs.doc<User>(`users/${uid}`).get().pipe(
      map(d => {
        if (d.exists) {
          return { id: d.id, ...d.data() } as User;
        } else {
          return null;
        }
      })
    );
  }

  setUser(id: string, user: User): Promise<void> {
    return this.afs.doc<User>(`users/${id}`).set(user);
  }

  updateDisplayName(id: string, displayName: string): Promise<void> {
    return this.afs.doc<User>(`users/${id}`).update({ displayName });
  }

  updatePreference(id: string, preference: UserPreference): Promise<void> {
    return this.afs.doc<User>(`users/${id}`).update(preference);
  }

}
