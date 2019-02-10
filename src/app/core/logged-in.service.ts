import { Injectable } from '@angular/core';
import { Group, User } from '@app/core/models';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class LoggedIn {
  private _user: User;
  private _group: Group;

  get user() { return this._user; }
  get group() { return this._group; }
  set user(user: User) { this._user = user; }
  set group(group: Group) { this._group = group; }

  constructor(private afs: AngularFirestore) { }

  getUserRef(): firebase.firestore.DocumentReference {
    return this.afs.collection('users').doc<User>(this._user.id).ref;
  }

}
