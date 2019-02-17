const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
admin.firestore().settings({ timestampsInSnapshots: true });

module.exports = functions.firestore
  .document('comments/{commentId}')
  .onCreate((comment, context) => {
    const fromUserRef = comment.get('userRef');
    const goodsRef = comment.get('goodsRef');
    const interests = admin.firestore().collection('interests')
      .where('goodsRef', '==', comment.get('goodsRef'));

    const buildNotification = (fromUser, toUserRef, goods, market) => ({
      fromUserRef: fromUserRef,
      toUserRef: toUserRef,
      goodsRef: goodsRef,
      image: fromUser.photoURL,
      fromUserDisplayName: fromUser.displayName,
      goodsTitle: goods.title,
      type: 'comment',
      body: comment.get('body'),
      market,
      isRead: false,
      created: admin.firestore.FieldValue.serverTimestamp()
    });

    return Promise.all([
      fromUserRef.get(),
      goodsRef.get(),
      interests.get()
    ]).then(results => {
      const fromUser = results[0].data();
      const goods = results[1].data();
      const interests = results[2].docs.map(doc => doc.data());

      const notificationToGoodsUser = [buildNotification(fromUser, goods.userRef, goods, comment.get('market'))];
      const notificationsToInterestedUser = interests
        .filter(interest => interest.userRef.id !== fromUserRef.id)
        .map(interest => buildNotification(fromUser, interest.userRef, goods, interest.market));

      const notificationCollection = admin.firestore().collection('notifications');
      const batches = notificationToGoodsUser.concat(notificationsToInterestedUser)
        .map(notification => notificationCollection.add(notification));

      return Promise.all(batches);
    });

  });
