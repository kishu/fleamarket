import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { FirebaseUtilService } from '@app/shared/services';
import { AuthService } from './auth.service';
import { Notification } from '@app/core/models';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  notificationList$ = new BehaviorSubject<Notification[] | null>(null);

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
    private firebaseUtilService: FirebaseUtilService
    ) {
    console.log('no');
    this.afs.collection('notifications', ref => {
      return ref
        .where('toUserRef', '==', this.auth.userRef)
        .orderBy('created', 'desc')
        .limit(50);
    }).snapshotChanges().pipe(
        map(q => {
          return q.map(d => ({ id: d.payload.doc.id, ...d.payload.doc.data() } as Notification));
        }
      )
    ).subscribe(this.notificationList$);
  }

}
