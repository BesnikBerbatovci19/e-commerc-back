const express = require('express');
const router = express.Router();

const { authMiddleware, checkRole }  = require('../middleware/authMiddleware');
const DiscountController = require('../controller/discount.controller');

router.post('/createDiscount', authMiddleware, checkRole('admin'), DiscountController.createDiscount);
router.get('/getAllDiscount', authMiddleware, checkRole('admin'), DiscountController.getAllDiscount);
router.delete('/deleteDiscount/:id', authMiddleware, checkRole('admin'), DiscountController.deleteDiscount);

module.exports = router;

