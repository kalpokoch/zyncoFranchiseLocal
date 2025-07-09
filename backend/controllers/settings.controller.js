const Settings = require("../models/settings.model");

// GET all settings
exports.getSettings = async (req, res) => {
  try {
    const settings = await Settings.find();
    res.status(200).json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST new setting
exports.createSettings = async (req, res) => {
  try {
    const newSetting = new Settings(req.body);
    await newSetting.save();
    res.status(201).json({ message: "Settings created successfully", data: newSetting });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// OPTIONAL: PUT to update setting by ID
exports.updateSettings = async (req, res) => {
  try {
    const updatedSetting = await Settings.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedSetting);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// OPTIONAL: DELETE setting by ID
exports.deleteSettings = async (req, res) => {
  try {
    await Settings.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Setting deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
