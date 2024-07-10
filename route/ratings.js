const express = require('express');
const router = express.Router();

const { authMiddleware } = require('../middleware/authMiddleware');


const RatingsController = require('../controller/ratings.controller');

router.post('/createRatings', authMiddleware, RatingsController.createRatings);


module.exports = router;