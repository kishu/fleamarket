import { firestore } from 'firebase';

export class Goods {
  id?: string;
  userRef: firestore.DocumentReference;
  user: {
    displayName: string,
    photoURL: string
  };
  groupRef: firestore.DocumentReference;
  market: {
    group: boolean;
    lounge: boolean;
  };
  images: [{
    id: string;
    url: string;
  }?];
  purchase: string;
  condition: string;
  title: string;
  desc: string;
  price: number;
  delivery: string;
  contact: string;
  commentCnt: number;
  interestCnt: number;
  soldout: boolean;
  created: firestore.FieldValue | firestore.Timestamp;
  updated: firestore.FieldValue | firestore.Timestamp;
}
