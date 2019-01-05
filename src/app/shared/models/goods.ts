import { firestore } from 'firebase';

export class Goods {
  id?: string;
  userRef: firestore.DocumentReference;
  groupRef: firestore.DocumentReference;
  post: {
    group: boolean;
    lounge: boolean;
  };
  images: [{
    id: string;
    url: string;
  }];
  category: string;
  purchase: string;
  condition: string;
  title: string;
  desc: string;
  price: number;
  delivery: string;
  contact: string;
  donation: number;
  created: firestore.FieldValue | firestore.Timestamp;
  updated: firestore.FieldValue | firestore.Timestamp;
}

//
// interface Post {
//   group: boolean;
//   lounge: boolean;
// }
//
// interface Image {
//   public_id: string;
//   url: string;
// }
//
// export class Goods {
//   private readonly _id?: string;
//   private readonly _userRef: firestore.DocumentReference;
//   private readonly _groupRef: firestore.DocumentReference;
//   private readonly _post: Post;
//   private readonly _images: Image[];
//   private readonly _category: string;
//   private readonly _purchase: string;
//   private readonly _condition: string;
//   private readonly _title: string;
//   private readonly _desc: string;
//   private readonly _price: number;
//   private readonly _delivery: string;
//   private readonly _contact: string;
//   private readonly _donation: number;
//   private readonly _created: firestore.FieldValue | firestore.Timestamp;
//   private readonly _updated: firestore.FieldValue | firestore.Timestamp;
//
//   get id(): string { return this._id; }
//   get userRef(): firestore.DocumentReference { return this._userRef; }
//   get groupRef(): firestore.DocumentReference { return this._groupRef; }
//   get post(): Post { return this._post; }
//   get images(): Image[] { return this._images; }
//   get category(): string { return this._category; }
//   get purchase(): string { return this._purchase; }
//   get condition(): string { return this._condition; }
//   get title(): string { return this._title; }
//   get desc(): string { return this._desc; }
//   get price(): number { return this._price; }
//   get delivery(): string { return this._delivery; }
//   get contact(): string { return this._contact; }
//   get donation(): number { return this._donation; }
//   get created(): firestore.Timestamp { return this._created as firestore.Timestamp; }
//   get updated(): firestore.Timestamp { return this._updated as firestore.Timestamp; }
//
//   constructor(goods: any) {
//     this._id = goods.id;
//     this._userRef = goods.userRef;
//     this._groupRef = goods.groupRef;
//     this._post = goods.post;
//     this._images = goods.images;
//     this._category = goods.category;
//     this._purchase = goods.purchase;
//     this._condition = goods.condition;
//     this._title = goods.title;
//     this._desc = goods.desc;
//     this._price = goods.price;
//     this._delivery = goods.delivery;
//     this._contact = goods.contact;
//     this._donation = goods.donation;
//     this._created = goods.created;
//     this._updated =  goods.updated;
//   }
//
// }
//
