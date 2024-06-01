const express = require('express');
const router = express.Router();

const { authMiddleware, checkRole } = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/upload/uploadMiddleware');
const ProducController = require('../controller/product.controller');

router.get('/getProduct', authMiddleware, checkRole('admin'), ProducController.getProduct);
router.get('/getProduct/:id', authMiddleware, checkRole('admin', 'user'), ProducController.getProductById);
router.post('/createProduct', authMiddleware, checkRole('admin'), uploadMiddleware,  ProducController.create);
router.put('/update/:id', authMiddleware, checkRole('admin', 'user'), uploadMiddleware, ProducController.update);
router.delete('/delete/:id', authMiddleware, checkRole('admin', 'user'), ProducController.delete);
router.delete('/deletePhotoProduct/:id/:idPhoto', authMiddleware, checkRole('admin', 'user'), ProducController.deletePhoto);

// product user
router.post('/createProductUser', authMiddleware, checkRole('user'), uploadMiddleware, ProducController.createProductUser);
router.get('/getUserProduct', authMiddleware, checkRole('user'), ProducController.getProductUser);


module.exports = router