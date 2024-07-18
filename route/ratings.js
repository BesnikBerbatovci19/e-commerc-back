const express = require('express');
const router = express.Router();

const { authMiddleware } = require('../middleware/authMiddleware');


const RatingsController = require('../controller/ratings.controller');

router.post('/createRatings', authMiddleware, RatingsController.createRatings);
router.get('/getRatings/:id', RatingsController.getRatings)
router.get('/getRatingsByUser', authMiddleware, RatingsController.getRatingsByUser)
module.exports = router;