const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const { recordAttendance } = require('../controllers/attendance.controller');

router.post('/', upload.single('selfie'), recordAttendance);

module.exports = router;