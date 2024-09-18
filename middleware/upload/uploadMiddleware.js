const multer = require('multer');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Set up storage configuration
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

                // Paths for storing the files in separate folders
                const mainDir = path.join(file.destination, 'main');
                const thumbDir = path.join(file.destination, 'thumbnail');

                // Create directories if they don't exist
                if (!fs.existsSync(mainDir)) {
                    fs.mkdirSync(mainDir, { recursive: true });
                }
                if (!fs.existsSync(thumbDir)) {
                    fs.mkdirSync(thumbDir, { recursive: true });
                }

                // Use the same filename for both main and thumbnail, placed in their respective directories
                const fileName = path.basename(file.filename);

                // Set file paths for main and thumbnail images
                const thumbFilePath = path.join(thumbDir, fileName);
                const mainFilePath = path.join(mainDir, fileName);

                try {
                    // Generate thumbnail (250x250)
                    const thumbImage = sharp(file.path)
                        .resize(170, 170, {
                            fit: sharp.fit.cover,
                            background: { r: 255, g: 255, b: 255, alpha: 1 }
                        });

                    if (file.mimetype === 'image/jpeg') {
                        thumbImage.jpeg({ quality: 90 });
                    } else if (file.mimetype === 'image/png') {
                        thumbImage.png({ compressionLevel: 6 });
                    }

                    await thumbImage.toFile(thumbFilePath);

                    // Generate main photo (600x600)
                    const mainImage = sharp(file.path)
                        .resize(600, 600, {
                            fit: sharp.fit.cover,
                            background: { r: 255, g: 255, b: 255, alpha: 1 }
                        });

                    if (file.mimetype === 'image/jpeg') {
                        mainImage.jpeg({ quality: 90 });
                    } else if (file.mimetype === 'image/png') {
                        mainImage.png({ compressionLevel: 6 });
                    }

                    await mainImage.toFile(mainFilePath);

                } catch (resizeError) {
                    errors.push(`Failed to process image: ${file.originalname}`);
                }
            }

            // If there are errors, delete the uploaded files
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
