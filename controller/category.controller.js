const CategoryModel = require('../model/category.model');

const { validationCategoryInput } = require('../validation/category/category');

exports.getCategory = async function(req, res) {
    try {
        CategoryModel.getAllCategory()
            .then((cat) => {
                res.json(cat)
            })
            .catch((error) => {
                console.error("Error get category :", error)
                res.status(500).json({ message: "Error get category" })
            })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Interna Server Error" })
    }
}

exports.getCategoryById = async function(req, res) {
    const { id } = req.params;
    try {
        CategoryModel.getCategoryById(id)
            .then((cat) => {
                res.json(cat)
            })
            .catch((error) => {
                console.error("Error get category :", error)
                res.status(500).json({ message: "Error get category" })
            })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Interna Server Error" })
    }
}

exports.createCategory = async function(req, res) {
    try {
        const { name, description} = req.body;

        const { errors, isValid } = validationCategoryInput(req.body);
        if (!isValid) {
            return res.status(404).json(errors);
        }

       CategoryModel.crateCategory(name, description)
                    .then(() => {
                        res.json({
                            success: true,
                            message: "Category created successfull"
                        })
                    })
                    .catch((error) => {
                        console.error(error)
                        res.status(500).json({ message: "Error create category" })
                    })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Interna Server Error" })
    }
}


exports.delete = async function(req, res) {
    try {
        const { id } = req.params;
        CategoryModel.deleteCategory(id)
            .then(() => {
                res.json({
                    success: true,
                    message: "Category deleted successfull"
                })
            })
            .catch((error) => {
                console.log(error)
                res.status(500).json({ message: "Error deleting category" })
            })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Interna Server Error" })
    }
}


exports.update = async function(req, res) {
    try {
        const { id } = req.params;
        const { name, description} = req.body;
        CategoryModel.updateCategory(name, description, id)
            .then(() => {
                res.json({
                    success: true,
                    message: "Category update successfull",
                })
            })
            .catch((error) => {
                console.log(error)
                res.status(500).json({ message: "Error update categorys" })
            })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Interna update Error" })
    }
}
