const cors = require('cors')({origin: true});
const functions = require('firebase-functions');
const sgMail = require('@sendgrid/mail');

const SENDGRID_API_KEY = functions.config().sendgrid.key;
const TEMPLATE_ID = functions.config().sendgrid.template.verification;
sgMail.setApiKey(SENDGRID_API_KEY);

module.exports = functions
  .region('asia-northeast1')
  .firestore
  .document('notifications/{notificationId}')
  .onCreate((notification, context) => {
    const fromUserDisplayName = notification.get('fromUserDisplayName');
    const goodsTitle = notification.get('goodsTitle');
    const body = notification.get('body');

    return notification.get('toUserRef').get().then(toUser => {
      const msg = {
        to: toUser.data().email,
        from: {
          email: 'notification@2ndmarket.co',
          name: '세컨드마켓'
        },
        templateId: TEMPLATE_ID,
        dynamic_template_data: {fromUserDisplayName, goodsTitle, body}
      };

      return sgMail.send(msg);
    });
  });
