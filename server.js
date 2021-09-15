require("dotenv").config()
const { v4: uuidv4 } = require("uuid")
const express = require("express")
var cors = require("cors")
const app = express()

app.use(cors())
app.use(express.json())

const { db, auth } = require("./firebase")
const parse = require("./helpers/parse")

app.post("/createNewUser", async (req, res) => {
  try {
    const { uid } = await auth.createUser({
      email: req.body.email,
      password: uuidv4(),
    })

    res.send({uid})
  } catch (err) {
    res.send(err)
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

  const icsContent = parse(schedules)

  res.set("Content-Type", "text/calendar")

  res.send(icsContent)

  console.log(`Served feed to ${uid} at ${new Date().toLocaleString()}`)
})

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`))
