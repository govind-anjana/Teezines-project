import PromoCodeModel from "../model/PromoModel.js";

export const CreatePromo = async (req, res) => {
  try {
    const promo = new PromoCodeModel(req.body);
    const PromoCode = await promo.save();
    res.status(201).json({ message: "Promo created successfully", PromoCode });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const Applypromo = async (req, res) => {
  try {
    const { promoCode, totalAmount } = req.body;
    const userEmail = req.user.email;

    const promo = await PromoCodeModel.findOne({ code: promoCode });
    if (!promo || !promo.isActive)
      return res.status(400).json({ success: false, message: "Invalid promo code" });

    if (promo.expiryDate < new Date())
      return res.status(400).json({ success: false, message: "Promo expired by date" });

    if (promo.usedBy.includes(userEmail))
      return res.status(400).json({ success: false, message: "You already used this Promo Code" });

    if (promo.usageLimit && promo.usedCount >= promo.usageLimit)
      return res.status(400).json({ success: false, message: "Promo usage limit reached" });

    if (totalAmount < promo.minAmount)
      return res.status(400).json({
        success: false,
        message: `Minimum order ₹${promo.minAmount} required`,
      });

    const discount =
      promo.discountType === "percentage"
        ? (totalAmount * promo.discountValue) / 100
        : promo.discountValue;

    promo.usedCount += 1;
    promo.usedBy.push(userEmail);
    await promo.save();

    res.status(200).json({
      success: true,
      message: "Promo applied successfully",
      discount,
      finalAmount: totalAmount - discount,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
