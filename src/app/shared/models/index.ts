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
  Corp = 'CORP',
  School = 'SCHOOL',
  Apt = 'APT'
}

export const enum Market {
  Group = 'GROUP',
  Lounge = 'LOUNGE'
}

export class Interest {
  userRef: firestore.DocumentReference;
  goodsRef: firestore.DocumentReference;
}

export class Group {
  id?: string;
  type: GroupType;   // 'corp', 'apt', 'school' ...
  name: string;
  market: string;
  domain: string;
}

export class AFSimpleUser {
  uid: string;
  displayName: string;
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
  comment: {
    body: string
  };
  isRead: boolean;
  created: firestore.Timestamp;
}

export * from './goods';
export * from './image-file';
export * from './comment';


