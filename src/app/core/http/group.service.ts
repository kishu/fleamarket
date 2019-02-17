import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { FirebaseUtilService } from '@app/shared/services';
import { Group, GroupType } from '@app/core/models';

import * as firebase from 'firebase/app';
import DocumentReference = firebase.firestore.DocumentReference;

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private groupCollection: AngularFirestoreCollection<Group>;

  constructor(
    private readonly afs: AngularFirestore,
    private firebaseUtilService: FirebaseUtilService
  ) {
    this.groupCollection = afs.collection<Group>('groups');
  }

  getGroupsByType(type: GroupType): Observable<Group[]> {
    const queryFn = (ref) => {
      return this.firebaseUtilService.buildQuery(ref, {
        where: [['type', '==', type]],
        orderBy: [['name', 'asc']]
      });
    };

    return this.afs.collection('groups', queryFn).snapshotChanges().pipe(
      first(),
      map(this.firebaseUtilService.sirializeDocumentChangeActions)
    );
  }

  getRef(id: string): DocumentReference {
    return this.afs.doc(`groups/${id}`).ref;
  }
}
