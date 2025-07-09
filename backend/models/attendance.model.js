const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  location: String,
  date: { type: Date, default: Date.now },
  selfieUrl: { type: String, required: true }
});

module.exports = mongoose.model('Attendance', attendanceSchema);
