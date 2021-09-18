require("dotenv").config()

const getNextWeekId = require('./getNextWeekId')

const { db } = require("../firebase")

const shiftDatabase = async () => {

  let oldDatabase = {}

  const snapshot = await db.collection("schedules").get()

  // Save old version of database

  snapshot.forEach((doc) => {

    oldDatabase[doc.id] = doc.data()
  
  })

  // Create new version of database

  for (const weekId in oldDatabase) {

    const nextWeekId = getNextWeekId(weekId)
    const schedules = oldDatabase[weekId]
    
    // Add new weekId to database
    await db.collection("schedules").doc(nextWeekId).set(schedules)
    
    // Delete old weekId
    await db.collection("schedules").doc(weekId).delete()

    console.log(`Shifted week ${weekId} -> ${nextWeekId}`)

  }
  
}

module.exports = shiftDatabase