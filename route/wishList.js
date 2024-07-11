const express = require('express');
const router = express.Router();

const WishListController = require('../controller/wishlist.controller')

router.post('/createWishList', WishListController.createWishList)
router.get('/getProductInWishList/:biskoId', WishListController.getProductInWishList);
router.delete('/deleteFromWishList/:biskoId/:productId', WishListController.deleteFromWishList);


module.exports = router;