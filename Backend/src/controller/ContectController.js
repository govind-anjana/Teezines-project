import Contact from "../model/ContectModel.js";

//  Create new contact (POST)
export const createContact = async (req, res) => {
  try {
    const { username, email, phone, message } = req.body;
    
     //  Check if email already exists
    const existing = await Contact.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "This email is already registered.",
      });
    }
    const contact = new Contact({ username, email, phone, message });
    await contact.save();

    res.status(201).json({
      success: true,
      message: "Contact saved successfully!",
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error saving contact",
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
