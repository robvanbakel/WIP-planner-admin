require("dotenv").config()
const express = require("express")
const cors = require("cors")
const cron = require("node-cron")
const app = express()

app.use(cors())
app.use(express.json())

const shiftDatabase = require("./helpers/shiftDatabase")

// Every monday at midnight, move database
// with demo content to current week
cron.schedule("0 0 * * 1", () => shiftDatabase())

// Routes
app.use("/", require("./routes"))

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`))
