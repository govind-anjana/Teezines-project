// utils/mailer.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS 
  }
});
transporter.verify().then(() => {
  console.log("Mailer ready");
}).catch(err => {
  console.error("Mailer error:", err);
});

export default transporter;
