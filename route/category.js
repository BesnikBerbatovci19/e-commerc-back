const express = require('express');
const router = express.Router();


const { authMiddleware, checkRole }  = require('../middleware/authMiddleware');

const CategoryController = require('../controller/category.controller');

router.get('/getCategory', authMiddleware, checkRole('admin'), CategoryController.getCategory);
router.get('/getCategory/:id', authMiddleware, checkRole('admin'), CategoryController.getCategoryById);
router.post('/createCategory', authMiddleware, checkRole('admin'), CategoryController.createCategory);
router.delete('/delete/:id', authMiddleware, checkRole('admin'), CategoryController.delete);
router.put('/update/:id', authMiddleware, checkRole('admin'), CategoryController.update);

module.exports = router;
