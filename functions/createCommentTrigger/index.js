const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
admin.firestore().settings({ timestampsInSnapshots: true });

module.exports = functions.firestore
  .document('comments/{commentId}')
  .onCreate((comment, context) => {
    const fromUserRef = comment.get('userRef');
    const goodsRef = comment.get('goodsRef');

    const fromUserPromise = fromUserRef.get();
    const goodsPromise = goodsRef.get();

    return Promise.all([fromUserPromise, goodsPromise]).then(([fromUser, goods]) => {
      if (fromUserRef !== goods.userRef || true) {
        return admin.firestore().collection('notifications').add({
          userRef: goods.get('userRef'),
          fromUserRef: fromUserRef,
          fromUser: {
            id: fromUser.id,
            displayName: fromUser.get('displayName'),
            photoURL: fromUser.get('photoURL')
          },
          goodsRef: goodsRef,
          goods: {
            id: goods.id,
            title: goods.get('title'),
            image: goods.get('images')[0]
          },
          comment: {
            id: comment.id,
            body: comment.get('body')
          },
          isRead: false,
          created: comment.get('created')
        });
      }
    });
  });
