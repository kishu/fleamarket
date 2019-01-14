import { firestore } from 'firebase';

export class CommentWrite {
  userId: string;
  goodsId: string;
  parentId: string | null;
  displayName: string;
  body: string;
}
export class Comment {
  id?: string;
  userRef: firestore.DocumentReference;
  goodsRef: firestore.DocumentReference;
  parentRef: firestore.DocumentReference | null;
  displayName: string;
  body: string;
  created: firestore.FieldValue | firestore.Timestamp;
  updated: firestore.FieldValue | firestore.Timestamp;
}
