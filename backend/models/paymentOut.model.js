const mongoose = require("mongoose");

const paymentOutSchema = new mongoose.Schema({
    franchiseId: {
        type: String,
        required: true
    },
    invoiceNumber: {
        type: String,
        required: true,
        unique: true
    },
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Supplier",
        required: true
    },
    supplierName: {
        type: String,
        required: true
    },
    billingAddress: String,
    paymentDate: {
        type: Date,
        required: true
    },
    amountPaid: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("PaymentOut", paymentOutSchema);