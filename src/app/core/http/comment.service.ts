import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { map } from 'rxjs/operators';
import { Dispatcher } from '@app/shared/utils/snapshot-dispatcher';
import { Comment, Goods, User } from '@app/core/models';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private commentCollection: AngularFirestoreCollection<Comment>;

  constructor(private afs: AngularFirestore) {
    this.commentCollection = afs.collection<Comment>('comments');
  }

  addComment(comment: Comment) {
    // todo return must be observable but promise
    return fromPromise(this.commentCollection.add(comment));
  }

  deleteComment(commentId: string) {
    return this.commentCollection.doc(commentId).delete();
  }

  getCommentsByGoods(goodsId: string): Observable<Comment[]> {
    const goodsRef = this.afs.doc(`goods/${goodsId}`).ref;
    const queryFn = (ref) => (
      ref.where('goodsRef', '==', goodsRef)
        .orderBy('created', 'asc')
    );

    return (
      this.afs
        .collection('comments', queryFn)
        .snapshotChanges()
        .pipe(map(Dispatcher.documentChangeAction))
    );
  }

  getGoodsRef(goodsId): firebase.firestore.DocumentReference {
    return this.afs.collection('goods').doc<Goods>(goodsId).ref;
  }

  getServerTimeStamp(): firebase.firestore.FieldValue {
    return firebase.firestore.FieldValue.serverTimestamp();
  }

  getUserRef(userId): firebase.firestore.DocumentReference {
    return this.afs.collection('users').doc<User>(userId).ref;
  }

}
