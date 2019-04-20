import { firestore } from 'firebase';

export interface AuthData {
  email: string;
  group: Group;
  code: string;
}

export interface LoginInfo {
  user: User;
  group: Group;
}

export enum GroupType {
  Corp = 'corp',
  School = 'school',
  Apt = 'atp'
}

export const enum Market {
  Group = 'group',
  Lounge = 'lounge'
}

export class Interest {
  userRef: firestore.DocumentReference;
  goodsRef: firestore.DocumentReference;
  // market: string;
}

export class Group {
  id?: string;
  type: GroupType;   // 'corp', 'apt', 'school' ...
  name: string;
  market: string; // todo remove
  domain: string;
}

export class User {
  id?: string;
  groupRef: firestore.DocumentReference;
  groupName: string;
  email: string;
  displayName: string;
  desc: string;
  photoURL: string;
  notification: {
    goods: boolean,
    interest: boolean
  };
}

export class UserPreference {
  photoURL: string;
  displayName: string;
  desc: string;
  notice: boolean;
}

export class Notification {
  id?: string;
  fromUserRef: firestore.DocumentReference;
  fromUser: {
    photoURL: string;
    displayName: string;
  };
  toUserRef: firestore.DocumentReference;
  goodsRef: firestore.DocumentReference;
  goods: {
    image: string;
    title: string;
  };
  type: string;
  body: string;
  market: string;
  isRead: boolean;
  created: firestore.Timestamp;
}

export class Verification {
  id?: string;
  groupRef: firestore.DocumentReference;
  email: string;
  created: firestore.Timestamp | firestore.FieldValue;
}

export * from './goods';
export * from './image-file';
export * from './comment';


