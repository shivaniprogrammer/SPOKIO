require('dotenv').config();
const nodemailer = require('nodemailer');

const t = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

t.sendMail({
  from: process.env.EMAIL_USER,
  to: process.env.EMAIL_USER,
  subject: 'SPOKIO TEST',
  text: 'Test email working!'
}).then(() => {
  console.log('SUCCESS - Email sent!');
}).catch(e => {
  console.log('ERROR:', e.message);
});