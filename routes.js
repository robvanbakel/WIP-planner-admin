const express = require("express")
const router = express.Router()

const { db, auth } = require("./firebase")

const generateRandomString = require("./helpers/generateRandomString")
const confirmEmail = require("./helpers/confirmEmail")
const sendMail = require("./helpers/sendMail")

// Empty variable to store settings
let shareWithEmployees

// Helper function to get settings from database
const getSettings = async () => {
  const settings = await db.collection("settings").doc("shareWithEmployees").get()
  shareWithEmployees = settings.data()
}

// Get initial settings when starting server
getSettings()

router.get("/updateSettings", async (req, res) => {
  await getSettings()
  res.end()
})

router.post("/createNewUser", async (req, res) => {
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

    sendMail({ activationToken, email: req.body.email, firstName: req.body.firstName })
  } catch (err) {
    res.send(err)
  }
})

router.get("/activateAccount", async (req, res) => {
  const emailConfirmed = await confirmEmail(req.query.activationToken, req.query.email)
  res.status(emailConfirmed.status).send(emailConfirmed.body)
})

router.post("/activateAccount", async (req, res) => {
  try {
    // Get UID from activation token and email
    const { uid } = await confirmEmail(req.body.activationToken, req.body.email)

    // Update password
    await auth.updateUser(uid, { password: req.body.password })

    res.end()

    // Delete activation token
    db.collection("activationTokens").doc(req.body.activationToken).delete()

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

router.get("/getSchedules/:id", async (req, res) => {
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

router.get("/getUser/:id", async (req, res) => {
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

module.exports = router
