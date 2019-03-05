const cors = require('cors')({origin: true});
const functions = require('firebase-functions');
const sgMail = require('@sendgrid/mail');

const SENDGRID_API_KEY = functions.config().sendgrid.key;
const TEMPLATE_ID = functions.config().sendgrid.template.notification;
sgMail.setApiKey(SENDGRID_API_KEY);

module.exports = functions
  .region('us-central1')
  .firestore
  .document('notifications/{notificationId}')
  .onCreate((notification, context) => {
    const fromUser = notification.get('fromUser');
    const goods = notification.get('goods');
    const body = notification.get('body');

    return notification.get('toUserRef').get()
      .then(toUser => {
        const msg = {
          to: toUser.get('email'),
          from: {
            email: 'notification@2ndmarket.co',
            name: '세컨드마켓'
          },
          templateId: TEMPLATE_ID,
          dynamic_template_data: {
            fromUserDisplayName: fromUser.displayName,
            goodsTitle: goods.title,
            body: body }
        };

        return sgMail.send(msg);
      });
  });
