const PaymentOut = require('../models/paymentOut.model');
const Supplier = require('../models/supplier.model');

// CREATE Payment Out
exports.createPaymentOut = async (req, res) => {
  try {
    const { franchiseId, invoiceNumber, supplier, supplierName, billingAddress, paymentDate, amountPaid } = req.body;

    if (!franchiseId) {
      return res.status(400).json({ success: false, message: 'franchiseId is required' });
    }
    if (!supplier) {
      return res.status(400).json({ success: false, message: 'supplier is required' });
    }

    const payment = new PaymentOut({
      franchiseId,
      invoiceNumber,
      supplier,
      supplierName,
      billingAddress,
      paymentDate,
      amountPaid
    });

    await payment.save();

    // Update supplier's amountPayable (subtract amountPaid)
    try {
      await Supplier.findByIdAndUpdate(
        supplier,
        { $inc: { amountPayable: -Math.abs(amountPaid) } }
      );
    } catch (err) {
      console.error('[PAYMENT OUT DEBUG] Error updating supplier after payment out:', err);
    }
    res.status(201).json({ success: true, message: "Payment Out saved", data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE Payment Out by ID
exports.updatePaymentOut = async (req, res) => {
  try {
    const { invoiceNumber, supplier, supplierName, billingAddress, paymentDate, amountPaid } = req.body;
    // Get previous payment to adjust payable
    const prevPayment = await PaymentOut.findById(req.params.id);
    const updatedPayment = await PaymentOut.findByIdAndUpdate(
      req.params.id,
      {
        invoiceNumber,
        supplier,
        supplierName,
        billingAddress,
        paymentDate,
        amountPaid
      },
      { new: true, runValidators: true }
    );
    if (!updatedPayment) {
      return res.status(404).json({ success: false, message: "Payment Out not found" });
    }
    // Update supplier's amountPayable
    try {
      const diff = Math.abs(amountPaid) - (prevPayment ? Math.abs(prevPayment.amountPaid) : 0);
      await Supplier.findByIdAndUpdate(
        supplier,
        { $inc: { amountPayable: diff } }
      );
    } catch (err) {
      console.error('[PAYMENT OUT DEBUG] Error updating supplier after payment out update:', err);
    }
    res.status(200).json({ success: true, message: "Payment Out updated", data: updatedPayment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE Payment Out by ID
exports.deletePaymentOut = async (req, res) => {
  try {
    const payment = await PaymentOut.findByIdAndDelete(req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment Out not found" });
    }
    // Decrement supplier's amountPayable
    try {
      await Supplier.findByIdAndUpdate(
        payment.supplier,
        { $inc: { amountPayable: -Math.abs(payment.amountPaid) } }
      );
    } catch (err) {
      console.error('[PAYMENT OUT DEBUG] Error updating supplier after payment out delete:', err);
    }
    res.status(200).json({ success: true, message: "Payment Out deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET all Payments Out
exports.getAllPaymentsOut = async (req, res) => {
  try {
    const payments = await PaymentOut.find().populate('supplier');
    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET Payment Out by ID
exports.getPaymentOutById = async (req, res) => {
  try {
    const payment = await PaymentOut.findById(req.params.id).populate('supplier');
    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment Out not found" });
    }
    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
