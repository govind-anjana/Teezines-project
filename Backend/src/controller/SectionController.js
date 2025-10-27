import SectionModel from "../model/SectionModel.js";

export const GetSection = async (req, res) => {
  try {

    //find are all section
    const products = await SectionModel.find();
    res.status(200).json({ message: "All Section Detail retrieved", products });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const SectionAdd = async (req, res) => {
  try {
    const { section } = req.body;

    // Validation
    if (!section) {
      return res.status(400).json({ message: "Section is required" });
    }
    // Check if already exists
    const exists = await SectionModel.findOne({ section });
    if (exists) {
      return res.status(400).json({ message: "section already exists" });
    }

    // Create new category
    const newsection = new SectionModel({ section });
    await newsection.save();

    res.status(201).json({
      success: true,
      message: "Section added successfully!",
    });
  } catch (err) {
    
    console.error("Upload Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}
export const SectionUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { section } = req.body;

    // Validation
    if (!section) {
      return res.status(400).json({ message: "section name is required" });
    }

    // Check if section exists
    const existing = await SectionModel.findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Section not found" });
    }

    // Update section
    existing.section = section;
    const updatedSection= await existing.save();

    res.status(200).json({
      success: true,
      message: "Section updated successfully!",
      data: updatedSection,
    });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
export const SectionDelete = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if section exists
    const existing = await SectionModel.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Section not found" });
    }

    // Delete section
    await SectionModel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "section deleted successfully!",
    });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};