const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  franchiseId: { type: String, required: true },
  customerName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String },
  address: { type: String },
  lastPurchase: { type: Date },
  amountReceivable: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true
});

module.exports = mongoose.model('Customer', CustomerSchema);
