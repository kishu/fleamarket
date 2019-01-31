const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
admin.firestore().settings({ timestampsInSnapshots: true });

module.exports = functions.firestore
  .document('comments/{commentId}')
  .onCreate((comment, context) => {
    const parseNotification = (fromUser, toUser, goods) => {
      return {
        userRef: toUser.ref,
        user: {
          email: toUser.get('email'),
          displayName: toUser.get('displayName'),
          photoURL: toUser.get('photoURL')
        },
        fromUserRef: fromUser.ref,
        fromUser: {
          displayName: fromUser.get('displayName'),
          photoURL: fromUser.get('photoURL')
        },
        goodsRef: goods.ref,
        goods: {
          title: goods.get('title'),
          image: goods.get('images')[0]
        },
        comment: {
          body: comment.get('body')
        },
        isRead: false,
        created: comment.get('created')
      };
    };

    let goods;
    let fromUser;
    let toUsers;

    return comment.get('userRef').get()
      .then(u => fromUser = u)
      .then(() => comment.get('goodsRef').get())
      .then(g => goods = g)
      .then(() => {
        const userRefs = [goods.get('userRef')].concat(goods.get('interests'));
        return Promise.all(userRefs.map(r => r.get()));
      })
      .then(u => toUsers = u)
      .then(() => {
        const batches = [];
        const notificationCollection = admin.firestore().collection('notifications');
        toUsers.forEach(toUser => {
          if (toUser.get('notice') && toUser.id !== fromUser.id) {
            batches.push(notificationCollection.add(parseNotification(fromUser, toUser, goods)));
          }
        });
        return Promise.all(batches);
      });
    });
