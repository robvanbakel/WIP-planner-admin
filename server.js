require("dotenv").config()
const express = require("express")
const cors = require("cors")
const cron = require("node-cron")
const app = express()

app.use(cors())
app.use(express.json())

const { db } = require("./firebase")

const parse = require("./helpers/parse")
const shiftDatabase = require("./helpers/shiftDatabase")

// Empty variable to store settings
let shareWithEmployees

// Helper function to get settings from database
const getSettings = async () => {
  const settings = await db.collection("settings").doc("shareWithEmployees").get()
  shareWithEmployees = settings.data()
}

// Get initial settings when starting server
getSettings()

// Every monday at midnight, move database
// with demo content to current week
cron.schedule("0 0 * * 1", () => shiftDatabase())

// Routes
app.use("/admin", require("./routes"))

app.get("/feed/:id", async (req, res) => {
  const uid = req.params.id

  let schedules = {}

  const snapshot = await db.collection("schedules").get()
  snapshot.forEach((doc) => {
    const week = doc.data()

    if (week[uid]) {
      schedules[doc.id] = week[uid]
    }
  })

  const icsContent = parse(schedules, { shareNotes: shareWithEmployees.shiftNotes })

  res.set("Content-Type", "text/calendar")

  res.send(icsContent)

  console.log(`Served feed to ${uid} at ${new Date().toLocaleString()}`)
})

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`))
