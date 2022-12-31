import { Router } from 'express';

import { db, auth } from '../firebase';

import getUserFromToken from '../helpers/getUserFromToken';
import getCollection from '../helpers/getCollection';
import confirmEmail from '../helpers/confirmEmail';

import { Shift, User } from '../types';

const router = Router();

router.get('/activateAccount', async (req, res) => {
  // Check if provided email matches provided activation token
  const emailConfirmed = await confirmEmail(
    req.query.activationToken as string,
    req.query.email as string,
  );
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
    if (userData?.status === 'staged') {
      db.collection('users').doc(uid).update({
        status: 'active',
      });
    }
  } catch (err) {
    res.status(404).send({ error: 'Invalid request' });
  }
});

router.patch('/accept/:shiftId', async (req, res) => {
  const user = await getUserFromToken(req.headers.authorization as string);

  if (!user) {
    res.status(401).end();
    return;
  }

  const shifts = await getCollection<Shift>('shifts');
  const foundShift = shifts.find((shift) => shift.id === req.params.shiftId);

  if (foundShift?.employeeId !== user.id) {
    res.status(403).end();
    return;
  }

  await db.collection('shifts').doc(req.params.shiftId).update({
    status: 'ACCEPTED',
    statusUpdated: new Date().toISOString(),
  });

  res.end();
});

router.get('/db/shifts', async (req, res) => {
  const user = await getUserFromToken(req.headers.authorization as string);

  if (!user) {
    res.status(401).end();
    return;
  }

  const shifts = await getCollection<Shift>('shifts');

  if (user.status === 'ADMIN') {
    res.json(shifts).end();
    return;
  }

  const dataByEmployee = shifts.filter((shift) => shift.employeeId === user.id);

  res.json(dataByEmployee).end();
});

router.get('/db/users', async (req, res) => {
  const user = await getUserFromToken(req.headers.authorization as string);

  if (!user) {
    res.status(401).end();
    return;
  }

  const users = await getCollection<User>('users');

  if (user.status === 'ADMIN') {
    res.json(users).end();
    return;
  }

  const dataByEmployee = users.find((v) => v.id === user.id);

  res.json(dataByEmployee).end();
});

export default router;
