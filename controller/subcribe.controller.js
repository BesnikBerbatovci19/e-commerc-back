const SubscribeModel = require("../model/subscribe.model");

exports.subscribe = async function(req, res) {
    try {
        const { email } = req.body;
       
        SubscribeModel.subscribe(email)
            .then(() => {
                res.json({
                    success: true,
                    message: "Subscribe successfull"
                })
            })
            .catch((error) => {
                console.error("Error subscribe:", error)
                res.status(500).json({ message: "Error subscribe" })
            })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Interna Server Error" })
    }
}

exports.unsubscribe = async function(req, res) {
    try {
        const { email } = req.body;
        SubscribeModel.unsubscribe(email)
            .then(() => {
                res.json({
                    success: true,
                    message: "UnSubscribe successfull"
                })
            })
            .catch((error) => {
                console.error("Error subscribe:", error)
                res.status(500).json({ message: "Error subscribe" })
            })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Interna Server Error" })
    }
}