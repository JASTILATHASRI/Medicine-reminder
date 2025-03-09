require('dotenv').config();  // For environment variables
const nodemailer = require("nodemailer");

// Create a transporter for the email service
const transporter = nodemailer.createTransport({
  service: 'gmail',  // Can be changed to another email service if needed
  auth: {
    user: process.env.EMAIL_USER,  // Your email from .env
    pass: process.env.EMAIL_PASS   // Your app password from .env
  }
});

// Function to send an email
const sendEmail = (to, subject, message) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: subject,
    text: message,
    html: `<strong>${message}</strong>`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

module.exports = { sendEmail };
