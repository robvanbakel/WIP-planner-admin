const getDatesFromWeekId = (weekId) => {
  const [year, week] = weekId.split('-');

  const dates = [];

  // Find first day of week

  const monday = new Date(year, 0, 1 + (week - 1) * 7);

  if (monday.getDay() <= 4) {
    monday.setDate(monday.getDate() - monday.getDay() + 1);
  } else {
    monday.setDate(monday.getDate() + 8 - monday.getDay());
  }

  // Add function to iterate through days

  // eslint-disable-next-line no-extend-native
  Date.prototype.addDays = function (days) {
    const date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  };

  // Fill date array

  for (let i = 0; i < 7; i += 1) {
    dates.push(monday.addDays(i));
  }

  return dates;
};

module.exports = getDatesFromWeekId;
