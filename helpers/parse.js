const { v4: uuidv4 } = require("uuid")

const getDatesFromWeekId = require("./getDatesFromWeekId")

const parse = (schedules, {shareNotes}) => {
  // Open string that will be served as a calendar stream (.ics)
  let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Rob van Bakel//Spark//EN"

  for (const weekId in schedules) {
    // Establish dates from weekId
    const dates = getDatesFromWeekId(weekId)

    schedules[weekId].forEach((shift, index) => {
      if (shift) {
        // Format date
        const date = dates[index].getDate().toString().padStart(2, "0")
        const month = (dates[index].getMonth() + 1).toString().padStart(2, "0")
        const year = dates[index].getFullYear()

        // Open event in .ics content
        icsContent = icsContent.concat("\nBEGIN:VEVENT")

        // Add UID to event in .ics content
        icsContent = icsContent.concat(`\nUID:${uuidv4()}`)

        // Add timestamp to event in .ics content
        icsContent = icsContent.concat(`\nDTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}`)

        // Add date and time string to .ics content
        icsContent = icsContent.concat(`\nDTSTART:${year}${month}${date}T${shift.start}00\nDTEND:${year}${month}${date}T${shift.end}00`)

        // Add date and time string to .ics content
        icsContent = icsContent.concat(`\nSUMMARY:${shift.place}`)

        // Add location to .ics content
        icsContent = icsContent.concat(`\nLOCATION:Stationsplein\\, 5611 AD Eindhoven`)

        // If note is present, add notes to .ics content
        if (shift.notes && shareNotes) {
          icsContent = icsContent.concat(`\nDESCRIPTION:${shift.notes}`)
        }

        // Close event in .ics content
        icsContent = icsContent.concat(`\nEND:VEVENT`)
      }
    })
  }

  // Close .ics content string
  icsContent = icsContent.concat("\nEND:VCALENDAR")

  return icsContent
}

module.exports = parse
