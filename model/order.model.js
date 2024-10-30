const connection = require('../config/database');

function getAllOrder(limit, offset = 0, searchTerm = '') {
    const searchCondition = searchTerm ? `WHERE user_id LIKE ?` : '';
    const queryParams = searchTerm ? [`%${searchTerm}%`] : [];
    const countQuery = `
    SELECT COUNT(*) AS total
    FROM orders
    ${searchCondition}
`;
const fetchQuery = `
SELECT 
    orders.id, 
    orders.user_id, 
    orders.total_price, 
    orders.message, 
    orders.paymentMethod, 
    orders.status, 
    orders.created_at,
    user.name, 
    user.surname, 
    user.phone
FROM 
    orders
JOIN 
    user ON orders.user_id = user.id
${searchCondition}
ORDER BY 
    orders.id DESC
LIMIT ? OFFSET ?;
`;

    const fetchQueryParams = [...queryParams, limit, offset];

    return new Promise((resolve, reject) => {
        connection.query(countQuery, queryParams, (countError, countResults) => {
            if (countError) {
                return reject(countError);
            }
            const total = countResults[0].total;

            connection.query(fetchQuery, fetchQueryParams, (fetchError, fetchResults) => {
                if (fetchError) {
                    return reject(fetchError);
                }
               
                resolve({
                    total,
                    orders: fetchResults,
                });
            });
        });
    });
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

function createOrder(userId, data) {
    return new Promise((resolve, reject) => {
        const createQuery = "INSERT INTO orders(user_id, total_price, message, paymentMethod) VALUES(?, ?, ?, ?)";
        const createUserQuery = "INSERT INTO order_user(name, surname, email, phone, address, company_name, company_number, type, user_id, order_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const insertOrderItemsQuery = 'INSERT INTO order_items (order_id, product_id, quantity) VALUES ?';

        connection.query(createQuery, [userId, data.totalPrice, data.message, data.paymentMethod], (error, result) => {
            if (error) return reject(error);

            const orderId = result.insertId;
            const userDetails = [data.name, data.surname, data.emailUser, data.phone, data.address, data.company, data.companyNumber, data.type, userId, orderId];

            connection.query(createUserQuery, userDetails, (error, result) => {
                if (error) return reject(error);

                const orderItems = JSON.parse(data.product).map(product => [orderId, product.id, product.quantity]);

                connection.query(insertOrderItemsQuery, [orderItems], (err, result) => {
                    if (err) return reject(err);

                    resolve('Order created successfully');
                });
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


function getDetailsOrder(id) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                o.id AS order_id, 
                o.user_id, 
                o.total_price, 
                o.message, 
                o.paymentMethod, 
                o.status, 
                o.created_At AS order_created_At,
                oi.id AS order_item_id, 
                oi.product_id, 
                oi.quantity, 
                oi.created_at AS order_item_created_At,
                p.id AS product_id,
                p.user_id AS product_user_id,
                p.category_id, 
                p.category_slug, 
                p.subcategory_id, 
                p.subcategory_slug, 
                p.itemsubcategory_slug, 
                p.slug, 
                p.manufacter_id, 
                p.name AS product_name, 
                p.description, 
                p.price, 
                p.SKU, 
                p.barcode, 
                p.status AS product_status,
                p.inStock, 
                p.warranty, 
                p.discount, 
                p.is_deal_of_Week, 
                p.path, 
                p.created_at AS product_created_At,
                ou.id AS order_user_id, 
                ou.name, 
                ou.surname, 
                ou.email, 
                ou.phone, 
                ou.address, 
                ou.company_name, 
                ou.company_number, 
                ou.type, 
                ou.created_At AS order_user_created_At
            FROM 
                orders o
            LEFT JOIN 
                order_items oi ON o.id = oi.order_id
            LEFT JOIN 
                product p ON oi.product_id = p.id
            LEFT JOIN 
                order_user ou ON o.id = ou.order_id
            WHERE 
                o.id = ?
        `;

        connection.query(query, [id], (error, results) => {
            if (error) return reject(error);

            if (results.length === 0) {
                return reject(new Error('Order not found'));
            }

            const order = {
                id: results[0].order_id,
                user_id: results[0].user_id,
                total_price: results[0].total_price,
                message: results[0].message,
                paymentMethod: results[0].paymentMethod,
                status: results[0].status,
                created_At: results[0].order_created_At,
                user: {
                    id: results[0].order_user_id,
                    name: results[0].name,
                    surname: results[0].surname,
                    email: results[0].email,
                    phone: results[0].phone,
                    address: results[0].address,
                    company_name: results[0].company_name,
                    company_number: results[0].company_number,
                    type: results[0].type,
                    created_At: results[0].order_user_created_At
                },
                items: results.map(row => ({
                    id: row.order_item_id,
                    product_id: row.product_id,
                    quantity: row.quantity,
                    created_at: row.order_item_created_At,
                    product: {
                        id: row.product_id,
                        user_id: row.product_user_id,
                        category_id: row.category_id,
                        category_slug: row.category_slug,
                        subcategory_id: row.subcategory_id,
                        subcategory_slug: row.subcategory_slug,
                        itemsubcategory_slug: row.itemsubcategory_slug,
                        slug: row.slug,
                        manufacter_id: row.manufacter_id,
                        name: row.product_name,
                        description: row.description,
                        price: row.price,
                        SKU: row.SKU,
                        barcode: row.barcode,
                        status: row.product_status,
                        inStock: row.inStock,
                        warranty: row.warranty,
                        discount: row.discount,
                        is_deal_of_Week: row.is_deal_of_Week,
                        path: row.path,
                        created_at: row.product_created_At
                    }
                }))
            };

            resolve(order);
        });
    });
}


function getOrderByUser(userId) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                o.id AS order_id, 
                o.user_id, 
                o.total_price, 
                o.message, 
                o.paymentMethod, 
                o.status, 
                o.created_At AS order_created_At,
                oi.id AS order_item_id, 
                oi.product_id, 
                oi.quantity, 
                oi.created_at AS order_item_created_At,
                p.id AS product_id,
                p.user_id AS product_user_id,
                p.category_id, 
                p.category_slug, 
                p.subcategory_id, 
                p.subcategory_slug, 
                p.itemsubcategory_slug, 
                p.slug, 
                p.manufacter_id, 
                p.name AS product_name, 
                p.description, 
                p.price, 
                p.SKU, 
                p.barcode, 
                p.status AS product_status,
                p.inStock, 
                p.warranty, 
                p.discount, 
                p.is_deal_of_Week, 
                p.path, 
                p.created_at AS product_created_At,
                ou.id AS order_user_id, 
                ou.name, 
                ou.surname, 
                ou.email, 
                ou.phone, 
                ou.address, 
                ou.company_name, 
                ou.company_number, 
                ou.type, 
                ou.created_At AS order_user_created_At
            FROM 
                orders o
            LEFT JOIN 
                order_items oi ON o.id = oi.order_id
            LEFT JOIN 
                product p ON oi.product_id = p.id
            LEFT JOIN 
                order_user ou ON o.id = ou.order_id
            WHERE 
                o.user_id = ?
        `;

        connection.query(query, [userId], (error, results) => {
            if (error) return reject(error);

            if (results.length === 0) {
                return reject(new Error('No orders found for this user'));
            }

            const ordersMap = {};

            results.forEach(row => {
                if (!ordersMap[row.order_id]) {
                    ordersMap[row.order_id] = {
                        id: row.order_id,
                        user_id: row.user_id,
                        total_price: row.total_price,
                        message: row.message,
                        paymentMethod: row.paymentMethod,
                        status: row.status,
                        created_At: row.order_created_At,
                        user: {
                            id: row.order_user_id,
                            name: row.name,
                            surname: row.surname,
                            email: row.email,
                            phone: row.phone,
                            address: row.address,
                            company_name: row.company_name,
                            company_number: row.company_number,
                            type: row.type,
                            created_At: row.order_user_created_At
                        },
                        items: []
                    };
                }

                ordersMap[row.order_id].items.push({
                    id: row.order_item_id,
                    product_id: row.product_id,
                    quantity: row.quantity,
                    created_at: row.order_item_created_At,
                    product: {
                        id: row.product_id,
                        user_id: row.product_user_id,
                        category_id: row.category_id,
                        category_slug: row.category_slug,
                        subcategory_id: row.subcategory_id,
                        subcategory_slug: row.subcategory_slug,
                        itemsubcategory_slug: row.itemsubcategory_slug,
                        slug: row.slug,
                        manufacter_id: row.manufacter_id,
                        name: row.product_name,
                        description: row.description,
                        price: row.price,
                        SKU: row.SKU,
                        barcode: row.barcode,
                        status: row.product_status,
                        inStock: row.inStock,
                        warranty: row.warranty,
                        discount: row.discount,
                        is_deal_of_Week: row.is_deal_of_Week,
                        path: row.path,
                        created_at: row.product_created_At
                    }
                });
            });

            const orders = Object.values(ordersMap);

            resolve(orders);
        });
    });
}

module.exports = {
    getAllOrder,
    getOrderById,
    deleteOrder,
    createOrder,
    updatedStatus,
    getDetailsOrder,
    getOrderByUser
}