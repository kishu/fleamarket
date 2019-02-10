import { Injectable } from '@angular/core';
import { DocumentChangeAction } from '@angular/fire/firestore';

import * as firebase from 'firebase/app';
import FieldValue = firebase.firestore.FieldValue;
import OrderByDirection = firebase.firestore.OrderByDirection;
import WhereFilterOp = firebase.firestore.WhereFilterOp;

export interface FirebaseQueryBuilderOptions {
  where?: [string, string, any][];
  orderBy?: [string, string][];
  limit?: number;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseUtilService {

  constructor() { }

  static buildQuery(ref: firebase.firestore.Query, options: FirebaseQueryBuilderOptions) {
    let query = ref as firebase.firestore.Query;

    if (options.where) {
      options.where.forEach(where => {
        if (where) {
          query = query.where(where[0], where[1] as WhereFilterOp, where[2]);
        }
      });
    }

    if (options.orderBy) {
      options.orderBy.forEach(orderBy => {
        query = query.orderBy(orderBy[0], orderBy[1] as OrderByDirection);
      });
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    return query;
  }

  static sirializeDocumentChangeActions(actions: DocumentChangeAction<any>[]) {
    return actions.map(action => ({
      id: action.payload.doc.id,
      ...action.payload.doc.data()
    }));
  }

  static getServerTimeStamp(): FieldValue {
    return FieldValue.serverTimestamp();
  }

}
