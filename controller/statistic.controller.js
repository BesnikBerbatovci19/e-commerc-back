const { getUserCounts, getCategoryAndSubCategor } = require('../model/statistic.model');

exports.userCount = async function (req, res) {
    try {
        const results = await getUserCounts();
        res.json(results);
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Interna Server Error" })
    }
}


exports.categoryandsubcategoryCount = async function (req, res) {
    try {
        const results = await getCategoryAndSubCategor();
        res.json(results);
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Interna Server Error" })
    }
}