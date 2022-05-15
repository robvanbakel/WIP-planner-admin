const getWeekId = require('./getWeekId');
const getDatesFromWeekId = require('./getDatesFromWeekId');

const getNextWeekId = (weekId) => {
  // Get first date object from array of dates and add 7 days
  const [monday] = getDatesFromWeekId(weekId);
  const nextMonday = new Date(monday.setDate(monday.getDate() + 7));

  return getWeekId(nextMonday);
};

module.exports = getNextWeekId;
