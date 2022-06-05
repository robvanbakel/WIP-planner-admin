require('dotenv').config();
const sgMail = require('@sendgrid/mail');
const getCollection = require('../getCollection');

sgMail.setApiKey(process.env.SENDGRID_KEY);

const general = require('./base');

const sendMail = async (to, subject, html) => {
  let receiver = to;

  if (typeof receiver === 'string') {
    const users = await getCollection('users');
    receiver = users.find((user) => user.id === receiver);
  }

  sgMail.send({
    from: {
      email: 'info@sparkscheduler.com',
      name: 'Spark',
    },
    to: receiver.email,
    subject,
    html: general({
      firstName: receiver.firstName,
      body: html,
    }),
  });
};

module.exports = sendMail;
