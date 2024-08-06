const WishListModel = require('../model/wishlist.model');


exports.getProductInWishList = async function (req, res) {
    const { biskoId } = req.params;
    try {
        WishListModel.getProductInWishList(biskoId)
            .then((product) => res.json(product))
            .catch((error) => {
                console.error(error)
                res.status(500).json({ message: "Error get product wishlist" })
            })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Interna Server Error" })
    }
}



exports.createWishList = async function (req, res) {
    const { productId, biskoId } = req.body;
    try {
        WishListModel.createWishList(productId, biskoId)
            .then(() => {
                res.json({
                    success: true,
                    message: "WishList created successfull"
                })
            })
            .catch((error) => {
                console.error(error)
                res.status(500).json({ message: "Error create wishlist" })
            })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Interna Server Error" })
    }
}
exports.deleteFromWishList = async function (req, res) {
    const { biskoId, productId } = req.params;

    try {
        WishListModel.deleteFromWishlist(productId, biskoId)
            .then(() => {
                res.json({
                    success: true,
                    message: "WishList product deleted successfull"
                })
            })
            .catch((error) => {
                console.error(error)
                res.status(500).json({ message: "Error deleted product wishlist" })
            })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Interna Server Error" })
    }
}