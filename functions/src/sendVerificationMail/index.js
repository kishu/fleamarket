//* FIRST SETUP SENDGRID KEY
//*  firebase functions:config:set sendgrid.key=SG.YOUR_API_KEY

const cors = require('cors')({origin: true});
const functions = require('firebase-functions');
const sgMail = require('@sendgrid/mail');

const SENDGRID_API_KEY = functions.config().sendgrid.key;
const TEMPLATE_ID = functions.config().sendgrid.template.verification;
sgMail.setApiKey(SENDGRID_API_KEY);

module.exports = functions
  .region('us-central1')
  .https.onRequest((req, res) => {
    return cors(req, res, () => {
      const {to, groupName, verificationCode} = req.body.data;

      const msg = {
        to,
        from: {
          email: 'auth@2ndmarket.co',
          name: '세컨드마켓'
        },
        templateId: TEMPLATE_ID,
        dynamic_template_data: {groupName, verificationCode}
      };

      sgMail.send(msg).then(() => {
        res.status(200).send({data: { message: 'ok' }} );
      }).catch(() => {
        res.status(500).send();
      });
    });
  });
