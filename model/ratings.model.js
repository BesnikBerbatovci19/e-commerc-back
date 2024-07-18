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
    const query = `
            SELECT 
            r.id AS rating_id,
            r.product_id,
            r.user_id,
            r.rating,
            r.comment,
            r.created_at AS rating_created_at,
            u.id AS user_id,
            u.name AS user_name,
            u.email AS user_email
        FROM 
            ratings r
        JOIN 
            user u ON r.user_id = u.id
        WHERE 
            r.product_id = ?;

    `
    return new Promise((resolve, reject) => {
        connection.query(query, [productId], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    })
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

function getRatingsByUser(userId) {
    const query = `
    SELECT 
        r.id AS rating_id,
        r.product_id,
        r.user_id,
        r.rating,
        r.comment,
        r.created_at AS rating_created_at,
        u.id AS user_id,
        u.name AS user_name,
        u.email AS user_email,
        p.name AS product_name,
        p.slug AS product_slug,
        p.path AS product_path
    FROM 
        ratings r
    JOIN 
        user u ON r.user_id = u.id
    JOIN 
        product p ON r.product_id = p.id
    WHERE 
        r.user_id = ?;
`;

    return new Promise((resolve, reject) => {
        connection.query(query, [userId], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

module.exports = {
    createRatings,
    getRatingsByProductId,
    hasCompletedOrder,
    findRatingByUserAndProduct,
    getRatingsByUser
}