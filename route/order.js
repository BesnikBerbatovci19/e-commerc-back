const express = require('express');
const router = express.Router();

const { authMiddleware, checkRole } = require('../middleware/authMiddleware');

const OrderController = require('../controller/order.controller');
router.get('/getAllOrder', authMiddleware, checkRole('admin'), OrderController.getAllOrder);
router.post('/createOrder', authMiddleware, OrderController.createOrder);
router.put('/updateStatus/:id', authMiddleware, checkRole('admin'), OrderController.updateStatus);
module.exports = router;