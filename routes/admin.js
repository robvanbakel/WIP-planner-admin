const { Router } = require('express');
const { adminOnly } = require('./middleware');

const sendMail = require('../helpers/mail/sendMail');
const generateRandomString = require('../helpers/generateRandomString');

const activateAccount = require('../helpers/mail/templates/activateAccount');
const scheduleUpdated = require('../helpers/mail/templates/scheduleUpdated');
const shiftCancelled = require('../helpers/mail/templates/shiftCancelled');

const { db, auth } = require('../firebase');
const getCollection = require('../helpers/getCollection');
const dayjs = require('../dayjs');

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

router.patch('/db/shifts/:doc', async (req, res) => {
  const shifts = await getCollection('shifts');
  const oldState = shifts.find((shift) => shift.id === req.params.doc);

  if (oldState.employeeId !== req.body.employeeId) {
    const collision = shifts.find((shift) => shift.employeeId === req.body.employeeId && dayjs(shift.from).isSame(dayjs(req.body.from), 'date'));

    if (collision) {
      await db.collection('shifts').doc(collision.id).delete();
    }

    await db.collection('shifts').doc(req.params.doc).update({ ...req.body, status: 'PROPOSED' });
    await sendMail(oldState.employeeId, 'Your shift has been cancelled', shiftCancelled({ from: oldState.from }));
    await sendMail(req.body.employeeId, 'Your schedule has been updated', scheduleUpdated({ week: dayjs(req.body.from).format('W') }));

    res.end();
    return;
  }

  if (oldState.from !== req.body.from || oldState.to !== req.body.to) {
    const collision = shifts.find((shift) => shift.id !== req.params.doc && dayjs(shift.from).isSame(dayjs(req.body.from), 'date'));

    if (collision) {
      await db.collection('shifts').doc(collision.id).delete();
    }

    await db.collection('shifts').doc(req.params.doc).update({ ...req.body, status: 'PROPOSED' });

    if (oldState.status === 'ACCEPTED') {
      await sendMail(req.body.employeeId, 'Your schedule has been updated', scheduleUpdated({ week: dayjs(req.body.from).format('W') }));
    }

    res.end();
    return;
  }

  await db.collection('shifts').doc(req.params.doc).update(req.body);
  res.end();
});

router.post('/db/shifts/:doc', async (req, res) => {
  const shifts = await getCollection('shifts');

  const collision = shifts.find((shift) => shift.employeeId === req.body.employeeId && dayjs(shift.from).isSame(dayjs(req.body.from), 'date'));

  if (collision) {
    await db.collection('shifts').doc(collision.id).delete();
  }

  await db.collection('shifts').doc(req.params.doc).set({ ...req.body, status: 'PROPOSED' });
  await sendMail(req.body.employeeId, 'Your schedule has been updated', scheduleUpdated({ week: dayjs(req.body.from).format('W') }));

  res.end();
});

router.delete('/db/shifts/:doc', async (req, res) => {
  const shifts = await getCollection('shifts');
  const oldState = shifts.find((shift) => shift.id === req.params.doc);

  await db.collection('shifts').doc(req.params.doc).delete();
  await sendMail(oldState.employeeId, 'Your shift has been cancelled', shiftCancelled({ from: oldState.from }));

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
