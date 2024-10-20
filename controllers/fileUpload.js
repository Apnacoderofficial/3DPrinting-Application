var multer = require('multer'),
    path = require('path'),
    allowedMimeTypes = ['stl'];

// var storageHist = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'C:/3DPrinting');
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname)
//     }
// });
var storageHist = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/'));
    },
        // filename: function (req, file, cb) {
        //     cb(null, file.originalname)
        // }
    filename: function(req, file, cb) {
        const originalExtension = path.extname(file.originalname); // Extracts the file extension (e.g., '.stl')
        const originalNameWithoutExtension = path.basename(file.originalname, originalExtension); // Removes the extension
        cb(null, originalNameWithoutExtension + '-' + Date.now() + originalExtension)
    },
});

var uploadFile = multer({
    storage: storageHist,
    limits: { fileSize: 20 * 1024 * 1024 * 1024 },
    fileFilter: function (req, file, cb) {
        if (allowedMimeTypes.indexOf(file.originalname.split('.')[1]) === -1) {
            req.fileValidationError = 'Only .stl File Type are allowed.';
            return cb(null, false, new Error('File type not allowed.'));
        }
        cb(null, true);
    }
});

module.exports.uploadFile = uploadFile;
