// const express = require("express");
// const router = express.Router();
// const Supplier = require("../models/supplier.model");

// // Get all suppliers
// router.get("/", async (req, res) => {
//   try {
//     const suppliers = await Supplier.find();
//     res.json(suppliers);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Add a new supplier
// router.post("/", async (req, res) => {
//   try {
//     const newSupplier = new Supplier(req.body);
//     const savedSupplier = await newSupplier.save();
//     res.status(201).json(savedSupplier);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// // Edit supplier
// router.put("/:id", async (req, res) => {
//   try {
//     const updatedSupplier = await Supplier.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     res.json(updatedSupplier);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Delete supplier
// router.delete("/:id", async (req, res) => {
//   try {
//     await Supplier.findByIdAndDelete(req.params.id);
//     res.json({ message: "Supplier deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const Supplier = require("../models/supplier.model");

// Get all suppliers, or filter by franchiseId if provided
router.get("/", async (req, res) => {
  try {
    const { franchiseId } = req.query;
    let suppliers;
    if (franchiseId) {
      // Filter by franchiseId if present
      suppliers = await Supplier.find({ franchiseId });
    } else {
      // Return all suppliers if no franchiseId
      suppliers = await Supplier.find();
    }
    res.status(200).json({ success: true, count: suppliers.length, data: suppliers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all suppliers for a specific franchise (recommended)
router.get("/franchise/:franchiseId", async (req, res) => {
  try {
    const { franchiseId } = req.params;
    const suppliers = await Supplier.find({ franchiseId });
    res.status(200).json({ success: true, count: suppliers.length, data: suppliers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get supplier by ID
router.get("/:id", async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    res.status(200).json(supplier);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new supplier
router.post("/", async (req, res) => {
  try {
    const { franchiseId } = req.body;
    if (!franchiseId) {
      return res.status(400).json({ error: 'franchiseId is required' });
    }
    const newSupplier = new Supplier(req.body);
    const savedSupplier = await newSupplier.save();
    res.status(201).json({ success: true, data: savedSupplier });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Edit supplier
router.put("/:id", async (req, res) => {
  try {
    // Optionally: only allow update if franchiseId matches
    const updatedSupplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ success: true, data: updatedSupplier });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete supplier
router.delete("/:id", async (req, res) => {
  try {
    await Supplier.findByIdAndDelete(req.params.id);
    res.json({ message: "Supplier deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
