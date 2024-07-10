const SpecificationModel = require('../model/specification.model');


exports.getSpecification = async function (req, res) {
    try {
        await SpecificationModel.getSpecification()
            .then((specification) => res.json(specification))
            .catch((error) => {
                console.log(error)
                res.status(500).json({ success: false, msg: "Interna Server Error" })
            })
    } catch (error) {
        console.error("Error creating ratings:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


exports.create = async function (req, res) {
    const { name, category_id } = req.body;
    try {
        await SpecificationModel.createSpecification(name, category_id)
            .then(() => {
                res.json({
                    success: true,
                    message: "Specification created successfully"
                });
            })
            .catch((error) => {
                console.log(error)
                res.status(500).json({ success: false, msg: "Interna Server Error" })
            })
    } catch (error) {
        console.error("Error creating ratings:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

exports.delete = async function (req, res) {
    const { id } = req.params;
    try {
        await SpecificationModel.deleteSpecification(id)
        .then(() => {
            res.json({
                success: true,
                message: "Specification deleted successfully"
            });
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({ success: false, msg: "Interna Server Error" })
        })
    } catch (error) {
        console.error("Error creating ratings:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


exports.isShowInFilter = async function (req, res) {
    const { id } = req.params
    const { value } = req.body
    try {
        await SpecificationModel.isShowInFilter(value, id)
        .then(() => {
            res.json({
                success: true,
                message: "Specification change successfully"
            });
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({ success: false, msg: "Interna Server Error" })
        })
    } catch (error) {
        console.error("Error creating ratings:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}