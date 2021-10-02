require("dotenv").config()

const { db } = require("../firebase")

// Define amount of minutes settings should be stored in memory
const MINUTES_UNTIL_NEW_LOAD = 60

// Set empty variables
let timestamp = null
let shareWithEmployees = null

const getSettings = async () => {

  // If timestamp of last load is older than one hour, load new data
  if (timestamp + 1000 * 60 * MINUTES_UNTIL_NEW_LOAD < Date.now()) {
    const settings = await db.collection("settings").doc("shareWithEmployees").get()
    shareWithEmployees = settings.data()

    // Reset timestamp
    timestamp = Date.now()
  }

  return shareWithEmployees
}

module.exports = getSettings
