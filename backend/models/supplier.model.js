const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
    franchiseId: { type: String, required: true },
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        match: /^\d{10}$/, // Ensure it's a 10-digit number
    },
    email: {
        type: String,
        required: false,

    },
    address: {
        type: String,
        required: false,
    },
    gstin: {
        type: String,
        required: false,
    },
    amountPayable: {
        type: Number,
        default: 0,
    },


},{
    timestamps: true
});

module.exports = mongoose.model("Supplier", supplierSchema);