const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  franchise: { 
    type: mongoose.Schema.Types.Mixed, // Accept ObjectId or String
    ref: "Franchise",   
    required: true 
  },
  productName: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    required: true 
  },
  purchasePrice: { 
    type: Number, 
    required: true 
  },
  sellingPrice: { 
    type: Number, 
    required: true 
  },
  gst: { 
    type: Number, 
    required: true 
  },
  base_unit: { 
    type: String, 
    required: true 
  },
  conversion_factor: { 
    type: Map, 
    of: Number, 
    required: true 
  },
  stock_quantity: { 
    type: Number, 
    required: true 
  },
  total_stock: { 
    type: Map, 
    of: Number 
  }
}, { timestamps: true });

// Pre-save hook: If franchise is a string (franchiseId), look up Franchise and set ObjectId
productSchema.pre('save', async function(next) {
  if (typeof this.franchise === 'string') {
    const Franchise = mongoose.model('Franchise');
    const franchiseDoc = await Franchise.findOne({ franchiseId: this.franchise });
    if (franchiseDoc) {
      this.franchise = franchiseDoc._id;
    } else {
      return next(new Error('Invalid franchiseId: Franchise not found.'));
    }
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);
