const connection = require('../config/database');

function getAllOrder() {
    const query = `
    SELECT 
    orders.id AS order_id,
    user.id AS userId,
    user.name,
    user.surname,
    user.email,
    user.phone,
    user.address,
    product_id AS product_id,
    product.name AS product_name,
    product.price AS product_price,
    product.status AS product_status,
    product.inStock AS product_instock,
    product.discount AS product_discount,
    product.path,
    orders.quantity,
    orders.total_price,
    orders.status,
    orders.created_at
    FROM 
        orders
    JOIN 
        user ON orders.user_id = user.id
    JOIN 
        product ON orders.product_id = product.id;
    `

    return new Promise((resolve, reject) => {
        connection.query(query, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results)
            }
        })
    })
}


function getOrderById(id) {
    const query = 'SELECT * FROM orders WHERE id = ?';

    return new Promise((resolve, reject) => {
        connection.query(query, [id], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results[0])
            }
        })
    })
}

function createOrder(userId, totalPrice, products) {
    return new Promise((resolve, reject) => {
        const createQuery = "INSERT INTO orders(user_id, total_price) VALUES(?, ?)";
        
        connection.query(createQuery, [userId, totalPrice], (error, result) => {
            if (error) return reject(error);
            
            const orderId = result.insertId;
            const orderItems = JSON.parse(products).map(product => [orderId, product.id, product.quantity]);
            const insertOrderItemsQuery = 'INSERT INTO order_items (order_id, product_id, quantity) VALUES ?';
            
            connection.query(insertOrderItemsQuery, [orderItems], (err, result) => {
                if (err) return reject(err);
                
                resolve('Order created successfully');
            });
        });
    });
}

function deleteOrder(id) {
    const query = 'DELETE FROM orders WHERE id = ?'
    return new Promise((resolve, reject) => {
        connection.query(query, [id], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results.affectedRows > 0);
            }
        });
    });
}


function updatedStatus(id, status) {
    const query = 'UPDATE orders SET status = ? WHERE id = ?';
    return new Promise((resolve, reject) => {
        connection.query(query, [status, id], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results.affectedRows > 0);
            }
        });
    });
}

module.exports = {
    getAllOrder,
    getOrderById,
    deleteOrder,
    createOrder,
    updatedStatus
}