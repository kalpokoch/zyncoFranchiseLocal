// routes/sale.routes.js
const express = require("express");
const router = express.Router();
const saleController = require("../controllers/sale.controller");

// CRUD Routes
router.post("/", saleController.createSale);
router.get("/", saleController.getAllSales);
router.get("/:id", saleController.getSaleById);
router.put("/:id", saleController.updateSale);
router.delete("/:id", saleController.deleteSale);

// Daily Report Route
router.get("/reports/daily", saleController.getDailyReport);

module.exports = router;
