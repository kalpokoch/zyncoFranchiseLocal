// const express = require("express");
// const router = express.Router();
// const BDE = require("../models/bde.model");
// const { verifyAdmin } = require("../middlewares/auth"); 

// // Admin adds a BDE
// router.post("/add", verifyAdmin, async (req, res) => {
//   try {
//     const { name, email, phone, franchiseId, password } = req.body;

//     if (!name || !email || !phone || !franchiseId || !password) {
//       return res.status(400).json({ message: "All fields are required." });
//     }

//     const newBDE = new BDE({
//       name,
//       email,
//       phone,
//       franchise: franchiseId,
//       password
//     });

//     await newBDE.save();

//     res.status(201).json({ message: "BDE added successfully!", bde: newBDE });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// module.exports = router;



const express = require("express");
const bcrypt = require("bcryptjs");
const BDE = require("../models/bde.model");
const Franchise = require("../models/franchise.model");
const { verifyToken, isAdmin } = require("../middlewares/auth.mw");

const router = express.Router();

// GET all BDEs (Open for testing)
router.get("/", async (req, res) => {
  try {
    const bdes = await BDE.find().populate("franchiseId");
    res.json(bdes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE BDE (Admin only)
router.post("/", async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            franchiseId,
            password
        } = req.body;

        if (!franchiseId) {
            return res.status(400).json({ message: "Franchise ID is required." });
        }

        // Look up Franchise by franchiseId string (e.g., 'F0002')
        const franchiseDoc = await Franchise.findOne({ franchiseId: franchiseId });
        if (!franchiseDoc) {
            return res.status(404).json({ message: "Franchise not found." });
        }

        const newBDE = new BDE({
            name,
            email,
            phone,
            franchiseId: franchiseDoc._id, // Use the ObjectId
            password
        });

        await newBDE.save();

        res.status(201).json({
            message: "BDE created successfully for franchise!",
            bde: newBDE
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
