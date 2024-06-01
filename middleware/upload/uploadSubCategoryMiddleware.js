const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/subcategory');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

const uploadSubCatMiddleware = (req, res, next) => {
    upload.single('file')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        const file = req.file;
        const errors = [];

        if (file) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
            const maxSize = 5 * 1024 * 1024;

            if (!allowedTypes.includes(file.mimetype)) {
                errors.push(`Invalid file type: ${file.originalname}`);
            }

            if (file.size > maxSize) {
                errors.push(`File too large: ${file.originalname}`);
            }
        } else {
            errors.push('No file uploaded');
        }

        if (errors.length > 0) {
            if (file) {
                fs.unlinkSync(file.path);
            }

            return res.status(400).json({ errors });
        }

        req.file = file;

        next();
    });
}

module.exports = uploadSubCatMiddleware;
