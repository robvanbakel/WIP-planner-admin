const express = require('express')
const router = express.Router()

const { db, auth } = require('./firebase')

const generateRandomString = require('./helpers/generateRandomString')
const confirmEmail = require('./helpers/confirmEmail')
const sendMail = require('./helpers/sendMail')

// Empty variable to store settings
let shareWithEmployees
let location

// Helper function to get settings from database
const getSettings = async () => {
  const getShareWithEmployees = await db.collection('settings').doc('shareWithEmployees').get()
  shareWithEmployees = getShareWithEmployees.data()

  const getLocation = await db.collection('settings').doc('location').get()
  location = getLocation.data()
}

// Get initial settings when starting server
getSettings()

// Route to update locally saved settings when called
router.get('/updateSettings', async (req, res) => {
  await getSettings()
  res.end()
})

router.post('/createNewUser', async (req, res) => {
  try {
    // Create new user with random password, return uid to frontend
    const { uid } = await auth.createUser({
      email: req.body.email,
      password: generateRandomString(16),
    })

    res.send({ uid })

    // Create activation token and store in database
    const activationToken = generateRandomString(32)

    db.collection('activationTokens').doc(activationToken).set({
      uid,
      iat: Date.now(),
    })

    // Send mail with activation token to provided email address
    sendMail({ activationToken, email: req.body.email, firstName: req.body.firstName })
  } catch (err) {
    res.send(err)
  }
})

router.get('/activateAccount', async (req, res) => {
  // Check if provided email matches provided activation token
  const emailConfirmed = await confirmEmail(req.query.activationToken, req.query.email)
  res.status(emailConfirmed.status).send(emailConfirmed.body)
})

router.post('/activateAccount', async (req, res) => {
  try {
    // Get UID from activation token and email
    const { uid } = await confirmEmail(req.body.activationToken, req.body.email)

    // Update password
    await auth.updateUser(uid, { password: req.body.password })

    res.end()

    // Delete activation token
    db.collection('activationTokens').doc(req.body.activationToken).delete()

    // Get user info from database
    const doc = await db.collection('users').doc(uid).get()
    const userData = doc.data()

    // If user's status has not been changed by employer, update status
    if (userData.status === 'staged') {
      db.collection('users').doc(uid).update({
        status: 'active',
      })
    }
  } catch (err) {
    res.status(404).send({ error: 'Invalid request' })
  }
})

router.get('/getSchedules/:id', async (req, res) => {
  const { id: uid } = req.params
  const schedules = {}

  // Get schedules from database
  const snapshot = await db.collection('schedules').get()
  snapshot.forEach((doc) => {
    const week = doc.data()

    // If uid is present in current week, map schedule to response object
    if (week[uid]) {
      schedules[doc.id] = week[uid].map((day) => {
        if (day) {
          let shiftInfo = {
            start: day.start,
            break: day.break,
            end: day.end,
            place: day.place,
          }

          // When enabled by employer, include shift notes
          shareWithEmployees.shiftNotes && (shiftInfo['notes'] = day.notes)

          return shiftInfo
        }
      })
    }
  })

  res.send(schedules)
})

router.get('/getUser/:id', async (req, res) => {
  const { id: uid } = req.params

  // Get user info from database
  const doc = await db.collection('users').doc(uid).get()
  const data = doc.data()

  // Map user data to response object
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

  // When enabled by employer, include employee notes
  shareWithEmployees.employeeNotes && (user['notes'] = data.notes)

  res.send(user)
})

module.exports = router
