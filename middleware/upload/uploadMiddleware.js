const multer = require('multer');
const fs = require('fs');
const path = require('path');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/product');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });


const uploadMiddleware = (req, res, next) => {
    upload.array('files', 15)(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        const files = req.files;
        const errors = [];

     
        if(req.files) {
            files.forEach((file) => {
                const allowedTypes = ['image/jpeg', 'image/png', 'image/svg'];
                const maxSize = 5 * 1024 * 1024;
    
                if (!allowedTypes.includes(file.mimetype)) {
                    errors.push(`Invalid file type: ${file.originalname}`);
                }
    
                if (file.size > maxSize) {
                    errors.push(`File too large: ${file.originalname}`);
                }
            });
        }
      

        if (errors.length > 0) {
            files.forEach((file) => {
                fs.unlinkSync(file.path);
            });

            return res.status(400).json({ errors });
        }

        req.files = files;

        next();
    })
}

module.exports = uploadMiddleware;