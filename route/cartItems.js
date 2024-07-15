const express = require('express');
const router = express.Router();

const CartItemsController = require('../controller/cartitems.controller') 

router.post("/createCartItems", CartItemsController.createCartItems);
router.get("/getCartItemsByBiskoId/:biskoId", CartItemsController.getCartItemsByBiskoId);
router.put('/updateQuantity', CartItemsController.updateQuantity);
router.delete('/deleteCartItem/:id', CartItemsController.deleteCartItem)
router.delete('/deleteCartItems/:biskoId' ,CartItemsController.deleteCartItems)
module.exports = router;