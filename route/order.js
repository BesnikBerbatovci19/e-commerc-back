const express = require('express');
const router = express.Router();

const { authMiddleware, checkRole } = require('../middleware/authMiddleware');

const OrderController = require('../controller/order.controller');
router.get('/getAllOrder', authMiddleware, checkRole('admin'), OrderController.getAllOrder);
router.get('/getOrderByUser', authMiddleware, OrderController.getOrderByUser);
router.get('/getDetailsOrder/:id', authMiddleware, checkRole('admin'), OrderController.getDetailsOrder)
router.post('/createOrder', authMiddleware, OrderController.createOrder);
router.put('/updateStatus/:id', authMiddleware, checkRole('admin'), OrderController.updateStatus);
router.post('/createOrderByAdmin', authMiddleware, checkRole('admin'), OrderController.createOrderByAdmin)
module.exports = router;