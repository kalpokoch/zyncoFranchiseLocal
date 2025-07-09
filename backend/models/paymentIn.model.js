const mongoose = require("mongoose");

const paymentInSchema = new mongoose.Schema({
    franchiseId: {
        type: String,
        required: true
    },
    invoiceNumber: {
        type: String,
        required: true,
        unique: true
    },
    customerName: {
        type: String,
        required: true
    },
    billingAddress: String,
    billingDate:{
        type: Date,
        required: true
    },
    amountReceived: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("PaymentIn", paymentInSchema);