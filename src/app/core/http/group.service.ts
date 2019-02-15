import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { Group, GroupType } from '@app/core/models';

import { FirebaseUtilService } from '@app/shared/services';
import * as firebase from 'firebase/app';
import DocumentReference = firebase.firestore.DocumentReference;

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private groupCollection: AngularFirestoreCollection<Group>;

  constructor(private readonly afs: AngularFirestore) {
    this.groupCollection = afs.collection<Group>('groups');
  }

  getGroupsByType(type: GroupType): Observable<Group[]> {
    const queryFn = (ref) => {
      return FirebaseUtilService.buildQuery(ref, {
        where: [['type', '==', type]],
        orderBy: [['name', 'asc']]
      });
    };

    return this.afs.collection('groups', queryFn).snapshotChanges().pipe(
      first(),
      map(FirebaseUtilService.sirializeDocumentChangeActions)
    );
  }

  getRef(id: string): DocumentReference {
    return this.afs.doc(`groups/${id}`).ref;
  }
}
