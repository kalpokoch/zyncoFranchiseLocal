require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();

const server_config = require("./configs/server.config");
const db_config = require("./configs/db.config");

const User = require("./models/user.model");

const purchaseRoutes = require("./routes/purchase.routes")
const supplierRoutes = require("./routes/supplier.routes")

// Import Routes
const authRoutes = require("./routes/auth.routes")
const franchiseRoutes = require("./routes/franchise.routes");
const productRoutes = require("./routes/product.Routes")
const settingsRoutes = require("./routes/settings.routes");
const saleRoutes = require("./routes/sale.routes")
const attendanceRoutes = require('./routes/attendance.routes');
const bdeRoutes = require("./routes/bde.routes");
const paymentOutRoutes = require("./routes/paymentOut.routes");
const paymentInRoutes = require("./routes/paymentIn.routes")
const customerRoutes = require("./routes/customer.routes");

app.use(cors({
  origin: ["http://localhost:8080", "http://localhost:5173", "http://127.0.0.1:5173"], // Allow multiple origins
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(db_config.DB_URL)
  .then(() => {
    console.log("Connected to MongoDB");
    initAdminUser(); // Ensure admin user is created
  })
  .catch((err) => {
    console.error("Error while connecting to MongoDB:", err);
  });

// Function to initialize an admin user if not already present
async function initAdminUser() {
  try {
    let user = await User.findOne({ employeeId: "admin" });
    if (user) {
      console.log("Admin user already exists.");
      return;
    }
    user = await User.create({
      name: "Zynco-Franchise",
      employeeId: "Zyncoofficial",
      email: "zyncoofficial@gmail.com",
      userType: "ADMIN",
      password: bcrypt.hashSync("welcome", 8)
    });
    console.log("Admin created:", user);
  } catch (err) {
    console.error("Error while creating admin:", err);
  }
}

// Register Routes
app.use("/Zync-Franc/api/v1/auth", authRoutes);
app.use("/Zync-Franc/api/v1/franchises", franchiseRoutes);
app.use("/Zync-Franc/api/v1/products", productRoutes);
app.use("/Zync-Franc/api/v1/purchases", purchaseRoutes);
app.use("/Zync-Franc/api/v1/suppliers", supplierRoutes);
app.use("/Zync-Franc/api/v1/settings", settingsRoutes);
app.use("/Zync-Franc/api/v1/sales", saleRoutes);
app.use("/Zync-Franc/api/v1/attendance", attendanceRoutes);
app.use("/Zync-Franc/api/v1/bdes", bdeRoutes);
app.use("/Zync-Franc/api/v1/payment-out", paymentOutRoutes);
app.use("/Zync-Franc/api/v1/payment-in", paymentInRoutes);
app.use("/Zync-Franc/api/v1/customers", customerRoutes);

// Start the server
app.listen(server_config.PORT, () => {
  console.log(`🚀 Server running on port: ${server_config.PORT}`);
});
