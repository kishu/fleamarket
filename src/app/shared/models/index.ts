export interface AuthMailData {
  email: string;
  corp: {
    domain: string,
    displayName: string
  };
  authCode: string;
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
  email: string;
  displayName: string;
  photoURL: string;
  corp: {
    domain: string
    displayName: string
  };
}

export class AFSimpleUser {
  uid: string;
  displayName: string;
  photoURL: string;
}

export * from './image-file';


