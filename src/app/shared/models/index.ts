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
  Apt = 'Apt'
}

export class Group {
  id?: string;
  type: string;   // 'corp', 'apt', 'school' ...
  name: string;
  domain?: string;
}

export class User {
  uid?: string;
  groupRef: firestore.DocumentReference | string;
  email: string;
  displayName: string;
  photoURL: string;
}

export class AFSimpleUser {
  uid: string;
  displayName: string;
  photoURL: string;
}

export * from './image-file';


