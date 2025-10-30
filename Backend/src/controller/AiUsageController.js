import AiUsage from "../model/AiUsageModel.js";

export const AiUsageHandler = async (req, res) => {
  try {
    // user ko token se lo (abhi demo ke liye hardcoded)
    const username = req.user?.username || "demoUser";

    const { type, prompt } = req.body;

    if (!type) {
      return res.status(400).json({ success: false, message: "Type is required" });
    }

    // user record find ya create
    let usage = await AiUsage.findOne({ user: username });
    if (!usage) {
      usage = await AiUsage.create({ user: username });
    }

    // type ke hisab se count badhao
    if (type === "generate") {
      usage.generateUsed += 1;
    } else if (type === "response") {
      usage.responseUsed += 1;
    } else if (type === "accepted") {
      usage.acceptedUsed += 1;
    } else {
      return res.status(400).json({ success: false, message: "Invalid type" });
    }

    usage.lastUsed = new Date();
    await usage.save();

    return res.status(200).json({
      success: true,
      message:
        type === "generate"
          ? `Generated result for: "${prompt || "no prompt"}"`
          : `${type} recorded successfully`,
      usage
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};


//All All Ai Users
export const GetAllAiUsage = async (req, res) => {
  try {
    const allUsage = await AiUsage.find();

    res.status(200).json({
      success: true,
      totalUsers: allUsage.length,
      data: allUsage
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};