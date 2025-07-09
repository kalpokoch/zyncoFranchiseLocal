const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    employeeId: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    userType: {
        type: String,
        enum: ["ADMIN", "FRANCHISE_PARTNER", "FRANCHISE_BDE"],
        required: true
    },
    franchiseName: {
        type: String,
        enum: ["Zynco Franchise", "Franchise A", "Franchise B"],
        required: false
    },
    franchiseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Franchise",
        required: function() {
            return this.userType !=='ADMIN'; // Only required if userType is not ADMIN
        },
    },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null }
}, { timestamps: true, versionKey: false });

// Ensure correct export
const User = mongoose.model("User", userSchema);
module.exports = User;
