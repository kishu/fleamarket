import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable} from 'rxjs';
import { first, map } from 'rxjs/operators';
import { User, UserPreference } from '@app/core/models';
import { FirebaseUtilService } from '@app/shared/services';

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
    return this.afs.doc<User>(`users/${uid}`)
      .snapshotChanges().pipe(
        first(),
        map(this.firebaseUtilService.dispatchAction)
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
