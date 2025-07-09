const Attendance = require('../models/attendance.model');

exports.recordAttendance = async (req, res) => {
  try {
    const selfieUrl = req.file.path;
    const attendance = await Attendance.create({
      employeeId: req.body.employeeId,
      location: req.body.location,
      selfieUrl
    });
    res.status(201).json({ success: true, attendance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Attendance failed.' });
  }
};