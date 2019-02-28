//const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
admin.firestore().settings({ timestampsInSnapshots: true });

exports.sendVerificationMail = require('./src/sendVerificationMail');
exports.createCommentTrigger = require('./src/createCommentTrigger');
exports.createNotificationTrigger = require('./src/createNotificationTrigger');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
