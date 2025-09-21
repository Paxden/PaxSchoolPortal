const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Configure storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "school_uploads", // All files go here in Cloudinary
    format: async (req, file) => "png", // optional, can keep original format
    public_id: (req, file) => `${Date.now()}-${file.originalname}`,
  },
});

// Multer middleware
const upload = multer({ storage });
module.exports = upload;
