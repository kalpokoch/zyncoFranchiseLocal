const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true,
        unique: true
    },
    businessName: String,
    contactPerson: String,
    phone: String,
    email: String,
    gst : String,
    address: String,

    preferences:{
        language: String,
        emailNotifications: Boolean,
        smsNotifications: Boolean,
        pushNotifications: Boolean
    }
});

module.exports = mongoose.model("Settings", settingsSchema);