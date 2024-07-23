const ProductModel = require('../model/product.model');
const { v4: uuidv4 } = require('uuid')
const fs = require('fs');
const csv = require('csv-parser');
const { validationAddProductInput } = require('../validation/product/product');

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

    const { errors, isValid } = validationAddProductInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    try {
        await ProductModel.createProduct(null, req.body, JSON.stringify(paths));
        res.json({
            success: true,
            message: "Product added successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error adding product",
            error: error.message 
        });
    }
};

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
        const { slug } = req.params
        const queryParams = req.query;
        try {
            const results = await ProductModel.searchQuery(slug, queryParams);
            res.json(results);
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: error.message });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Interna Server Error" })
    }
}

exports.getSearchItemProduct = async function (req, res) {
    try {
        const { slug } = req.params
        const queryParams = req.query;
        try {
            const results = await ProductModel.searchQueryItemProduct(slug, queryParams);
            res.json(results);
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: error.message });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Interna Server Error" })
    }
}

exports.updateDealsOfTheWeek = async function (req, res) {
    const { id } = req.params;
    const { value } = req.body;
    try {
        ProductModel.setDealsOfTheWeek(id, value)
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

exports.getProductByDealsOfTheWeek = async function (req, res) {
    try {
        ProductModel.getDealsOfTheWeek()
            .then((product) => {
                res.json(product)
            })
            .catch((error) => {
                console.log(error)
                res.status(500).json({ message: "Error get product" })
            })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Interna Server Error" })
    }
}

exports.getAllProduct = async function (req, res) {
    const limit = parseInt(req.query.limit, 10) || 10;
    try {
        ProductModel.getProductWithSpecification(limit)
            .then((product) => {
                res.json(product)
            })
            .catch((error) => {
                console.log(error)
                res.status(500).json({ message: "Error get product" })
            })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Interna Server Error" })
    }
}


exports.CreateSpecification = async function (req, res) {
    const { productId, specificationId, value } = req.body;
    try {
        ProductModel.CreateSpecification(productId, specificationId, value)
            .then((product) => {
                res.json(product)
            })
            .catch((error) => {
                console.log(error)
                res.status(500).json({ message: "Error get product" })
            })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Interna Server Error" })
    }
}

exports.deleteSpecificationProduct = async function (req, res) {
    const { id } = req.params;
    try {
        ProductModel.deleteSpecificationProduct(id)
            .then(() => {
                res.json({
                    success: true,
                    message: "Specification deleted successfull!"
                })
            })
            .catch((error) => {
                console.log(error)
                res.status(500).json({ message: "Error delete specification" })
            })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Interna Server Error" })
    }
}

exports.getSingelProduct = async function (req, res) {
    const { slug } = req.params;
    try {
        ProductModel.getSingelProduct(slug)
        .then((product) => {
            res.json(product)
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({ message: "Error delete specification" })
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Interna Server Error" })
    }
}

exports.getDiscountProcut = async function (req, res) {
    try {
        const queryParams = req.query;
        try {
            const results = await ProductModel.searchDiscountQuery( queryParams);
            res.json(results);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Interna Server Error" })
    }
}

exports.getProductByCategory = async function (req, res) {
    try {
        const { slug } = req.params
        const queryParams = req.query;
        try {
            const results = await ProductModel.searchByCategory(slug, queryParams);
            res.json(results);
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: error.message });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Interna Server Error" })
    }
}