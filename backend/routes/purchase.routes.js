const express = require("express");
const Purchase = require("../models/purchase.model");
const Supplier = require("../models/supplier.model");

const router = express.Router();

// Add a new purchase
router.post("/", async (req, res) => {
    try {
        const purchase = new Purchase(req.body);
        await purchase.save();
        // Increment supplier's amountPayable
        try {
            await Supplier.findByIdAndUpdate(
                purchase.supplier,
                { $inc: { amountPayable: Math.abs(purchase.totalAmount) } }
            );
        } catch (err) {
            console.error('[PURCHASE DEBUG] Error updating supplier after purchase:', err);
        }
        res.status(201).json({ message: "Purchase added successfully", purchase });
    } catch (error) {
        res.status(400).json({ message: "Error adding purchase", error: error.message });
    }
});

// Get all purchases
router.get("/", async (req, res) => {
    try {
        const { franchiseId } = req.query;
        const filter = franchiseId ? { franchiseId } : {};
        const purchases = await Purchase.find(filter).populate('supplier');
        res.status(200).json(purchases);
    } catch (error) {
        res.status(500).json({ message: "Error fetching purchases", error: error.message });
    }
});

// Get a single purchase by ID
router.get("/:id", async (req, res) => {
    try {
        const purchase = await Purchase.findById(req.params.id).populate('supplier');
        if (!purchase) {
            return res.status(404).json({ message: "Purchase not found" });
        }
        res.status(200).json(purchase);
    } catch (error) {
        res.status(500).json({ message: "Error fetching purchase", error: error.message });
    }
});

// Update a purchase by ID
router.put("/:id", async (req, res) => {
    try {
        // 1. Get old purchase
        const oldPurchase = await Purchase.findById(req.params.id);
        if (!oldPurchase) {
            return res.status(404).json({ message: "Purchase not found" });
        }
        const oldTotal = oldPurchase.totalAmount;
        const oldSupplierId = oldPurchase.supplier.toString();

        // 2. Update purchase
        const updatedPurchase = await Purchase.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPurchase) {
            return res.status(404).json({ message: "Purchase not found after update" });
        }
        const newTotal = updatedPurchase.totalAmount;
        const newSupplierId = updatedPurchase.supplier.toString();

        // 3. Update supplier(s)
        if (oldSupplierId === newSupplierId) {
            // Same supplier, adjust by delta
            await Supplier.findByIdAndUpdate(
                oldSupplierId,
                { $inc: { amountPayable: newTotal - oldTotal } }
            );
        } else {
            // Supplier changed: subtract from old, add to new
            await Supplier.findByIdAndUpdate(
                oldSupplierId,
                { $inc: { amountPayable: -oldTotal } }
            );
            await Supplier.findByIdAndUpdate(
                newSupplierId,
                { $inc: { amountPayable: newTotal } }
            );
        }

        res.status(200).json({ message: "Purchase updated successfully", updatedPurchase });
    } catch (error) {
        res.status(500).json({ message: "Error updating purchase", error: error.message });
    }
});

// Delete a purchase by ID
router.delete("/:id", async (req, res) => {
    try {
        const deletedPurchase = await Purchase.findByIdAndDelete(req.params.id);
        if (!deletedPurchase) {
            return res.status(404).json({ message: "Purchase not found" });
        }
        res.status(200).json({ message: "Purchase deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting purchase", error: error.message });
    }
});

module.exports = router;
