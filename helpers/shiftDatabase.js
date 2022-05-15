/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
require('dotenv').config();

const getNextWeekId = require('./getNextWeekId');

const { db } = require('../firebase');

const shiftDatabase = async () => {
  // Save old version of database
  const snapshot = await db.collection('schedules').get();

  const oldDatabase = {};

  snapshot.forEach((doc) => {
    oldDatabase[doc.id] = doc.data();
  });

  // Function to delete old weekIds
  const deleteWeeks = async () => {
    for (const weekId in oldDatabase) {
      await db.collection('schedules').doc(weekId).delete();
    }
  };

  // Function to create shifted weekIds
  const createWeeks = async () => {
    for (const weekId in oldDatabase) {
      const nextWeekId = getNextWeekId(weekId);
      const schedules = oldDatabase[weekId];

      await db.collection('schedules').doc(nextWeekId).set(schedules);

      console.log(`Shifted week ${weekId} -> ${nextWeekId}`);
    }
  };

  // Call functions
  await deleteWeeks();
  await createWeeks();
};

module.exports = shiftDatabase;
