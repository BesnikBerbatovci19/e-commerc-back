const SpecificationModel = require('../model/specification.model');


exports.getSpecification = async function (req, res) {
    const limit = parseInt(req.query.limit, 10) || 10;
    const page = parseInt(req.query.page, 10) || 1;
    const searchTerm = req.query.search || '';
    try {
        const {total, specifications} = await SpecificationModel.getSpecification(limit,
            (page - 1) * limit,
            searchTerm)

        res.json({ total, specifications });
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