const { Router } = require('express');
const { adminOnly } = require('./guards');

const sendMail = require('../helpers/sendMail');
const generateRandomString = require('../helpers/generateRandomString');

const activateAccount = require('../helpers/mailTemplates/activateAccount');
const acceptShift = require('../helpers/mailTemplates/acceptShift');

const { db, auth } = require('../firebase');
const getCollection = require('../helpers/getCollection');

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

router.get('/notify/acceptShift/:shiftId', async (req, res) => {
  const shifts = await getCollection('shifts');
  const foundShift = shifts.find((shift) => shift.id === req.params.shiftId);

  sendMail(foundShift.employeeId, 'Requesting your acceptance', acceptShift());

  res.end();
});

router.delete('/db/:collection/:doc', async (req, res) => {
  await db.collection(req.params.collection).doc(req.params.doc).delete();
  res.end();
});

router.patch('/db/:collection/:doc', async (req, res) => {
  await db.collection(req.params.collection).doc(req.params.doc).update(req.body);
  res.end();
});

router.post('/db/:collection/:doc', async (req, res) => {
  await db.collection(req.params.collection).doc(req.params.doc).set(req.body);
  res.end();
});

module.exports = router;
