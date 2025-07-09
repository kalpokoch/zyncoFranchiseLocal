const express = require("express");
const router = express.Router();
const FranchiseController = require("../controllers/franchise.controller");

// Always define specific routes before parameterized ones
router.get("/", FranchiseController.getAllFranchises);
router.post("/", FranchiseController.createFranchise);
router.get("/:id", FranchiseController.getFranchiseById);
router.put("/:id", FranchiseController.updateFranchise);
router.delete("/:id", FranchiseController.deleteFranchise);

module.exports = router;
