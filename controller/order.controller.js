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
        const { totalPrice, product } = req.body;
        OrderModel.createOrder(id, totalPrice, product)
            .then(() => {
                res.json({
                    success: true,
                    message: "Orders created successfully",
                });
            })
            .catch((error) => {
                console.log(error);
                res.status(500).json({ message: "Error creating orders" });
            });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Interna Server Error" })
    }
}

exports.updateStatus = async function (req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;
        OrderModel.updatedStatus(id, status)
            .then(() => {
                res.json({
                    status: true,
                    message: "Status updated successfull"
                })
            })
            .catch((error) => {
                console.log(error)
                res.status(500).json({ message: "Error updated status" })
            })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Interna Server Error" })
    }
}


exports.createOrderByAdmin = async function (req, res) {
    try {
        const { product_id, quantity, totalPrice, userId } = req.body;
        OrderModel.createOrder(userId, { product_id, quantity, total_price: totalPrice })
            .then(() => {
                res.json({
                    status: true,
                    message: "Order created successfull"
                })
            })
            .catch((error) => {
                console.log(error)
                res.status(500).json({ message: "Error Order created" })
            })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Interna Server Error" })
    }
}