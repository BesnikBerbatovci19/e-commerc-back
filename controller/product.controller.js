const ProductModel = require('../model/product.model');



exports.getProduct = async function (req, res) {
    try {
        ProductModel.getAllProduct()
            .then((product) => {
                res.json(product)
            })
            .catch((error) => {
                console.error("Error get products :", error)
                res.status(500).json({ message: "Error get products" })
            })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Interna Server Error" })
    }
}


exports.getProductById = async function (req, res) {
    try {
        const { id } = req.params;
        ProductModel.getProductById(id)
            .then((product) => {
                res.json(product)
            })
            .catch((error) => {
                console.error("Error get product :", error)
                res.status(500).json({ message: "Error get product" })
            })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Interna Server Error" })
    }
}


exports.create = async function (req, res) {
    try {
        ProductModel.createProduct(req.body)
            .then(() => {
                res.json({
                    success: true,
                    message: "Product added successfull"
                })
            })
            .catch((error) => {
                console.log(error)
                res.status(500).json({ message: "Error added product" })
            })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Interna Server Error" })
    }
}


exports.update = async function (req, res) {

}


exports.delete = async function (req, res) {
    try {
        const { id } = req.params;
        ProductModel.deleteProduct(id)
            .then(() => {
                res.json({
                    success: true,
                    message: "Product deleted successfull"
                })
            })
            .catch((error) => {
                console.log(error)
                res.status(500).json({ message: "Error deleting product" })
            })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Interna Server Error" })
    }
}