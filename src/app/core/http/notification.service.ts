import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import {  map } from 'rxjs/operators';
import { FirebaseQueryBuilderOptions, FirebaseUtilService } from '@app/shared/services';
import { AuthService } from './auth.service';
import { Notification } from '@app/core/models';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationCollection: AngularFirestoreCollection<Notification>;

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
    private firebaseUtilService: FirebaseUtilService
    ) {
    this.notificationCollection = afs.collection<Notification>('notifications');
  }

  getNotifications(): Observable<Notification[]> {
    const queryFn = (ref) => ref
      .where('userRef', '==', this.auth.userRef)
      .orderBy('created', 'desc');

    return this.afs.collection('notifications', queryFn).get()
      .pipe(map(this.firebaseUtilService.dispatchQuerySnapshot));
  }
}
