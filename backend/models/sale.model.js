const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
  franchiseId: { type: String, required: true },
  invoiceNumber: { type: String, required: true, unique: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  billingAddress: { type: String },
  billingDate: { type: Date, required: true },
  salesItems: [
    {
      productName: { type: String, required: true },
      quantity: { type: Number, required: true },
      unit: { type: String, required: true },
      pricePerUnit: { type: Number, required: true },
      gst: { type: Number, required: true },
      priceWithTax: { type: Number, required: true },
      amount: { type: Number, required: true }
    }
  ],
  totalQuantity: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ["Paid", "Pending"], default: "Pending" },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Sale", saleSchema);
