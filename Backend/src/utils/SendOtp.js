import sendEmail from "./mailer.js";

export const sendOtpEmail = async (email, otp) => {
  const html = `
    <h2>Your OTP Code</h2>
    <p>Use this OTP to verify your account:</p>
    <h3>${otp}</h3>
    <p>This code will expire in 10 minutes.</p>
  `;

  await sendEmail(email, "Your OTP Code", html);
};
