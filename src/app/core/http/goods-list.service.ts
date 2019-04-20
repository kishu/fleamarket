import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import DocumentReference = firebase.firestore.DocumentReference;
import Timestamp = firebase.firestore.Timestamp;
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { filter, first, map, scan, switchMap, tap } from 'rxjs/operators';
import { Goods } from '@app/core/models';

export interface GoodsListOptions {
  groupRef: DocumentReference;
  startAfter: Timestamp;
  limit: number;
  scan: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class GoodsListService {
  cached = false;
  goodsList$ = new BehaviorSubject<Goods[]>(null);
  private options$ = new BehaviorSubject<GoodsListOptions>(null);

  constructor(
    private afs: AngularFirestore
  ) {
    this.options$.asObservable().pipe(
      filter(options => !!options),
      switchMap(options => (
        forkJoin(
          this.getGoodsListByGroup$(options),
          this.getGoodsListByShared$(options),
        )
      )),
      map(([g1, g2]) => [...g1, ...g2]),
      map(g => (
        g.sort((p, n) => (
          (p.updated as Timestamp).seconds - (n.updated as Timestamp).seconds
        ))
      )),
      map(g => (
        g.reduce((a, c) => (a.findIndex(i => i.id === c.id) > -1) ? a : [c, ...a], [])
      )),
      map(g => g.slice(0, this.options$.getValue().limit)),
      scan((a, c) => this.options$.getValue().scan ? [...a, ...c] : c, []),
      tap(() => this.cached = true)
    ).subscribe(this.goodsList$);
  }

  more(options: GoodsListOptions) {
    this.options$.next(options);
  }

  private getGoodsListByGroup$(options: GoodsListOptions): Observable<Goods[]> {
    return this.afs.collection(
      'goods',
      ref => (
        ref.where('groupRef', '==', options.groupRef)
          .orderBy('updated', 'desc')
          .startAfter(options.startAfter)
          .limit(options.limit * 2)
      )
    ).snapshotChanges().pipe(
      first(),
      map(actions => (
        actions.map(a => (
          { id: a.payload.doc.id, ...a.payload.doc.data() } as Goods
        ))
      ))
    );
  }

  private getGoodsListByShared$(options: GoodsListOptions): Observable<Goods[]> {
    return this.afs.collection(
      'goods',
      ref => (
        ref.where('market.lounge', '==', true)
          .orderBy('updated', 'desc')
          .startAfter(options.startAfter)
          .limit(options.limit * 2)
      )
    ).snapshotChanges().pipe(
      first(),
      map(actions => (
        actions.map(a => (
          { id: a.payload.doc.id, ...a.payload.doc.data() } as Goods
        ))
      ))
    );
  }

  private getUserGoodsListByGroup$(groupRef: DocumentReference, userRef: DocumentReference, limit) {
    return this.afs.collection(
      'goods' ,
      ref => (
        ref.where('userRef', '==', userRef)
          .where('groupRef', '==', groupRef)
          .orderBy('updated', 'desc')
          .limit(limit)
      )
    ).snapshotChanges().pipe(
      first(),
      map(actions => (
        actions.map(a => (
          { id: a.payload.doc.id, ...a.payload.doc.data() } as Goods
        ))
      ))
    );
  }

  private getUserGoodsListByShared$(userRef: DocumentReference, limit) {
    return this.afs.collection(
      'goods',
      ref => (
        ref.where('userRef', '==', userRef)
          .where('market.lounge', '==', true)
          .orderBy('updated', 'desc')
          .limit(limit)
      )
    ).snapshotChanges().pipe(
      first(),
      map(actions => (
        actions.map(a => (
          { id: a.payload.doc.id, ...a.payload.doc.data() } as Goods
        ))
      ))
    );
  }

  getGoodsListByUser(groupRef: DocumentReference, userRef: DocumentReference, limit) {
    return forkJoin(
      this.getUserGoodsListByGroup$(groupRef, userRef, limit * 2),
      this.getUserGoodsListByShared$(userRef, limit * 2),
    ).pipe(
      map(([g1, g2]) => [...g1, ...g2]),
      map(g => (
        g.sort((p, n) => (
          (p.updated as Timestamp).seconds - (n.updated as Timestamp).seconds
        ))
      )),
      map(g => (
        g.reduce((a, c) => (a.findIndex(i => i.id === c.id) > -1) ? a : [c, ...a], [])
      )),
      map(g => g.slice(0, limit))
    );
  }

}
