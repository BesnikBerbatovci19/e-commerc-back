const SubCategoryModel = require('../model/subcategory.model');
const { validationSubCategoryInput } = require('../validation/category/category');
const fs = require('fs');

exports.getSubCategory = async function (req, res) {
    try {
        SubCategoryModel.getAllSubCategory()
            .then((subcat) => {
                res.json(subcat)
            }).catch((error) => {
                console.error("Error get subcategory :", error)
                res.status(500).json({ message: "Error get subcategory" })
            })

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Interna Server Error" })
    }
}

exports.getSubCategoryById = async function (req, res) {
    const { id } = req.params;
    try {
        SubCategoryModel.getSubCategoryById(id)
            .then((subcat) => {
                res.json(subcat)
            })
            .catch((error) => {
                console.error("Error get subcategory :", error)
                res.status(500).json({ message: "Error get subcategory" })
            })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Interna Server Error" })
    }
}

exports.createSubCategory = async function (req, res) {
    const filePath = req.file ? req.file.path : null;
    try {
        const { category_id, name, description } = req.body;
        const { errors, isValid } = validationSubCategoryInput(req.body);

        if (!isValid) {
            if (filePath) {
                fs.unlinkSync(filePath);
            }
            return res.status(400).json(errors);
        }
        SubCategoryModel.crateSubCategory(category_id, name, description, filePath)
            .then(() => {
                res.json({
                    success: true,
                    message: "SubCategory created successfull"
                })
            })
            .catch((error) => {
                console.error(error)
                res.status(500).json({ message: "Error create subcategory" })
            })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Interna Server Error" })
    }


}

exports.update = async function (req, res) {
    try {
        const { id } = req.params;
        const { name, description, category_id } = req.body;
        SubCategoryModel.update(name, description, id, category_id)
            .then(() => {
                res.json({
                    success: true,
                    message: "SubCategory update successfull",
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

exports.delete = async function (req, res) {
    const { id } = req.params;
    try {
        SubCategoryModel.deleteSubCategory(id)
            .then((deleted) => {
                fs.unlinkSync(deleted.path)
                res.json({
                    success: true,
                    message: "SubCategory deleted successfull"
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