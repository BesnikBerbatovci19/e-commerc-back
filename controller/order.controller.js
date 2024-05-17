const OrderModel = require('../model/order.model');

exports.getAllOrder = async function (req, res) {
    try {
        OrderModel.getAllOrder()
            .then((orders) => res.json(orders))
            .catch((error => {
                console.error("Error get orders :", error)
                res.status(500).json({ message: "Error get orders" })
            }))
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Interna Server Error" })
    }

}

exports.getOrderById = async function (req, res) {

}


exports.createOrder = async function (req, res) {
    try {
        const { id } = req.user;
        OrderModel.createOrder(id, req.body)
            .then(() => {
                res.json({
                    success: true,
                    message: "Order created successfull"
                })
            })
            .catch((error) => {
                console.log(error)
                res.status(500).json({ message: "Error created order" })
            })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Interna Server Error" })
    }
}