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
  market: string;
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
  email: string;
  displayName: string;
  desc: string;
  photoURL: string;
  notice: boolean; // todo rename notification
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
  toUserRef: firestore.DocumentReference;
  targetRef: firestore.DocumentReference;
  image: string;
  fromUserDisplayName: string;
  goodsTitle: string;
  type: string;
  body: string;
  market: string;
  isRead: boolean;
  created: firestore.Timestamp;
}

export class Notification2 {
  id: string;
  userRef: firestore.DocumentReference;
  user: {
    email: string,
    displayName: string,
    photoURL: string
  };
  fromUserRef: firestore.DocumentReference;
  fromUser: {
    displayName: string,
    photoURL: string
  };
  goodsRef: firestore.DocumentReference;
  goods: {
    title: string
    image: string
  };
  commentRef: firestore.DocumentReference;
  comment: {
    market: Market
    body: string
  };
  isRead: boolean;
  created: firestore.Timestamp;
}

export class Verification {
  id?: string;
  groupRef: firestore.DocumentReference;
  displayName: string;
  email: string;
  created: firestore.Timestamp | firestore.FieldValue;
}

export * from './goods';
export * from './image-file';
export * from './comment';


