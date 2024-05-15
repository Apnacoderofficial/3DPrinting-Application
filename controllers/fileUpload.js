var multer = require('multer'),
    path = require('path'),
    allowedMimeTypes = ['stl'];

var storageHist = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

var uploadFile = multer({
    storage: storageHist,
    fileFilter: function (req, file, cb) {
        if (allowedMimeTypes.indexOf(file.originalname.split('.')[1]) === -1) {
            req.fileValidationError = 'Only .stl File Type are allowed.';
            return cb(null, false, new Error('File type not allowed.'));
        }
        cb(null, true);
    }
});

module.exports.uploadFile = uploadFile;