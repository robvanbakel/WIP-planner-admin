require('dotenv').config();

const duration = require('dayjs/plugin/duration');
const redis = require('./redis');
const dayjs = require('./dayjs');

dayjs.extend(duration);

const { db, FieldValue } = require('./firebase');

redis.connect();

const getCollection = require('./helpers/getCollection');

const randInt = (max = 99, min = 0) => Math.floor(Math.random() * (max - min)) + min;

const main = async (weekId) => {
  const locations = ['Front Desk', 'Front Desk', 'Restaurant', 'Restaurant', 'Bar', 'Bar', 'Kitchen', 'Kitchen', 'Housekeeping', 'Housekeeping', 'Training'];
  const breaks = ['15', '30', '45', '60'];
  const mins = [0, 30];
  const statuses = ['ACCEPTED', 'ACCEPTED', 'ACCEPTED', 'PROPOSED'];

  const [year, week] = weekId.split('-');

  const monday = dayjs().year(year).isoWeek(week).startOf('isoWeek');
  const dates = Array.from({ length: 7 }, (element, index) => monday.add(index, 'day'));

  const users = await getCollection('users');

  const employeeIds = users.filter((user) => !user.admin).map((user) => user.id);

  const shifts = [];

  employeeIds.forEach((employeeId) => {
    for (let i = 0; i < randInt(5, 2) + 1; i += 1) {
      const date = dates[randInt(dates.length)];
      const from = date.hour(randInt(18, 4)).minute(mins[randInt(mins.length)]);
      let to = from.add(randInt(9, 4), 'hour').add(mins[randInt(mins.length)], 'minute');

      if (!from.isSame(to, 'date')) {
        to = to.subtract(to.hour() + 1, 'hour');
      }

      shifts.push({
        employeeId,
        location: locations[randInt(locations.length)],
        statusUpdated: new Date().toISOString(),
        notes: '',
        break: breaks[randInt(breaks.length)],
        status: statuses[randInt(statuses.length)],
        from: from.format('YYYY-MM-DDTHH:mm'),
        to: to.format('YYYY-MM-DDTHH:mm'),
      });
    }
  });

  const batch = db.batch();

  shifts.forEach((doc) => {
    batch.set(db.collection('shifts').doc(), doc);
  });

  batch.commit();
};

// main('2022-26');

const setToAccepted = async () => {
  const shifts = await getCollection('shifts');

  shifts.forEach((doc) => {
    if (doc.status === 'PROPOSED') {
      db.collection('shifts').doc(doc.id).update({
        status: 'ACCEPTED',
      });
    }
  });
};

// setToAccepted();
