require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');

const app = express();

app.use(cors());
app.use(express.json());

const redis = require('./redis');

redis.connect();

const parse = require('./helpers/parse');
const shiftDatabase = require('./helpers/shiftDatabase');
const onStart = require('./helpers/onStart');
const getCollection = require('./helpers/getCollection');

// Every monday at midnight, move database
// with demo content to current week
cron.schedule('0 0 * * 1', () => shiftDatabase());

// Routes
app.use('/admin', require('./routes'));
app.use('/admin', require('./routes/admin'));

app.get('/feed/:token', async (req, res) => {
  const users = await getCollection('users');
  const foundUser = users.find((user) => user.feedToken === req.params.token);

  if (!foundUser) {
    res.status(404).end();
    return;
  }

  const shifts = await getCollection('shifts');
  const userShifts = shifts.filter((shift) => shift.employeeId === foundUser.id && shift.status !== 'PROPOSED');

  const icsContent = await parse(userShifts);

  res.header('Content-Type', 'text/calendar').end(icsContent);
});

app.listen(process.env.PORT, onStart);
