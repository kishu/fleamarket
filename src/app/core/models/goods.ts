import { firestore } from 'firebase';

export class Goods {
  id?: string;
  userRef: firestore.DocumentReference;
  user: {
    displayName: string,
    photoURL: string,
    desc: string,
  };
  groupRef: firestore.DocumentReference;
  share: boolean;
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
  interests: [ firestore.DocumentReference? ];
  interestCnt: number;
  soldOut: boolean;
  created: firestore.FieldValue | firestore.Timestamp;
  updated: firestore.FieldValue | firestore.Timestamp;
}
