const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/**
 * Fields based on your "Add New Partner" form:
 *  - franchiseId (auto-generated, e.g., F0001)
 *  - franchiseName
 *  - managerName (owner/manager)
 *  - email
 *  - phoneNumber
 *  - totalInvestmentAmount
 *  - location
 *  - investmentDate
 *  - password (if they need login)
 */

const franchiseSchema = new mongoose.Schema({
  franchiseId: {
    type: String,
    unique: true
    // We'll auto-generate this in the 'pre' save hook
  },
  franchiseName: {
    type: String,
    required: true
  },
  managerName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  totalInvestmentAmount: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  investmentDate: {
    type: Date,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: true });

// 1) Auto-generate a "F0001" style ID (naive approach):
franchiseSchema.pre("save", async function(next) {
  if (this.isNew) {
    // Get the last document to find its ID number
    const lastDoc = await mongoose.model("Franchise").findOne({}, {}, { sort: { createdAt: -1 } });

    let lastNumber = 0;
    if (lastDoc && lastDoc.franchiseId) {
      // Remove 'F' and parse the integer
      lastNumber = parseInt(lastDoc.franchiseId.slice(1)) || 0;
    }

    const newNumber = lastNumber + 1;
    // e.g., "F0001"
    this.franchiseId = "F" + String(newNumber).padStart(4, "0");
  }
  next();
});

// 2) Hash password if changed or new
franchiseSchema.pre("save", async function(next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

module.exports = mongoose.model("Franchise", franchiseSchema);