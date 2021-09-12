require("dotenv").config()
const express = require("express")
const app = express()

const { db } = require("./firebase")
const parse = require("./helpers/parse")

app.get("/feed/:id", async (req, res) => {
  const uid = req.params.id

  let schedules = {}

  const snapshot = await db.collection("schedules").get()
  snapshot.forEach((doc) => {

    const week = doc.data();

    if(week[uid]) {
      schedules[doc.id] = week[uid]
    }

  })

  const icsContent = parse(schedules)

  res.set('Content-Type', 'text/calendar');

  res.send(icsContent)

  console.log(`Served feed to ${uid} at ${new Date().toLocaleString()}`)
})

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`))
