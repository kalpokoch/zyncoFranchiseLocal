const express = require("express");
const router = express.Router();
const Settings = require("../models/settings.model");
const { verifyToken, isFranchisePartner } = require("../middlewares/auth.mw");

// GET settings (only for Franchise Partner)
router.get("/", verifyToken, isFranchisePartner, async (req, res) => {
  try {
    const settings = await Settings.findOne({ userId: req.userId });
    if (!settings) return res.status(404).json({ message: "No settings found" });

    res.status(200).json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST or UPDATE settings (only for Franchise Partner)
router.post("/", verifyToken, isFranchisePartner, async (req, res) => {
  const {
    businessName,
    contactPerson,
    phone,
    email,
    gst,
    address,
    preferences
  } = req.body;

  try {
    const updatedSettings = await Settings.findOneAndUpdate(
      { userId: req.userId },
      {
        userId: req.userId,
        franchiseId: req.franchiseId,
        businessName,
        contactPerson,
        phone,
        email,
        gst,
        address,
        preferences
      },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: "Settings saved successfully", settings: updatedSettings });
  } catch (error) {
    console.error("Error saving settings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
