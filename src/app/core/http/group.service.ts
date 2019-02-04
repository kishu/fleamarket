import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { first, map } from 'rxjs/operators';
import { Group, GroupType } from '@app/shared/models';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private groupCollection: AngularFirestoreCollection<Group>;

  constructor(private readonly afs: AngularFirestore) {
    this.groupCollection = afs.collection<Group>('groups');
  }

  getGroupsByType(type: GroupType) {
    return this.afs.collection('groups', ref => {
      return ref.where('type', '==', type)
        .orderBy('name', 'asc');
    }).snapshotChanges().pipe(
      first(),
      map(groups => {
        return groups.map(group => {
          return {
            id: group.payload.doc.id,
            ...group.payload.doc.data()
          } as Group;
        });
      })
    );
  }
}
