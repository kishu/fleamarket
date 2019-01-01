import { firestore } from 'firebase';

export class Goods {
  id?: string;
  userId: string;
  groupId: string; // group id
  lounge: boolean;
  images: string[];
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
