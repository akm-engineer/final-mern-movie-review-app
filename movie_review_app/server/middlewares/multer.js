const multer = require("multer");
const storage = multer.diskStorage({});

// Filter function for image files
const imageFileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image")) {
    cb("Supported only image files!!", false);
  }
  cb(null, true);
};

// Filter function for video files
const videoFileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("video")) {
    cb("Supported only video files!!", false);
  }
  cb(null, true);
};
// Multer middleware for handling image uploads
exports.uploadImage = multer({ storage, fileFilter: imageFileFilter });

// Multer middleware for handling video uploads
exports.uploadVideo = multer({ storage, fileFilter: videoFileFilter });
