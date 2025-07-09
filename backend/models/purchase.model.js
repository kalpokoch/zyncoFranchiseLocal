const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
    invoiceNumber: { type: String, required: true, unique: true},
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true }, 
    franchiseId: { type: String, required: true }, // Added for franchise filtering
    // supplierName: { type: String, required: true },
    billingAddress: {type: String, required: true},
    billingDate: {type: Date, required: true},
    product:[
        {
            productName: {type: String, required:true},
            quantity: {type: Number, required: true},
            unit: {type: String, required: true},
            pricePerUnit : {type: Number, required: true},
            gst: {type: Number, required: true},
            priceWithTax: {type: Number, required: true},
            amount: {type: Number, required: true}

        }
    ],
    totalAmount: {type: Number, required: true},
    balance: {type: Number, required: true},
    paymentStatus: {type: String, enum: ["Paid", "Pending", "Not Paid"], default:"Pending"}

});
module.exports = mongoose.model("Purchase", purchaseSchema);