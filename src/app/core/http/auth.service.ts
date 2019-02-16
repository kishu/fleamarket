import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { first, switchMap, tap } from 'rxjs/operators';
import { LoggedIn } from '@app/core/logged-in.service';
import { Group, User } from '@app/core/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private loggedIn: LoggedIn,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore) { }

  get afUser(): Observable<firebase.User> {
    return this.afAuth.user.pipe(first());
  }

  resolveAuthInfo() {
    const afUser$ = this.afAuth.user.pipe(first());

    const user$ = id => {
      return this.afs.doc<User>(`users/${id}`).snapshotChanges().pipe(
        first(),
        switchMap(user => {
          if (user.payload.exists) {
            return of({id: user.payload.id, ...user.payload.data()} as User);
          } else {
            return of(null);
          }
        })
      );
    };

    const group$ = user => {
      const groupRef = user.groupRef as DocumentReference;
      return fromPromise(groupRef.get()).pipe(
        first(),
        switchMap(group => {
          if (group.exists) {
            return of({id: group.id, ...group.data()} as Group);
          }
        })
      );
    };

    return afUser$.pipe(
      switchMap(afUser => {
        if (afUser) {
          return user$(afUser.uid);
        } else {
          return of(null);
        }
      }),
      switchMap(user => {
        if (user) {
          this.loggedIn.user = user;
          return group$(user);
        } else {
          this.loggedIn.user = null;
          return of(null);
        }
      }),
      tap(group => {
        if (group) {
          this.loggedIn.group = group;
        } else {
          this.loggedIn.group = null;
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
      () => this.loggedIn.user$(null).pipe(first())
    );
  }

}
