import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { merge, of } from 'rxjs';
import { filter, first, map, share, switchMap, tap } from 'rxjs/operators';
import { Group, User } from '@app/core/models';

import * as firebase from 'firebase/app';
import DocumentReference = firebase.firestore.DocumentReference;
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: User;
  userRef: DocumentReference;
  group: Group;

  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
  ) { }

  checkIn() {
    return this.afAuth.user.pipe(
      first(),
      switchMap(u => {
        if (u) {
          return this.signInUserById(u.uid);
        } else {
          return of(null);
        }
      })
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
    return this.afAuth.auth.signOut().then(
      () => this.signOutUser()
    );
  }

  signInUserById(id: string) {
    const source = this.afs.doc(`users/${id}`).get().pipe(share());

    const user$ = source.pipe(
      filter(d => d.exists),
      map(d => ({ id: d.id, ...d.data() } as User)),
      tap(u => this.user = u),
      tap(u => this.userRef = this.afs.doc(`users/${u.id}`).ref),
      switchMap((u: User) => u.groupRef.get()),
      map((d: DocumentSnapshot) => ({ id: d.id, ...d.data() } as Group)),
      tap((g: Group) => this.group = g)
    );

    const nouser$ = source.pipe(
      filter(d => !d.exists)
    );

    return merge(user$, nouser$);
  }

  signOutUser() {
    this.user = null;
    this.userRef = null;
    this.group = null;
  }

  // todo remove
  getUserRef(): firebase.firestore.DocumentReference {
    return this.afs.collection('users').doc<User>(this.user.id).ref;
  }

}
