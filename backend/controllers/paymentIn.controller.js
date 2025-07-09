const PaymentIn = require("../models/paymentIn.model");

// CREATE Payment In
exports.createPaymentIn = async (req, res) => {
  try {
    const { franchiseId, invoiceNumber, customerName, billingAddress, billingDate, amountReceived } = req.body;

    if (!franchiseId) {
      return res.status(400).json({ success: false, message: 'franchiseId is required' });
    }

    const payment = new PaymentIn({
      franchiseId,
      invoiceNumber,
      customerName,
      billingAddress,
      billingDate,
      amountReceived
    });

    await payment.save();
// Update customer's amountReceivable (subtract amountReceived)
try {
  const Customer = require("../models/customer.model");
  // Try to find by customerName and franchiseId (since PaymentIn doesn't store customer ObjectId)
  await Customer.findOneAndUpdate(
    { customerName, franchiseId },
    { $inc: { amountReceivable: -Math.abs(amountReceived) } }
  );
} catch (err) {
  console.error('[PAYMENT IN DEBUG] Error updating customer after payment in:', err);
}
res.status(201).json({ success: true, message: "Payment In saved", data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// READ - Get All Payments In
exports.getAllPaymentsIn = async (req, res) => {
  try {
    const payments = await PaymentIn.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// READ - Get Payment In by ID
exports.getPaymentInById = async (req, res) => {
  try {
    const payment = await PaymentIn.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }
    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE - Payment In by ID
exports.updatePaymentIn = async (req, res) => {
  try {
    const { invoiceNumber, customerName, billingAddress, billingDate, amountReceived } = req.body;

    // Get previous payment to adjust receivable
const prevPayment = await PaymentIn.findById(req.params.id);
const updatedPayment = await PaymentIn.findByIdAndUpdate(
  req.params.id,
  {
    invoiceNumber,
    customerName,
    billingAddress,
    billingDate,
    amountReceived
  },
  { new: true, runValidators: true }
);
if (!updatedPayment) {
  return res.status(404).json({ success: false, message: "Payment not found" });
}
// Adjust customer's amountReceivable
try {
  const Customer = require("../models/customer.model");
  // Use customerName and franchiseId (since PaymentIn doesn't store customer ObjectId)
  const diff = -Math.abs(amountReceived) + (prevPayment ? Math.abs(prevPayment.amountReceived) : 0);
  await Customer.findOneAndUpdate(
    { customerName, franchiseId: updatedPayment.franchiseId },
    { $inc: { amountReceivable: diff } }
  );
} catch (err) {
  console.error('[PAYMENT IN DEBUG] Error updating customer after payment in update:', err);
}
res.status(200).json({ success: true, message: "Payment In updated", data: updatedPayment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE - Payment In by ID
exports.deletePaymentIn = async (req, res) => {
  try {
    const deletedPayment = await PaymentIn.findByIdAndDelete(req.params.id);
    if (!deletedPayment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }
    res.status(200).json({ success: true, message: "Payment In deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
