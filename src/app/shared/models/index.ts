export interface AuthMailData {
  email: string;
  corp: {
    domain: string,
    displayName: string
  };
  authCode: string;
}

export class Corp {
  id?: string;
  domain: string;
  displayName: string;
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


