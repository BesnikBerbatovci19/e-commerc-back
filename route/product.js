const express = require('express');
const router = express.Router();

const { authMiddleware, checkRole } = require('../middleware/authMiddleware');

const ProducController = require('../controller/product.controller');

router.get('/getProduct', authMiddleware, checkRole('admin'), ProducController.getProduct);
router.get('/getProduct/:id', authMiddleware, checkRole('admin'), ProducController.getProductById);
router.post('/createProduct', authMiddleware, checkRole('admin'), ProducController.create);
router.put('/update/:id', authMiddleware, checkRole('admin'), ProducController.update);
router.delete('/delete/:id', authMiddleware, checkRole('admin'), ProducController.delete);
module.exports = router