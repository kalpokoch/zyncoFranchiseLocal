const express = require("express");
const router = express.Router();
const controller = require("../controllers/paymentIn.controller");

router.post("/", controller.createPaymentIn);
router.get("/", controller.getAllPaymentsIn);
router.get("/:id", controller.getPaymentInById);
router.put("/:id", controller.updatePaymentIn);
router.delete("/:id", controller.deletePaymentIn);

module.exports = router;
