const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const User = require("../models/user.model");

// AUTH ROUTES (use POST method in Postman)
router.post("/signup", authController.signup);              // POST /signup
router.post("/signin", authController.signin);              // POST /signin
router.post("/forgot-password", authController.forgotPassword);  // POST /forgot-password
router.post("/reset-password/:token", authController.resetPassword);  // POST /reset-password/:token

// TEMPORARY TEST ROUTES (no middleware for now)
router.post("/billing", (req, res) => {
    res.send({ message: "Billing functionality for franchise BDE" });
});

router.get("/dashboard", (req, res) => {
    res.send({ message: "Dashboard functionality for franchise partner" });
});

router.get("/admin-panel", (req, res) => {
    res.send({ message: "Admin panel functionality" });
});

// USER CRUD ROUTES
// GET all users
router.get("/", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET single user by ID (only if it's a valid Mongo ObjectId)
router.get("/:id", async (req, res) => {
    const id = req.params.id;

    // Check for valid ObjectId before querying
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: "Invalid user ID format" });
    }

    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT (Update) user by ID
router.put("/:id", async (req, res) => {
    const id = req.params.id;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: "Invalid user ID format" });
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedUser) return res.status(404).json({ message: "User not found" });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE user by ID
router.delete("/:id", async (req, res) => {
    const id = req.params.id;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: "Invalid user ID format" });
    }

    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
