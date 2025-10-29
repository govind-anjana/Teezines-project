// import sgMail from "@sendgrid/mail";
// import dotenv from "dotenv";
// dotenv.config();

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// export const sendOTPEmail = async (to, otp) => {
//   const msg = {
//     to,
//     from: process.env.FROM_EMAIL, //  verified sender email
//     subject: "Your OTP Code",
//     text: `Your OTP code is ${otp}`,
//     html: `<p>Your OTP code is <b>${otp}</b></p>`,
//   };

//   try {
//     await sgMail.send(msg);
//     console.log(" OTP email sent successfully!");
//     return true;
//   } catch (error) {
//     console.error(" SendGrid error:", error.response?.body || error);
//     return false;
//   }
// };
