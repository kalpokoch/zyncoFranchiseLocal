const express = require("express");
const controller = require("../controllers/paymentOut.controller");

const router = express.Router();

/**
 * CREATE - Add a new payment
 */
router.post("/", controller.createPaymentOut);

/**
 * READ - Get all payments
 */
router.get("/", controller.getAllPaymentsOut);

/**
 * READ - Get a single payment by ID
 */
router.get("/:id", controller.getPaymentOutById);

/**
 * UPDATE - Update a payment by ID
 */
router.put("/:id", controller.updatePaymentOut);

/**
 * DELETE - Delete a payment by ID
 */
router.delete("/:id", controller.deletePaymentOut);

module.exports = router;
