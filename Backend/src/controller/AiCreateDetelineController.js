import AiLimit from '../model/AiCreateModel.js'

export const SetAiLimit=async(req,res)=>{
    try {
    const { limitType, limitCount } = req.body;

    // Optional: only one setting record at a time
    let setting = await AiLimit.findOne();
    if (!setting) {
      setting = await AiLimit.create({ limitType, limitCount });
    } else {
      setting.limitType = limitType;
      setting.limitCount = limitCount;
      await setting.save();
    }
    res.status(200).json({
      success: true,
      message: "AI limit setting updated successfully!",
      setting,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export const GetAiLimit = async (req, res) => {
  try {
    const setting = await AiLimit.findOne();
    if (!setting) {
      return res.status(404).json({ success: false, message: "No setting found" });
    }
    res.status(200).json({ success: true, setting });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};