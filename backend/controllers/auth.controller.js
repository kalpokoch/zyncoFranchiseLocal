const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const user_model = require("../models/user.model");
const jwt = require("jsonwebtoken");
const secret = require("../configs/auth.config");
const { sendResetEmail } = require("../emailService");

// **Signup Controller**
const signup = async (req, res) => {
    try {
        const { name, employeeId, email, password, userType, franchiseName, franchiseId } = req.body;

        if (userType === "ADMIN") {
            return res.status(400).json({ message: "Admin account cannot be created via signup" });
        }

        // Check for duplicate employeeId or email
        const existingUser = await user_model.findOne({
            $or: [{ employeeId }, { email }]
        });

        if (existingUser) {
            return res.status(400).json({ message: "Employee ID or Email already exists" });
        }

        const hashedPassword = bcrypt.hashSync(password, 8);
        const userObj = new user_model({
            name,
            employeeId,
            email,
            userType,
            franchiseName,
            franchiseId,
            password: hashedPassword,
        });

        const user_created = await userObj.save();

        console.log("User created:", user_created.employeeId);

        res.status(201).json({
            name: user_created.name,
            userId: user_created._id,
            email: user_created.email,
            userType: user_created.userType,
            franchiseName: user_created.franchiseName,
            franchiseId: user_created.franchiseId,
            createdAt: user_created.createdAt,
            updatedAt: user_created.updatedAt,
        });
    } catch (err) {
        console.error("Error while registering user", err);
        res.status(500).json({ message: "Error occurred while registering user" });
    }
};

// **Signin Controller**
const signin = async (req, res) => {
    try {
        const { employeeId, password } = req.body;

        console.log("🔐 Signin attempt for:", employeeId);

        const employee = await user_model.findOne({ employeeId });

        if (!employee) {
            console.warn("⚠️ Invalid Employee ID:", employeeId);
            return res.status(400).json({ message: "Invalid Employee ID" });
        }

        const isPasswordValid = bcrypt.compareSync(password, employee.password);
        if (!isPasswordValid) {
            console.warn("⚠️ Incorrect password for:", employeeId);
            return res.status(401).json({ message: "Incorrect password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: employee._id, userType: employee.userType, franchiseId: employee.franchiseId },
            secret.secret,
            { expiresIn: "2h" }
        );

        res.status(200).json({
            name: employee.name,
            employeeId: employee.employeeId,
            email: employee.email,
            userType: employee.userType,
            franchiseName: employee.franchiseName,
            franchiseId: employee.franchiseId,
            accessToken: token,
        });
    } catch (error) {
        console.error("Signin error:", error);
        res.status(500).json({ message: "Server error during signin" });
    }
};

// **Forgot Password - Generate Token & Send Email**
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await user_model.findOne({ email });

        if (!user) return res.status(404).json({ message: "User not found" });

        const token = crypto.randomBytes(20).toString("hex");
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        await sendResetEmail(email, token);

        res.json({ message: "Password reset link sent to email" });
    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

// **Reset Password - Verify Token & Update Password**
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await user_model.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) return res.status(400).json({ message: "Invalid or expired token" });

        user.password = bcrypt.hashSync(password, 8);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        res.json({ message: "Password reset successful" });
    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports = {
    signup,
    signin,
    forgotPassword,
    resetPassword
};
