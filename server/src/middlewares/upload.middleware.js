const multer = require("multer");
const { avatarStorage } = require("../config/cloudinary.config");

const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    console.log("Running here!")
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only image files are allowed (jpg, png, gif, webp)"));
    }
    cb(null, true);
  },
});

module.exports = { uploadAvatar };
