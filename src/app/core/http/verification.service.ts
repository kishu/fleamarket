import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { first, map, tap } from 'rxjs/operators';
import { FirebaseUtilService } from '@app/shared/services';
import { Verification } from '@app/core/models';

@Injectable({
  providedIn: 'root'
})
export class VerificationService {
  private collection: AngularFirestoreCollection<Verification>;

  constructor(private afs: AngularFirestore) {
    this.collection = this.afs.collection<Verification>('verifications');
  }

  add(verification: Verification) {
    return fromPromise(this.collection.add(verification));
  }

  get(id): Observable<Verification> {
    return this.afs.doc<Verification>(`verifications/${id}`)
      .snapshotChanges().pipe(
        first(),
        tap(_ => console.log(_)),
        map(FirebaseUtilService.dispatchAction)
      );
  }

}
