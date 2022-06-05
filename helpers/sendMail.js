require('dotenv').config();
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_KEY);

const general = require('./mailTemplates/general');

const sendMail = (to, subject, html) => {
  sgMail.send({
    from: {
      email: 'info@sparkscheduler.com',
      name: 'Spark',
    },
    to,
    subject,
    html: general(html),
  });
};

module.exports = sendMail;
