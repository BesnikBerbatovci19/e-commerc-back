const connection = require('../config/database');
const moment = require('moment');


function getAllDiscount(limit, offset = 0, searchTerm = '') {
    const searchCondition = searchTerm ? `WHERE code LIKE ?` : '';
    const queryParams = searchTerm ? [`%${searchTerm}%`] : [];


    const countQuery = `
    SELECT COUNT(*) AS total
    FROM discounts
    ${searchCondition}
`;
    const fetchQuery = `
SELECT * 
FROM discounts
${searchCondition}
ORDER BY id DESC
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
                    cupons: fetchResults,
                });
            });
        });
    });
}
function findDiscount(code) {
    const query = "SELECT * FROM discounts WHERE code = ?";

    return new Promise((resolve, reject) => {
        connection.query(query, [code], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

function createDiscount({ code, amount, valid_from, valid_until, category_id, product_id = null }) {
    const query = "INSERT INTO discounts (code, amount, valid_from, valid_until, category_id, product_id) VALUES (?, ?, ?, ?, ?, ?)";
    return new Promise((resolve, reject) => {
        connection.query(query, [code, amount, valid_from, valid_until, category_id, product_id], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results.insertId);
            }
        });
    });
}


function deleteDiscount(id) {
    const query = "DELETE FROM discounts WHERE id = ?";
    
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
function discountedProducts(code, products) {
    
    const query = "SELECT * FROM discounts WHERE code = ? AND NOW() BETWEEN valid_from AND valid_until";

    return new Promise((resolve, reject) => {
        connection.query(query, [code], (error, results) => {
            if (error) {
                return reject(error);
            }

            if (results.length === 0) {
                
                return resolve([]); 
            }

            const discount = results[0]; 

            if (discount.product_id !== null) {
                const matchedProducts = products.filter(product => product === discount.product_id);
                return resolve({ matchedProducts, amount: discount.amount });
            } else {
                const categoryQuery = "SELECT id FROM product WHERE category_id = ? AND id IN (?)";

                connection.query(categoryQuery, [discount.category_id, products], (error, categoryResults) => {
                    if (error) {
                        return reject(error);
                    }

                    const matchingProductIds = categoryResults.map(result => result.id);
                    console.log("matchingProductIds", matchingProductIds);
                    return resolve({ matchedProducts: matchingProductIds, amount: discount.amount });
                });
            }
        });
    });
}


module.exports = {
    createDiscount,
    findDiscount,
    getAllDiscount,
    deleteDiscount,
    discountedProducts
}