import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Corp } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class CorpService {
  private corpsCollection: AngularFirestoreCollection<Corp>;

  constructor(private readonly afs: AngularFirestore) {
    this.corpsCollection = afs.collection<Corp>('corps');
  }

  getCorps() {
    return this.corpsCollection.snapshotChanges()
      .pipe(map(corps => {
        return corps.map(corp => {
          return {
            id: corp.payload.doc.id,
            ...corp.payload.doc.data()
          } as Corp;
        });
      }));
  }

}
