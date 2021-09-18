const getWeekId = (date = new Date()) => {

  // Add function to Date object to get weekId

  Date.prototype.getWeekId = function() {
    var d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    var dayNum = d.getUTCDay() || 7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum)
    const year = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    const week = Math.ceil(((d - year) / 86400000 + 1) / 7)
    return `${year.getFullYear()}-${week.toString().padStart(2,'0')}`
  }

  return date.getWeekId()

}

module.exports = getWeekId
