const express = require('express');
const router = express.Router();

const SpecificationController = require('../controller/specification.controller')
const { authMiddleware, checkRole } = require('../middleware/authMiddleware');

router.get('/getSpecification', authMiddleware, checkRole('admin'), SpecificationController.getSpecification);
router.post('/createSpecification', authMiddleware, checkRole('admin'), SpecificationController.create);
router.delete('/deleteSpecification/:id', authMiddleware, checkRole('admin'), SpecificationController.delete)


module.exports = router;