import { firestore } from 'firebase';
import { Market } from './index';

export class Comment {
  id?: string;
  market: Market;
  userRef: firestore.DocumentReference;
  user: {
    displayName: string;
    photoURL: string;
  };
  goodsRef: firestore.DocumentReference;
  body: string;
  created: firestore.FieldValue | firestore.Timestamp;
  updated: firestore.FieldValue | firestore.Timestamp;
}
