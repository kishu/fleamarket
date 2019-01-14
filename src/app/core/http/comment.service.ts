import { Injectable } from '@angular/core';
import { firestore } from 'firebase';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { map } from 'rxjs/operators';
import { Comment, CommentWrite, Goods, User } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private commentCollection: AngularFirestoreCollection<Comment>;

  constructor(private afs: AngularFirestore) {
    this.commentCollection = afs.collection<Comment>('comments');
  }

  addComment(commentWrite: CommentWrite) {
    const comment: Comment = {
      userRef: this.afs.collection('users').doc<User>(commentWrite.userId).ref,
      goodsRef: this.afs.collection('goods').doc<Goods>(commentWrite.goodsId).ref,
      parentRef: commentWrite.parentId ?
        this.afs.collection('comments').doc<Comment>(commentWrite.parentId).ref : null,
      body: commentWrite.body,
      displayName: commentWrite.displayName,
      created: firestore.FieldValue.serverTimestamp(),
      updated: firestore.FieldValue.serverTimestamp()
    };

    // todo return must be observable but promise
    return fromPromise(this.commentCollection.add(comment));
  }

  getCommentsByGoods(goodsId: string): Observable<Comment[]> {
    const goodsRef = this.afs.collection('goods').doc<Goods>(goodsId).ref;

    return this.afs.collection('comments', ref => {
      return ref.where('goodsRef', '==',  goodsRef)
        .orderBy('updated', 'asc');
    }).snapshotChanges().pipe(
      map(comments => {
        return comments.map(comment => {
          return {
            id: comment.payload.doc.id,
            ...comment.payload.doc.data()
          } as Comment;
        });
      })
    );
  }
}
