const functions = require('firebase-functions');
const admin = require('firebase-admin');

const buildNotification = (fromUser, toUser, goods, comment) => ({
  fromUserRef: admin.firestore().doc(`users/${fromUser.id}`),
  fromUser: {
    photoURL: fromUser.photoURL,
    displayName: fromUser.displayName
  },
  toUserRef: admin.firestore().doc(`users/${toUser.id}`),
  goodsRef: admin.firestore().doc(`goods/${goods.id}`),
  goods: {
    image: goods.images[0],
    title: goods.title
  },
  type: 'comment',
  body: comment.body,
  market: comment.market,
  isRead: false,
  created: admin.firestore.FieldValue.serverTimestamp()
});

module.exports = functions
  .region('us-central1')
  .firestore
  .document('comments/{commentId}')
  .onCreate((comment, context) => {
    return Promise
      .all([
        comment,
        comment.get('userRef').get(),
        comment.get('goodsRef').get(),
        admin.firestore().collection('interests')
          .where('goodsRef', '==', comment.get('goodsRef')).get()
      ])
      .then(results => {
        const comment = Object.assign({ id: results[0].ref.id }, results[0].data());
        const fromUser = Object.assign({ id: results[1].ref.id }, results[1].data());
        const goods = Object.assign({ id: results[2].ref.id }, results[2].data());
        const interests = results[3].docs.map(i => (Object.assign({ id: i.ref.id }, i.data())));

        const toGoodsUser = [buildNotification(fromUser, goods.userRef, goods, comment)]
          .filter(n => n.fromUserRef.id !== n.toUserRef.id);
        const toInterestUsers = interests
          .filter(i => i.userRef.id !== goods.userRef.id)
          .map(i => buildNotification(fromUser, i.userRef, goods, comment));
        const batches = toGoodsUser.concat(toInterestUsers)
          .map(n => admin.firestore().collection('notifications').add(n));

        return Promise.all(batches);
      });

  });
