const DiscountModel = require('../model/discount.model');

exports.createDiscount = async function (req, res) {
    const { code, amount, valid_from, valid_until, category_id, product_id  } = req.body;
 
    try {
        const existDiscountCode = await DiscountModel.findDiscount(code);
        if (existDiscountCode.length > 0) {
            res.status(404).json({ message: "Kuponi egziton, ju lutem prvoni nje kodë tjetër" });
        } else {
            const discountId = await DiscountModel.createDiscount({ code, amount, valid_from, valid_until,category_id,  product_id: product_id || null });
            res.json({ id: discountId });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error.' });
    }
}

exports.getAllDiscount = async function (req, res) {
    try {
        DiscountModel.getAllDiscount()
            .then((discounts) => res.json(discounts))
            .catch((error) => {
                console.error("Error get discounts:", error)
                res.status(500).json({ message: "Error  get discounts" })
            })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error.' });
    }
}

exports.deleteDiscount = async function (req, res) {
    const { id } = req.params;
    try {
        DiscountModel.deleteDiscount(id)
            .then(() => {
                res.json({
                    success: true,
                    message: "Discount delete successfull"
                })
            })
            .catch((error) => {
                console.error("Error deleted discounts:", error)
                res.status(500).json({ message: "Error deleted discounts" })
            })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error.' });
    }
}
exports.discountedProducts = async function (req, res) {
    const { code } = req.body;
    const products = req.body['products[]'];


    try {
        const { matchedProducts, amount } = await DiscountModel.discountedProducts(code, products);

        if (matchedProducts && matchedProducts.length > 0) {
            res.json({
                success: true,
                message: "Discount is valid",
                discountedProducts: matchedProducts,
                amount
            });
        } else {
            res.json({
                success: false,
                message: "Discount not valid for the provided products",
            });
        }
    } catch (error) {
        console.error("Error finding discount:", error);
        res.status(500).json({ message: "Server error." });
    }
};

