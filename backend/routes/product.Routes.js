const express = require("express");
const Product = require("../models/product.model");
const router = express.Router();

// CREATE a new product for a franchise
router.post("/", async (req, res) => {
    try {
        const {
            franchiseId,
            productName,
            category,
            purchasePrice,
            sellingPrice,
            gst,
            base_unit,
            conversion_factor,
            stock_quantity
        } = req.body;

        if (!franchiseId) {
            return res.status(400).json({ message: "Franchise ID is required." });
        }

        const conversionMap = new Map(Object.entries(conversion_factor));

        // Calculate total_stock as a map: total_stock[unit] = stock_quantity * factor
        let total_stock = {};
        for (const [unit, factor] of conversionMap.entries()) {
            total_stock[unit] = Number(stock_quantity) * Number(factor);
        }

        const newProduct = new Product({
            franchise: franchiseId,
            productName,
            category,
            purchasePrice,
            sellingPrice,
            gst,
            base_unit,
            conversion_factor: conversionMap,
            stock_quantity,
            total_stock
        });

        await newProduct.save();

        res.status(201).json({
            message: "Product created successfully for franchise!",
            product: newProduct
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// READ - Get all products (with franchise details)
router.get("/", async (req, res) => {
    try {
        const products = await Product.find().populate("franchise");
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// READ - Get all products of a specific franchise
router.get("/franchise/:franchiseId", async (req, res) => {
    try {
        const products = await Product.find({ franchise: req.params.franchiseId });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// READ - Get a single product by ID
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("franchise");
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// UPDATE a product by ID
router.put("/:id", async (req, res) => {
    try {
        const {
            productName,
            category,
            purchasePrice,
            sellingPrice,
            gst,
            base_unit,
            conversion_factor,
            stock_quantity
        } = req.body;

        const conversionMap = new Map(Object.entries(conversion_factor));

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                productName,
                category,
                purchasePrice,
                sellingPrice,
                gst,
                base_unit,
                conversion_factor: conversionMap,
                stock_quantity
            },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) return res.status(404).json({ message: "Product not found" });

        res.status(200).json({
            message: "Product updated successfully!",
            product: updatedProduct
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE a product by ID
router.delete("/:id", async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ message: "Product not found" });

        res.status(200).json({ message: "Product deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
