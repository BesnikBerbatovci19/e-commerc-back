const connection = require('../config/database');


function createCartItems(bisko_id, product_id, quantity) {
    const query = "INSERT INTO cart_items(bisko_id, product_id, quantity) VALUES (?, ?, ?)";

    return new Promise((resolve, reject) => {
        connection.query(query, [bisko_id, product_id, quantity], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results[0])
            }
        })
    })
}

function getCartItemsByBiskoId(biskoId) {
    const query = `
    SELECT cart_items.id AS cart_items_id, cart_items.quantity AS quantity, product.*
    FROM cart_items
    JOIN product ON cart_items.product_id = product.id
    WHERE cart_items.bisko_id = ?
    ORDER BY cart_items.id DESC
    `;
    return new Promise((resolve, reject) => {
        connection.query(query, [biskoId], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results)
            }
        })
    })
}

function updateCartItemQuantity(id, quantity) {
    const query = "UPDATE cart_items SET quantity = ? WHERE id = ?";

    return new Promise((resolve, reject) => {
        connection.query(query, [parseInt(quantity), id], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

function deleteCartItem(id) {
    const query = "DELETE FROM cart_items WHERE id = ?";

    return new Promise((resolve, reject) => {
        connection.query(query, [id], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

function deleteCartItems(biskoId) {
    const query = "DELETE FROM cart_items WHERE bisko_id = ?";

    return new Promise((resolve, reject) => {
        connection.query(query, [biskoId], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

module.exports = {
    createCartItems,
    getCartItemsByBiskoId,
    updateCartItemQuantity,
    deleteCartItem,
    deleteCartItems
}