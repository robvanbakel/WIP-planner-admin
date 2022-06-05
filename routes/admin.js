const { Router } = require('express');
const { adminOnly, notify } = require('./middleware');

const sendMail = require('../helpers/mail/sendMail');
const generateRandomString = require('../helpers/generateRandomString');

const activateAccount = require('../helpers/mail/templates/activateAccount');

const { db, auth } = require('../firebase');

const router = Router();

router.use(adminOnly);

router.post('/db/users/:uid', async (req, res) => {
  try {
    await auth.createUser({
      uid: req.params.uid,
      email: req.body.email,
      password: generateRandomString(16),
    });

    const activationToken = generateRandomString(32);

    await db.collection('activationTokens').doc(activationToken).set({
      uid: req.params.uid,
      iat: new Date().toISOString(),
    });

    await db.collection('users').doc(req.params.uid).set({
      ...req.body,
      status: 'STAGED',
      feedToken: generateRandomString(36),
      createdAt: Date.now(),
    });

    // Send mail with activation token to provided email address
    sendMail({ email: req.body.email, fristName: req.body.firstName }, 'Activate your account', activateAccount({ activationToken }));

    res.end();
  } catch (err) {
    if (err.errorInfo.code === 'auth/email-already-exists') {
      res.status(409).json(err.errorInfo).end();
    }
    res.status(400).end();
  }
});

router.delete('/db/:collection/:doc', notify, async (req, res) => {
  await db.collection(req.params.collection).doc(req.params.doc).delete();
  res.end();
});

router.patch('/db/:collection/:doc', notify, async (req, res) => {
  await db.collection(req.params.collection).doc(req.params.doc).update(req.body);
  res.end();
});

router.post('/db/:collection/:doc', notify, async (req, res) => {
  await db.collection(req.params.collection).doc(req.params.doc).set(req.body);
  res.end();
});

module.exports = router;
