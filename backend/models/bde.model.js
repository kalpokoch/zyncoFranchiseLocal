// const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");

// const bdeSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   phone: { type: String, required: true },
//   franchise: { type: mongoose.Schema.Types.ObjectId, ref: "Franchise", required: true },
//   password: { type: String, required: true }
// }, { timestamps: true });

// // Hash password before saving
// bdeSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// module.exports = mongoose.model("BDE", bdeSchema);



const mongoose = require("mongoose");

const bdeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  franchiseId: { type: mongoose.Schema.Types.ObjectId, ref: "Franchise", required: true },
  password: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("BDE", bdeSchema);
