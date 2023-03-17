const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SERVICE_EMAIL, 
    pass: process.env.SERVICE_PASSWORD
  }
});

module.exports = transporter;
