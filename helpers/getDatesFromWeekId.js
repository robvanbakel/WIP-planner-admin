const getDatesFromWeekId = weekId => {
  const [year, week] = weekId.split("-")

  let dates = []

  // Find first day of week

  let monday = new Date(year, 0, 1 + (week - 1) * 7)

  if (monday.getDay() <= 4) {
    monday.setDate(monday.getDate() - monday.getDay() + 1)
  } else {
    monday.setDate(monday.getDate() + 8 - monday.getDay())
  }

  // Add function to iterate through days

  Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf())
    date.setDate(date.getDate() + days)
    return date
  }

  // Fill date array

  for (let i = 0; i < 7; i++) {
    dates.push(monday.addDays(i))
  }

  return dates
}

module.exports = getDatesFromWeekId