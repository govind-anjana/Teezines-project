import AiModel from "../model/AiUserUseModel.js";
import AiLimit from "../model/AiCreateModel.js";

//  Middleware se token decode hoke req.user.username aayega
export const UseAI = async (req, res) => {
  try {
    const username = req.user.username; // token se aaya
    if (!username) {
      return res.status(401).json({ success: false, message: "Unauthorized user" });
    }

    //  Limit setting fetch (default agar admin ne set nahi ki)
    const limitSetting = await AiLimit.findOne() || { limitType: "perday", limitCount: 3 };

    //  User usage record find ya create
    let userUsage = await AiModel.findOne({ username });

    const today = new Date().toDateString(); // compare for perday reset

    if (!userUsage) {
      userUsage = new AiModel({ username, usedCount: 0 });
    }

    //  Agar perday limit hai aur last use different date ka tha to reset
    if (limitSetting.limitType === "perday" && userUsage.lastUsedDate && userUsage.lastUsedDate.toDateString() !== today) {
      userUsage.usedCount = 0;
    }

    //  Limit check
    if (userUsage.usedCount >= limitSetting.limitCount) {
      const message =
        limitSetting.limitType === "perday"
          ? "Daily AI usage limit reached. Try again tomorrow."
          : "Overall AI usage limit reached.";
      return res.status(403).json({ success: false, message });
    }

    //  Increment usage
    userUsage.usedCount += 1;
    userUsage.lastUsedDate = new Date();
    await userUsage.save();

    // Dummy AI Response (because prompt nahi diya)
    const aiResponse = ` Hello ${username}, this is your AI usage #${userUsage.usedCount}`;

    return res.status(200).json({
      success: true,
      message: "AI used successfully",
      usage: {
        username,
        usedCount: userUsage.usedCount,
        totalLimit: limitSetting.limitCount,
        type: limitSetting.limitType,
      },
      aiResponse,
    });
  } catch (error) {
    console.error("AI Use Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
export const getAllAiUsage = async (req, res) => {
  try {
    const allUsage = await AiModel.find().sort({ updatedAt: -1 });

    if (!allUsage.length) {
      return res.status(404).json({
        success: false,
        message: "No user AI usage records found",
      });
    }

    res.json({
      success: true,
      count: allUsage.length,
      usageData: allUsage.map((user) => ({
        username: user.username,
        usedCount: user.usedCount,
        lastUsedDate: user.lastUsedDate,
      })),
    });
  } catch (error) {
    console.error("Get usage error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};