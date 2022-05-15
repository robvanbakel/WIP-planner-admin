const getWeekId = (date = new Date()) => {
  // Add function to Date object to get weekId

  // eslint-disable-next-line no-extend-native
  Date.prototype.getWeekId = () => {
    // Find Thursday in current week
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);

    // Get year and week values from date object
    const year = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const week = Math.ceil(((d - year) / 86400000 + 1) / 7);

    // Return formatted weekId
    return `${year.getFullYear()}-${week.toString().padStart(2, '0')}`;
  };

  return date.getWeekId();
};

module.exports = getWeekId;
