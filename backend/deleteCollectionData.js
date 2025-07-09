// deleteCollectionData.js
// USAGE: node deleteCollectionData.js <CollectionName>
// Example: node deleteCollectionData.js Supplier

require('dotenv').config();
const mongoose = require('mongoose');

// Register all models so mongoose.model(collectionName) works
require('./models/product.model');
require('./models/supplier.model');
require('./models/user.model');
require('./models/franchise.model');
require('./models/attendance.model');
require('./models/paymentIn.model');
require('./models/paymentOut.model');
require('./models/purchase.model');
require('./models/sale.model');
require('./models/settings.model');
require('./models/customer.model');
require('./models/bde.model');

const MONGO_URI = process.env.MONGO_URI || process.env.DB_CONNECTION_STRING;

if (!MONGO_URI) {
  console.error('MongoDB connection string is missing in environment variables.');
  process.exit(1);
}

const collectionName = process.argv[2];
if (!collectionName) {
  console.error('Please provide a collection (model) name as an argument.');
  console.error('Example: node deleteCollectionData.js Supplier');
  process.exit(1);
}

async function deleteAllDocuments() {
  try {
    await mongoose.connect(MONGO_URI);
    const Model = mongoose.model(collectionName);
    const result = await Model.deleteMany({});
    console.log(`Deleted ${result.deletedCount} documents from collection '${collectionName}'.`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

deleteAllDocuments();
