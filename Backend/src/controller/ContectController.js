import Contact from "../model/ContectModel.js";
import dotenv from 'dotenv';

dotenv.config();
//  Create new contact (POST)
export const createContact = async (req, res) => {
  try {
    const { username, email, phone, message } = req.body;

      const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: "Email already registered" });
        }
    const newContact = new Contact({ username, email, phone, message });
    await newContact.save();

    res.status(200).json({
      success: true,
      message: "Contact saved successfully!",
      data: newContact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send email",
      error: error.message,
    });
  }
};

//  Get all contacts (GET)
export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching contacts",
      error: error.message,
    });
  }
};
