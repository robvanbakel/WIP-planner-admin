const { Router } = require('express');

const router = Router();
const axios = require('axios');
const dayjs = require('./dayjs');

const { db, auth } = require('./firebase');

const generateRandomString = require('./helpers/generateRandomString');
const getUserFromToken = require('./helpers/getUserFromToken');
const getCollection = require('./helpers/getCollection');
const confirmEmail = require('./helpers/confirmEmail');
const sendMail = require('./helpers/sendMail');

// Empty variable to store settings
let shareWithEmployees;

// Helper function to get settings from database
const getSettings = async () => {
  const getShareWithEmployees = await db.collection('settings').doc('shareWithEmployees').get();
  shareWithEmployees = getShareWithEmployees.data();
};

// Get initial settings when starting server
getSettings();

// Route to update locally saved settings when called
router.get('/updateSettings', async (req, res) => {
  await getSettings();
  res.end();
});

router.post('/createNewUser', async (req, res) => {
  try {
    // Create new user with random password, return uid to frontend
    const { uid } = await auth.createUser({
      email: req.body.email,
      password: generateRandomString(16),
    });

    res.send({ uid });

    // Create activation token and store in database
    const activationToken = generateRandomString(32);

    db.collection('activationTokens').doc(activationToken).set({
      uid,
      iat: Date.now(),
    });

    // Send mail with activation token to provided email address
    sendMail({ activationToken, email: req.body.email, firstName: req.body.firstName });
  } catch (err) {
    res.send(err);
  }
});

router.get('/activateAccount', async (req, res) => {
  // Check if provided email matches provided activation token
  const emailConfirmed = await confirmEmail(req.query.activationToken, req.query.email);
  res.status(emailConfirmed.status).send(emailConfirmed.body);
});

router.post('/activateAccount', async (req, res) => {
  try {
    // Get UID from activation token and email
    const { uid } = await confirmEmail(req.body.activationToken, req.body.email);

    // Update password
    await auth.updateUser(uid, { password: req.body.password });

    res.end();

    // Delete activation token
    db.collection('activationTokens').doc(req.body.activationToken).delete();

    // Get user info from database
    const doc = await db.collection('users').doc(uid).get();
    const userData = doc.data();

    // If user's status has not been changed by employer, update status
    if (userData.status === 'staged') {
      db.collection('users').doc(uid).update({
        status: 'active',
      });
    }
  } catch (err) {
    res.status(404).send({ error: 'Invalid request' });
  }
});

router.get('/getSchedules/:employeeId', async (req, res) => {
  const schedules = {};

  const fetchData = async (doc) => {
    if (process.env.NODE_ENV === 'development') {
      const { data } = await axios.get(process.env.DATA + doc);
      // eslint-disable-next-line no-shadow
      const rawData = data.map(({ id, data }) => ({ id, data: () => data }));

      const DUMMY_FILTERED = rawData
        .map((shift) => ({ shiftId: shift.id, ...shift.data() }))
        .filter((shift) => shift.employeeId === req.params.employeeId)
        .map((shift) => shift.shiftId);

      return data.filter((shift) => DUMMY_FILTERED
        .includes(shift.id))
        // eslint-disable-next-line no-shadow
        .map(({ id, data }) => ({ id, data: () => data }));
    }
    const shiftsRef = db.collection('shifts');
    const query = shiftsRef.where('employeeId', '==', req.params.employeeId);
    return query.get();
  };

  const snapshot = await fetchData('shifts');

  snapshot.forEach((doc) => {
    const data = doc.data();

    const weekId = dayjs(data.from).weekId();

    schedules[weekId] = schedules[weekId] || new Array(7).fill(null);

    schedules[weekId][dayjs(data.from).isoWeekday() - 1] = {
      shiftId: doc.id,
      start: dayjs(data.from).format('HHmm'),
      break: data.break.toString(),
      end: dayjs(data.to).format('HHmm'),
      place: data.location,
      accepted: data.status === 'ACCEPTED',
      notes: data.notes,
    };
  });

  res.send(schedules);
});

router.get('/getUser/:id', async (req, res) => {
  const { id: uid } = req.params;

  // Get user info from database
  const doc = await db.collection('users').doc(uid).get();
  const data = doc.data();

  // Map user data to response object
  const user = {
    id: doc.id,
    status: data.status,
    contract: data.contract,
    firstName: data.firstName,
    lastName: data.lastName,
    role: data.role,
    contractType: data.contractType,
    email: data.email,
    phone: data.phone,
  };

  // When enabled by employer, include employee notes
  if (shareWithEmployees.employeeNotes) user.notes = data.notes;

  res.send(user);
});

router.get('/accept/:shiftId', async (req, res) => {
  try {
    const user = await getUserFromToken(req.headers.authorization);

    const shifts = await getCollection('shifts');
    const foundShift = shifts.find((shift) => shift.id === req.params.shiftId);

    if (foundShift.employeeId === user.id) {
      db.collection('shifts').doc(req.params.shiftId).update({
        status: 'ACCEPTED',
      });
    }

    res.end();
  } catch (err) {
    res.status(401).end();
  }
});

router.get('/db/shifts', async (req, res) => {
  const user = await getUserFromToken(req.headers.authorization);

  if (!user) {
    res.status(401).end();
    return;
  }

  const shifts = await getCollection('shifts');

  if (user.status === 'admin') {
    res.json(shifts).end();
    return;
  }

  const dataByEmployee = shifts.filter((shift) => shift.employeeId === user.id);
  res.json(dataByEmployee).end();
});

router.get('/db/users', async (req, res) => {
  const user = await getUserFromToken(req.headers.authorization);

  if (!user) {
    res.status(401).end();
    return;
  }

  const users = await getCollection('users');

  if (user.status === 'admin') {
    res.json(users).end();
    return;
  }

  const dataByEmployee = users.find((v) => v.id === user.id);
  res.json(dataByEmployee).end();
});

router.get('/db/settings', async (req, res) => {
  const user = await getUserFromToken(req.headers.authorization);

  if (!user) {
    res.status(401).end();
    return;
  }

  const users = await getCollection('settings');

  res.json(users).end();
});

router.delete('/db/:collection/:doc', async (req, res) => {
  const user = await getUserFromToken(req.headers.authorization);

  if (!user) {
    res.status(401).end();
    return;
  }

  if (user.status !== 'admin') {
    res.status(403).end();
    return;
  }

  await db.collection(req.params.collection).doc(req.params.doc).delete();
  res.end();
});

module.exports = router;
