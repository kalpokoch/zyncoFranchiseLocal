const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../configs/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'zynco-selfies',
    allowed_formats: ['jpg', 'png'],
  },
});

const upload = multer({ storage });
module.exports = upload;