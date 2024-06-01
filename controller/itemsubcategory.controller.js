const ItemSubCategoryModel = require('../model/itemsubcategory.model');

exports.getItemSubCategory = async function (req, res) {
    try {
        ItemSubCategoryModel.getAllItemSubCategory()
            .then((itemSubCat) => {
                res.json(itemSubCat)
            })
            .catch((error) => {
                console.error("Error get itemsubcat :", error)
                res.status(500).json({ message: "Error get itemsubcat" })
            })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Interna Server Error" })
    }
}

exports.getItemSubCategoryById = async function (req, res) {
    const { id } = req.params;
    try {
        ItemSubCategoryModel.getItemSubCategoryById(id)
            .then((itemSubCat) => {
                res.json(itemSubCat)
            })
            .catch((error) => {
                console.error("Error get itemsubcat :", error)
                res.status(500).json({ message: "Error get itemsubcat" })
            })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Interna Server Error" })
    }
}

exports.createItemSubCategory = async function (req, res) {
    try {
        const { itemsubcategory_id, name, description } = req.body;
        ItemSubCategoryModel.createItemSubCategory(itemsubcategory_id, name, description)
            .then(() => {
                res.json({
                    success: true,
                    message: "ItemSub created successfull"
                })
            })
            .catch((error) => {
                console.error(error)
                res.status(500).json({ message: "Error create itemsubcategory" })
            })
    } catch (error) {

    }
}

exports.deleteItemSubCategory = async function (req, res) {
    try {
        const { id } = req.params;
        ItemSubCategoryModel.deleteItemSubCategory(id)
        .then(() => {
            res.json({
                success: true,
                message: "ItemSubCategory deleted successfull"
            })
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({ message: "Error deleting itemsubcategory" })
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Interna Server Error" })
    }
}