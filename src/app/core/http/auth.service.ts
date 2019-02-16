import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, } from '@angular/fire/firestore';
import { of, Subject, Subscription, zip } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Group, User } from '@app/core/models';
import { FirebaseUtilService } from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: User;
  group: Group;
  signIn$ = new Subject<boolean>();

  private subscription: Subscription;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore) {
    this.afAuth.user.subscribe(user =>
      user ?
        this.subscribeUser(user.uid) :
        this.unSubscribeUser()
    );
  }

  signIn(target: string) {
    let provider;

    if (target === 'facebook') {
      provider = new firebase.auth.FacebookAuthProvider();
    } else if (target === 'github') {
      provider = new firebase.auth.GithubAuthProvider();
    } else if (target === 'twitter') {
      provider = new firebase.auth.TwitterAuthProvider();
    } else if (target === 'google') {
      provider = new firebase.auth.GoogleAuthProvider();
    }

    return this.afAuth.auth.signInWithPopup(provider);
  }

  signOut() {
    return this.afAuth.auth.signOut();
  }

  signInUser$(id: string) {
    const user$ = () => {
      return this.afs.doc(`users/${id}`).snapshotChanges()
        .pipe(map(FirebaseUtilService.dispatchAction));
    };

    const group$ = (user: User) => {
      return user.groupRef.get()
        .then(FirebaseUtilService.dispatchSnapshot);
    };

    return user$().pipe(
      switchMap((user: User) => zip(of(user), group$(user))),
      tap(([user, group]) => {
        this.user = user;
        this.group = group;
      })
    );
  }

  subscribeUser(id: string) {
    this.subscription = this.signInUser$(id).subscribe(
      () => this.signIn$.next(true)
    );
  }

  unSubscribeUser() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.user = null;
    this.group = null;
    this.signIn$.next(false);
  }

  // todo remove
  getUserRef(): firebase.firestore.DocumentReference {
    return this.afs.collection('users').doc<User>(this.user.id).ref;
  }

}
