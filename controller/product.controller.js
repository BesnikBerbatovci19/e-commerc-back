const ProductModel = require('../model/product.model');
const { v4: uuidv4 } = require('uuid')
const fs = require('fs');
const csv = require('csv-parser');

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
    const paths = req.files.map((file) => ({ id: uuidv4(), path: file.path }));
    try {
        ProductModel.createProduct(null, req.body, JSON.stringify(paths))
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
    const { id } = req.params;

    const paths = req.files != undefined ? req.files.length > 0 ? req.files.map((file) => ({ id: uuidv4(), path: file.path })) : null : null;

    try {
        ProductModel.updateProduct(id, req.body, paths)
            .then(() => {
                res.json({
                    success: true,
                    message: "Product updated successfull"
                })
            })
            .catch((error) => {
                console.log(error)
                res.status(500).json({ message: "Error updated product" })
            })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Interna Server Error" })
    }
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

exports.deletePhoto = async function (req, res) {
    try {
        const { id, idPhoto } = req.params;
        ProductModel.deletePhoto(id, idPhoto)
            .then(() => {
                res.json({
                    success: true,
                    message: "Photo deleted successfull"
                })
            })
            .catch((error) => {
                console.log(error)
                res.status(500).json({ message: "Error deleting photo" })
            })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Interna Server Error" })
    }
}


exports.createProductUser = async function (req, res) {
    try {
        const paths = req.files.map((file) => ({ id: uuidv4(), path: file.path }));
        const id = req.user.id;
        try {
            ProductModel.createProduct(id, req.body, JSON.stringify(paths))
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
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Interna Server Error" })
    }
}


exports.getProductUser = async function (req, res) {
    try {
        const user_id = req.user.id;
        ProductModel.getProductUser(user_id)
            .then((products) => {
                res.json(products)
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


exports.getProductByCSV = async function (req, res) {
    fs.createReadStream('./file/products.csv')
        .pipe(csv())
        .on('data', (data) => {
            
            // ProductModel.createProductByCsv(data)
        })
        .on('end', () => {
            // You can now work with the data
        });
}



exports.getSearchProduct = async function (req, res) {
    try {
        const queryParams = req.body;
        ProductModel.searchQuery(queryParams)
            .then((products) => {
                res.json(products)
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