const connection = require('../config/database');


function hasCompletedOrder(userId, productId) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT COUNT(*) as count FROM orders WHERE user_id = ? AND product_id = ? AND status = "completed"';
        connection.query(query, [userId, productId], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results[0].count > 0);
            }
        });
    });
};

function createRatings(productId, userId, rating, comment) {
    const query = 'INSERT INTO ratings (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)';
    return new Promise((resolve, reject) => {
        connection.query(query, [productId, userId, rating, comment], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results); // Return the insertId of the new rating
            }
        });
    });
}


function getRatingsByProductId(productId) {
    const query = 'SELECT * FROM ratings WHERE product_id = ?'
    connection.query(query, [productId], (error, results) => {
        if (error) {
            reject(error);
        } else {
            resolve(results);
        }
    });
}

function findRatingByUserAndProduct(userId, productId) {
    const query = 'SELECT * FROM ratings WHERE user_id = ? AND product_id = ?';
    return new Promise((resolve, reject) => {
        connection.query(query, [userId, productId], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    })
}

module.exports = {
    createRatings,
    getRatingsByProductId,
    hasCompletedOrder,
    findRatingByUserAndProduct
}