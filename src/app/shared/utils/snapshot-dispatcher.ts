import { DocumentChangeAction, DocumentChange, DocumentSnapshot,
  QuerySnapshot, QueryDocumentSnapshot} from '@angular/fire/firestore';

function documentSnapshot(snapshot: DocumentSnapshot<any>) {
  if (snapshot.exists) {
    return { id: snapshot.id, ...snapshot.data() };
  } else {
    return null;
  }
}

function documentChange(change: DocumentChange<any>) {
  return documentSnapshot(change.doc as DocumentSnapshot<any>);
}

function documentChangeAction(actions: DocumentChangeAction<any>[]) {
  return actions.map(action => documentChange(action.payload));
}

function queryDocumentSnapshot(snapshot: QueryDocumentSnapshot<any>) {
  if (snapshot.exists) {
    return { id: snapshot.id, ...snapshot.data() };
  } else {
    return null;
  }
}

function querySnapshot(shanpshot: QuerySnapshot<any>) {
  return shanpshot.docs.map(doc => queryDocumentSnapshot(doc));
}

export const Dispatcher = {
  documentSnapshot,
  documentChange,
  documentChangeAction,
  queryDocumentSnapshot,
  querySnapshot
};
