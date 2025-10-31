import AiToggleModel from "../model/AiToggleModel.js";

export const CurrentStatus = async(req,res) => {
  try {
    let setting = await AiToggleModel.findOne();
    if (!setting) setting = await AiToggleModel.create({});
    res.json({ logoutVisible: setting.logoutVisible });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const Toggle = async (req, res) => {
  try {
    const { value } = req.body; // true or false from admin

    let setting = await AiToggleModel.findOne();
    if (!setting) setting = await AiToggleModel.create({});

    if (typeof value === "boolean") {
      setting.logoutVisible = value;
    } else {
      // if not provided, flip the current value
      setting.logoutVisible = !setting.logoutVisible;
    }

    await setting.save();
    res.status(200).json({
      success: true,
      logoutVisible: setting.logoutVisible,
      message: `visibility set to ${setting.logoutVisible}`,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
