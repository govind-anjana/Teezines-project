import nodemailer from "nodemailer";
import axios from "axios";

const sendEmail = async (to, subject, html) => {
  try {
    // Localhost -> Gmail SMTP
    if (process.env.NODE_ENV === "development") {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html,
      });

      console.log("📨 Email sent via Gmail SMTP");
    } 
    // Render -> Resend
    else {
      const response = await axios.post(
        "https://api.resend.com/emails",
        {
          from: process.env.RESEND_FROM,
          to,
          subject,
          html,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(" Email sent via Resend:", response.data);
    }
  } catch (err) {
    console.error("Mailer error:", err.message);
    throw new Error("Failed to send email");
  }
};

export default sendEmail;
