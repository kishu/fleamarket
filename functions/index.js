const admin = require('firebase-admin');
admin.initializeApp();

exports.sendVerificationMail = require('./src/sendVerificationMail');
exports.createCommentTrigger = require('./src/createCommentTrigger');
exports.createNotificationTrigger = require('./src/createNotificationTrigger');
