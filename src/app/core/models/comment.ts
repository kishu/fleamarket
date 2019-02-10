import { firestore } from 'firebase';

export class Comment {
  id?: string;
  userRef: firestore.DocumentReference;
  user: {
    displayName: string;
    photoURL: string;
  };
  goodsRef: firestore.DocumentReference;
  parentRef: firestore.DocumentReference | null;
  body: string;
  created: firestore.FieldValue | firestore.Timestamp;
  updated: firestore.FieldValue | firestore.Timestamp;
}
