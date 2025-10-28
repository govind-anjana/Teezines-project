import { sendOtpEmail } from "../utils/SendOtp.js";

export const registerUser = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await sendOtpEmail(email, otp);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully!",
      otp, // testing purpose only
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ success: false, message: "OTP sending failed", error: error.message });
  }
};
