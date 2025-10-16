const multer = require('multer');
const path = require('path');

// Set up storage engine for multer
const storage = multer.diskStorage({
  destination: './uploads/', // Make sure this folder exists in your project root
  filename: function(req, file, cb) {
    // Generate a unique filename to avoid conflicts
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize multer with the storage configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // Limit file size to 10MB
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}); // REMOVED .single('image') from here

// Helper function to check for allowed file types
function checkFileType(file, cb) {
  // Allowed extensions
  const filetypes = /jpeg|jpg|png|gif/;
  // Check the extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check the mime type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

// Export the configured multer instance
// Now it can be used as upload.single(), upload.array(), etc. in your routes.
module.exports = upload;

