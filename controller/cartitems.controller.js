const CartItemModel = require("../model/cartitems.model");


exports.createCartItems = async function (req, res) {
    const { bisko_id, product_id, quantity } = req.body
    try {
        CartItemModel.createCartItems(bisko_id, product_id, quantity)
            .then((cartItems) => {
                res.json(cartItems)
            })
            .catch((error) => {
                console.error("Error create items cart:", error)
                res.status(500).json({ message: "Error create items cart" })
            })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Interna Server Error" })
    }
}

exports.getCartItemsByBiskoId = async function (req, res) {
    const { biskoId } = req.params;
    try {
        CartItemModel.getCartItemsByBiskoId(biskoId)
            .then((cartItems) => {
                res.json(cartItems)
            })
            .catch((error) => {
                console.error("Error get items cart :", error)
                res.status(500).json({ message: "Error get items cart" })
            })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Interna Server Error" })
    }
}

exports.updateQuantity = async function (req, res) {
    const { id, quantity } = req.body;
    try {
        CartItemModel.updateCartItemQuantity(id, quantity)
            .then(() => {
                res.json({
                    success: true,
                    message: "Product quantity updated successfull"
                })
            })
            .catch((error) => {
                console.error("Error  quantity updated  :", error)
                res.status(500).json({ message: "Error  quantity updated " })
            })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Interna Server Error" })
    }
}

exports.deleteCartItem = async function (req, res) {
    const { id } = req.params;
    try {
        CartItemModel.deleteCartItem(id)
            .then(() => {
                res.json({
                    success: true,
                    message: "Delete cart items successfull"
                })
            })
            .catch((error) => {
                console.error("Error cart items deleted:", error)
                res.status(500).json({ message: "Error cart items deleted" })
            })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Interna Server Error" })
    }
}

exports.deleteCartItems = async function (req, res) {
    const { biskoId } = req.params;
    try {
        CartItemModel.deleteCartItems(biskoId)
        .then(() => {
            res.json({
                success: true,
                message: "Delete cart items successfull"
            })
        })
        .catch((error) => {
            console.error("Error cart items deleted:", error)
            res.status(500).json({ message: "Error cart items deleted" })
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Interna Server Error" })
    }
}