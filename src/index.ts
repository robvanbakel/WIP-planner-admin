import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import { User, Shift } from './types';

import redis from './redis';

import shiftDatabase from './helpers/shiftDatabase';
import parse from './helpers/parse';
import onStart from './helpers/onStart';
import getCollection from './helpers/getCollection';
import { logger, demoGuard } from './routes/middleware';

import routes from './routes';
import adminRoutes from './routes/admin';

dotenv.config();

redis.connect();

const app = express();

app.use(cors());
app.use(express.json());

// Every monday at midnight, move database
// with demo content to current week
cron.schedule('0 0 * * 1', shiftDatabase);

app.use(logger);
app.use(demoGuard);

// // Routes
app.use('/admin', routes);
app.use('/admin', adminRoutes);

app.get('/feed/:token', async (req, res) => {
  const users = await getCollection<User>('users');
  const foundUser = users.find((user) => user.feedToken === req.params.token);

  if (!foundUser) {
    res.status(404).end();
    return;
  }

  const shifts = await getCollection<Shift>('shifts');

  const userShifts = shifts
    .filter((shift) => shift.employeeId === foundUser.id && shift.status !== 'PROPOSED');

  const icsContent = await parse(userShifts);

  res.header('Content-Type', 'text/calendar').end(icsContent);
});

app.listen(process.env.PORT, onStart);
