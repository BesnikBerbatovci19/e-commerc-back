const RatingsModel = require('../model/ratings.model');



exports.createRatings = async function (req, res) {
    const { id } = req.user;
    const { productId, rating, comment } = req.body;
    try {
        // const existingRating = await RatingsModel.findRatingByUserAndProduct(id, productId);

        // if (existingRating) {
        //     return res.status(400).json({ error: "You have already rated this product" });
        // }

        // const hasOrder = await RatingsModel.hasCompletedOrder(id, productId);
        // if (!hasOrder) {
        //     return res.status(400).json({ error: "You cannot rate without accepting the product" });
        // }
        await RatingsModel.createRatings(productId, id, rating, comment);
        res.json({
            success: true,
            message: "Rating created successfully"
        });

    } catch (error) {
        console.error("Error creating ratings:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.getRatings = async function (req, res) {
    const { id } = req.params;

    try {
        RatingsModel.getRatingsByProductId(id)
            .then((ratings) => res.json(ratings))
            .catch((error) => {
                console.error("Error get ratings:", error)
                res.status(500).json({ message: "Error get ratings" })
            })
    } catch (error) {
        console.error("Error get ratings:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

exports.getRatingsByUser = async function (req, res) {
    const { id } = req.user;
    try {
        RatingsModel.getRatingsByUser(id)
            .then((ratings) => res.json(ratings))
            .catch((error) => {
                console.error("Error get ratings:", error)
                res.status(500).json({ message: "Error get ratings" })
            })
    } catch (error) {
        console.error("Error get ratings:", error);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

