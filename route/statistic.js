const express = require('express');
const router = express.Router();

const { authMiddleware, checkRole }  = require('../middleware/authMiddleware');


const StatisticController= require('../controller/statistic.controller');

router.get('/userCount', authMiddleware, checkRole('admin'), StatisticController.userCount);
router.get('/categoryandsubcategoryCount', authMiddleware, checkRole('admin'), StatisticController.categoryandsubcategoryCount)
module.exports = router;