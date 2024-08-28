const multer = require('multer');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

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
    upload.array('files', 15)(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        const files = req.files;
        const errors = [];

        if (files && files.length > 0) {
            for (const file of files) {
                const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
                const maxSize = 5 * 1024 * 1024;

                if (!allowedTypes.includes(file.mimetype)) {
                    errors.push(`Invalid file type: ${file.originalname}`);
                    continue;
                }

                if (file.size > maxSize) {
                    errors.push(`File too large: ${file.originalname}`);
                    continue;
                }

                const tempFilePath = `${file.path}-temp`;

                try {
                    const image = sharp(file.path)
                        .resize(300, 200, {
                            fit: sharp.fit.contain, 
                            background: { r: 255, g: 255, b: 255, alpha: 1 } 
                        });

                    // Set quality options based on file type
                    if (file.mimetype === 'image/jpeg') {
                        image.jpeg({ quality: 90 }); // Adjust quality for JPEG
                    } else if (file.mimetype === 'image/png') {
                        image.png({ compressionLevel: 6 }); // Adjust compression for PNG
                    }

                    await image.toFile(tempFilePath);

                    fs.renameSync(tempFilePath, file.path);
                } catch (resizeError) {
                    errors.push(`Failed to resize image: ${file.originalname}`);

                    if (fs.existsSync(tempFilePath)) {
                        fs.unlinkSync(tempFilePath);
                    }
                }
            }

            if (errors.length > 0) {
                files.forEach((file) => {
                    if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path);
                    }
                });
                return res.status(400).json({ errors });
            }
        }

        next();
    });
};

module.exports = uploadMiddleware;
