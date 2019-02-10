import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { LoggedIn } from '@app/core/logged-in.service';
import { Notification } from '@app/core/models';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationCollection: AngularFirestoreCollection<Notification>;

  constructor(
    private afs: AngularFirestore,
    private loggedIn: LoggedIn,
    ) {
    this.notificationCollection = afs.collection<Notification>('notifications');
  }

  getNotifications(): Observable<Notification[]> {
    return this.afs.collection('notifications', ref => {
      return ref.where('userRef', '==',  this.loggedIn.getUserRef())
        .orderBy('created', 'desc')
        .limit(150);
    }).snapshotChanges().pipe(
      first(),
      map(notifications => {
        return notifications.map(notification => {
          return {
            id: notification.payload.doc.id,
            ...notification.payload.doc.data()
          } as Notification;
        });
      })
    );
  }
}
