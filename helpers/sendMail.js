require("dotenv").config()
const sgMail = require("@sendgrid/mail")

const activationMailTemplate = require("./activationMailTemplate")

sgMail.setApiKey(process.env.SENDGRID_KEY)

const sendMail = ({ activationToken, email, firstName }) => {

  // Create link with query param holding activation token
  const activationLink = `https://app.sparkscheduler.com/auth?activationToken=${activationToken}`

  // Send activation mail to user using SendGrid API
  sgMail.send({
    to: email,
    from: {
      email: "info@sparkscheduler.com",
      name: "Spark",
    },
    subject: `Activate your account`,
    html: activationMailTemplate({ activationLink, firstName }),
  })
}

module.exports = sendMail
