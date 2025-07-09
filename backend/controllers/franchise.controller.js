const Franchise = require("../models/franchise.model");
const mongoose = require("mongoose"); 
//Create a new franchise partner
exports.createFranchise = async (req, res) => {
    try {
        const {
            franchiseName,
            managerName,
            email,
            phoneNumber,
            totalInvestmentAmount,
            location,
            investmentDate,
            password
        } = req.body;

        // Validate required fields
        if (!franchiseName || !managerName || !email || !phoneNumber ||
            !totalInvestmentAmount || !location || !investmentDate || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Create the new franchise
        const newFranchise = await Franchise.create({
            franchiseName,
            managerName,
            email,
            phoneNumber,
            totalInvestmentAmount,
            location,
            investmentDate,
            password
        });

        res.status(201).send({
            message: "Franchise created successfully",
            franchise: newFranchise
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Retrieve all franchises
exports.getAllFranchises = async (req, res) => {
    
    try {
        const franchises = await Franchise.find();
        res.status(200).send({ franchises });
    } catch (error) {
        console.error("Error in getAllFranchises: ", error);
        res.status(500).send({ message: "Failed to fetch franchises", error });
    }
};

//Retrieve a single franchise by ID (with ObjectId validation)
exports.getFranchiseById = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid franchise ID format" });
    }

    try {
        const franchise = await Franchise.findById(id);
        if (!franchise) {
            return res.status(404).send({ message: "Franchise not found" });
        }
        res.status(200).send({ franchise });
    } catch (error) {
        console.error("Error fetching franchise: ", error);
        res.status(500).send({ message: "Failed to fetch franchise", error });
    }
};

//Update a franchise by ID
exports.updateFranchise = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid franchise ID format" });
    }

    try {
        const updatedFranchise = await Franchise.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedFranchise) {
            return res.status(404).send({ message: "Franchise not found" });
        }
        res.status(200).send({ message: "Franchise updated successfully", franchise: updatedFranchise });
    } catch (error) {
        console.error("Error updating franchise: ", error);
        res.status(500).send({ message: "Failed to update franchise", error });
    }
};

//Delete a franchise by ID
exports.deleteFranchise = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid franchise ID format" });
    }

    try {
        const deletedFranchise = await Franchise.findByIdAndDelete(id);
        if (!deletedFranchise) {
            return res.status(404).send({ message: "Franchise not found" });
        }
        res.status(200).send({ message: "Franchise deleted successfully" });
    } catch (error) {
        console.error("Error deleting franchise: ", error);
        res.status(500).send({ message: "Failed to delete franchise", error });
    }
};
