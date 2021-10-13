require("dotenv").config()
const express = require("express")
const cors = require("cors")
const cron = require("node-cron")
const app = express()

app.use(cors())
app.use(express.json())

const { db, auth } = require("./firebase")
const parse = require("./helpers/parse")
const shiftDatabase = require("./helpers/shiftDatabase")
const generateRandomString = require("./helpers/generateRandomString")
const confirmEmail = require("./helpers/confirmEmail")

// Every monday at midnight, move database
// with demo content to current week
cron.schedule("0 0 * * 1", () => shiftDatabase())

// Empty variable to store settings
let shareWithEmployees

// Helper function to get settings from database
const getSettings = async () => {
  const settings = await db.collection("settings").doc("shareWithEmployees").get()
  shareWithEmployees = settings.data()
}

// Get initial settings when starting server
getSettings()

// Routes

app.get("/updateSettings", async (req, res) => {
  await getSettings()
  res.end()
})

app.post("/createNewUser", async (req, res) => {
  try {
    const { uid } = await auth.createUser({
      email: req.body.email,
      password: generateRandomString(16),
    })

    res.send({ uid })

    const activationToken = generateRandomString(32)

    db.collection("activationTokens").doc(activationToken).set({
      uid,
      iat: Date.now(),
    })
  } catch (err) {
    res.send(err)
  }
})

app.get("/activateAccount", async (req, res) => {
  const emailConfirmed = await confirmEmail(req.query.activationToken, req.query.email)
  res.status(emailConfirmed.status).send(emailConfirmed.body)
})

app.post("/activateAccount", async (req, res) => {
  try {
    // Get UID from activation token and email
    const { uid } = await confirmEmail(req.body.activationToken, req.body.email)

    // Update password
    await auth.updateUser(uid, { password: req.body.password })

    res.end()

    // If user's status is still 'staged', set to 'active'
    const doc = await db.collection("users").doc(uid).get()
    const userData = doc.data()

    if (userData.status === "staged") {
      db.collection("users").doc(uid).update({
        status: "active",
      })
    }
  } catch (err) {
    res.status(404).send({ error: "Invalid request" })
  }
})

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

app.get("/getSchedules/:id", async (req, res) => {
  const uid = req.params.id

  let schedules = {}

  const snapshot = await db.collection("schedules").get()
  snapshot.forEach((doc) => {
    const week = doc.data()

    if (week[uid]) {
      schedules[doc.id] = week[uid].map((day) => {
        if (day) {
          let shiftInfo = {
            start: day.start,
            break: day.break,
            end: day.end,
            place: day.place,
          }

          if (shareWithEmployees.shiftNotes) {
            shiftInfo["notes"] = day.notes
          }

          return shiftInfo
        }
      })
    }
  })

  res.send(schedules)
})

app.get("/getUser/:id", async (req, res) => {
  const uid = req.params.id

  const doc = await db.collection("users").doc(uid).get()
  const data = doc.data()

  let user = {
    id: doc.id,
    status: data.status,
    contract: data.contract,
    firstName: data.firstName,
    lastName: data.lastName,
    role: data.role,
    contractType: data.contractType,
    email: data.email,
    phone: data.phone,
  }

  if (shareWithEmployees.employeeNotes) {
    user["notes"] = data.notes
  }

  res.send(user)
})

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`))
