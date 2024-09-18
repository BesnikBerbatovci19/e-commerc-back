const express = require("express");
const router = express.Router();

const SubscribeController = require('../controller/subcribe.controller');


router.post("/subscribe", SubscribeController.subscribe);
router.post("/unsubscribe", SubscribeController.unsubscribe);

module.exports = router;