require('dotenv').config();
const { db } = require('../firebase');
const dayjs = require('../dayjs');

const shiftDatabase = async () => {
  const snapshot = await db.collection('shifts').get();
  snapshot.forEach((doc) => {
    const shift = doc.data();
    db.collection('shifts').doc(doc.id).update({
      from: dayjs(shift.from).add(1, 'week').dateTime(),
      to: dayjs(shift.to).add(1, 'week').dateTime(),
    });
  });
};

module.exports = shiftDatabase;
