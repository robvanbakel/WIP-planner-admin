const getWeekId = require("./getWeekId")
const getDatesFromWeekId = require("./getDatesFromWeekId")

const getNextWeekId = (weekId) => {
  const [monday] = getDatesFromWeekId(weekId)

  const nextMonday = new Date(monday.setDate(monday.getDate() + 7))

  return getWeekId(nextMonday)
}

module.exports = getNextWeekId
