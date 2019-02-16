import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import {  map } from 'rxjs/operators';
import { FirebaseQueryBuilderOptions, FirebaseUtilService } from '@app/shared/services';
import { SignInService } from '@app/core/sign-in.service';
import { Notification } from '@app/core/models';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationCollection: AngularFirestoreCollection<Notification>;

  constructor(
    private afs: AngularFirestore,
    private signIn: SignInService,
    ) {
    this.notificationCollection = afs.collection<Notification>('notifications');
  }

  getNotifications(): Observable<Notification[]> {
    const queryFn = (ref) => {
      const options: FirebaseQueryBuilderOptions = {
        where: [['userRef', '==',  this.signIn.getUserRef()]],
        orderBy: [['created', 'desc']],
        limit: 150
      };
      return FirebaseUtilService.buildQuery(ref, options);
    };

    return this.afs.collection('notifications', queryFn)
      .snapshotChanges().pipe(
        map(FirebaseUtilService.sirializeDocumentChangeActions)
      );
  }
}
