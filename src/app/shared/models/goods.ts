import { firestore } from 'firebase';

export class Goods {
  id?: string;
  userRef: firestore.DocumentReference | string;
  groupRef: firestore.DocumentReference | string;
  post: {
    group: boolean
    lounge: boolean
  };
  images: [{
    public_id: string;
    url: string;
  }];
  category: string;
  purchase: string;
  condition: string;
  title: string;
  desc: string;
  price: number;
  delivery: string;
  contact?: string;
  donation?: number;
  created?: firestore.Timestamp | firestore.FieldValue;
  updated?: firestore.Timestamp | firestore.FieldValue;
}
