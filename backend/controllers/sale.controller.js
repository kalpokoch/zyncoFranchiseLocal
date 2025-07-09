const Sale = require("../models/sale.model")

// Create a new sale
exports.createSale = async (req, res) => {
    try {
        console.log('[SALE DEBUG] Incoming payload:', req.body);
        const {
            franchiseId,
            invoiceNumber,
            customer,
            billingAddress,
            billingDate,
            salesItems,
            totalQuantity,
            totalAmount,
            paymentStatus
        } = req.body;

        console.log('[SALE DEBUG] Validation fields:', {
          franchiseId, type_franchiseId: typeof franchiseId,
          invoiceNumber, type_invoiceNumber: typeof invoiceNumber,
          customer, type_customer: typeof customer,
          billingDate, type_billingDate: typeof billingDate,
          salesItems, type_salesItems: typeof salesItems,
          salesItemsLength: salesItems && salesItems.length
        });
        console.log('[SALE DEBUG CHECK] !franchiseId:', !franchiseId, franchiseId);
        console.log('[SALE DEBUG CHECK] !invoiceNumber:', !invoiceNumber, invoiceNumber);
        console.log('[SALE DEBUG CHECK] !customer:', !customer, customer);
        console.log('[SALE DEBUG CHECK] !billingDate:', !billingDate, billingDate);
        console.log('[SALE DEBUG CHECK] !salesItems:', !salesItems, salesItems);
        console.log('[SALE DEBUG CHECK] !salesItems.length:', salesItems && !salesItems.length, salesItems && salesItems.length);
        if (!franchiseId) console.error('[SALE DEBUG] franchiseId is missing or falsy:', franchiseId, typeof franchiseId);
        if (!invoiceNumber) console.error('[SALE DEBUG] invoiceNumber is missing or falsy:', invoiceNumber, typeof invoiceNumber);
        if (!customer) console.error('[SALE DEBUG] customer is missing or falsy:', customer, typeof customer);
        if (!billingDate) console.error('[SALE DEBUG] billingDate is missing or falsy:', billingDate, typeof billingDate);
        if (!salesItems) console.error('[SALE DEBUG] salesItems is missing or falsy:', salesItems, typeof salesItems);
        if (salesItems && !salesItems.length) console.error('[SALE DEBUG] salesItems.length is 0:', salesItems.length);
        if (!franchiseId || !invoiceNumber || !customer || !billingDate || !salesItems || !salesItems.length) {
            console.error('[SALE DEBUG] Missing required sale fields:', req.body);
            return res.status(400).json({ success: false, message: "Missing required sale fields" });
        }

        // Validate customer existence
        const Customer = require("../models/customer.model");
        const customerExists = await Customer.findById(customer);
        if (!customerExists) {
            return res.status(400).json({ success: false, message: "Customer does not exist" });
        }

        const newSale = new Sale({
            franchiseId,
            invoiceNumber,
            customer,
            billingAddress,
            billingDate,
            salesItems,
            totalQuantity,
            totalAmount,
            paymentStatus
        });

        await newSale.save();
// Update customer: lastPurchase and amountReceivable
try {
    const Customer = require("../models/customer.model");
    await Customer.findByIdAndUpdate(customer, {
        $set: { lastPurchase: billingDate },
        $inc: { amountReceivable: totalAmount }
    });
} catch (err) {
    console.error('[SALE DEBUG] Error updating customer after sale:', err);
}
res.status(201).json({
    success: true,
    message: "Sale recorded successfully",
    data: newSale
});
    } catch (error) {
        console.error('[SALE DEBUG] Error saving sale:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all sales
exports.getAllSales = async (req, res) => {
    try {
        const { franchiseId } = req.query;
        const filter = {};
        if (franchiseId) {
            filter.franchiseId = franchiseId;
        }
        const sales = await Sale.find(filter).populate('customer');
        res.status(200).json({ success: true, data: sales });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get a single sale
exports.getSaleById = async (req, res) => {
    try {
        const sale = await Sale.findById(req.params.id).populate('customer');
        if (!sale) return res.status(404).json({ success: false, message: "Sale not found" });

        res.status(200).json({ success: true, data: sale });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update a sale
exports.updateSale = async (req, res) => {
    try {
        // Get previous sale to adjust receivable
const prevSale = await Sale.findById(req.params.id);
const updatedSale = await Sale.findByIdAndUpdate(req.params.id, req.body, { new: true });
if (!updatedSale) return res.status(404).json({ success: false, message: "Sale not found" });
// Adjust customer's amountReceivable and lastPurchase
try {
    const Customer = require("../models/customer.model");
    const diff = (req.body.totalAmount || 0) - (prevSale ? prevSale.totalAmount : 0);
    let updateFields = { $inc: { amountReceivable: diff } };
    if (req.body.billingDate && (!prevSale || new Date(req.body.billingDate) > new Date(prevSale.billingDate))) {
        updateFields.$set = { lastPurchase: req.body.billingDate };
    }
    await Customer.findByIdAndUpdate(req.body.customer || (prevSale && prevSale.customer), updateFields);
} catch (err) {
    console.error('[SALE DEBUG] Error updating customer after sale update:', err);
}
res.status(200).json({ success: true, message: "Sale updated successfully", data: updatedSale });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a sale
exports.deleteSale = async (req, res) => {
    try {
        const deletedSale = await Sale.findByIdAndDelete(req.params.id);
        if (!deletedSale) return res.status(404).json({ success: false, message: "Sale not found" });

        res.status(200).json({ success: true, message: "Sale deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Daily Report (Profit, Total Sale, etc.)
exports.getDailyReport = async (req, res) => {
    try {
        const start = new Date();
        start.setHours(0, 0, 0, 0);

        const end = new Date();
        end.setHours(23, 59, 59, 999);

        const todaySales = await Sale.find({ createdAt: { $gte: start, $lte: end } });

        const totalSales = todaySales.length;
        const totalRevenue = todaySales.reduce((sum, sale) => sum + sale.totalAmount, 0);
        const totalProfit = todaySales.reduce((sum, sale) => sum + (sale.profit || 0), 0);

        const zyncoShare = totalProfit * 0.5;
        const franchiseShare = totalProfit * 0.5;

        res.status(200).json({
            success: true,
            reportDate: start.toDateString(),
            totalSales,
            totalRevenue,
            totalProfit,
            zyncoShare,
            franchiseShare,
            details: todaySales,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
