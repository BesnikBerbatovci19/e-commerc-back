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

function createDiscount({ code, amount, valid_from, valid_until, categories, products, subcategories, itemsubcategories }) {
    const query = `
        INSERT INTO discounts (code, amount, valid_from, valid_until, categories, products, subcategories, itemsubcategories)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    return new Promise((resolve, reject) => {
        connection.query(query, [code, amount, valid_from, valid_until, categories, products, subcategories, itemsubcategories], (error, results) => {
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
        
            const discountProducts = discount.products ? discount.products.map(Number) : null;
            const discountItemSubcategories = discount.itemsubcategories ? discount.itemsubcategories.map(Number) : null;
            const discountSubcategories = discount.subcategories ? discount.subcategories.map(Number) : null;
            const discountCategories = discount.categories ? discount.categories.map(Number) : null;

            if (discountProducts && discountProducts.length > 0) {

                const matchedProducts = products.filter(product => discountProducts.includes(parseInt(product)));
                return resolve({ matchedProducts, amount: discount.amount });
            } else if (discountItemSubcategories && discountItemSubcategories.length > 0) {

                const itemSubcategoryQuery = "SELECT id FROM product WHERE itemsubcategory_id IN (?) AND id IN (?)";
                connection.query(itemSubcategoryQuery, [discountItemSubcategories, products], (error, itemResults) => {
                    if (error) {
                        return reject(error);
                    }
                    const matchingProductIds = itemResults.map(result => result.id);
                    return resolve({ matchedProducts: matchingProductIds, amount: discount.amount });
                });
            } else if (discountSubcategories && discountSubcategories.length > 0 ) {
                const subcategoryQuery = "SELECT id FROM product WHERE subcategory_id IN (?) AND id IN (?)";
                connection.query(subcategoryQuery, [discountSubcategories, products], (error, subResults) => {
                    if (error) {
                        return reject(error);
                    }
                    const matchingProductIds = subResults.map(result => result.id);

                    return resolve({ matchedProducts: matchingProductIds, amount: discount.amount });
                });
            } else if (discountCategories && discountCategories.length > 0) {
               
                const categoryQuery = "SELECT id FROM product WHERE category_id IN (?) AND id IN (?)";
                connection.query(categoryQuery, [discountCategories, products], (error, categoryResults) => {
                    if (error) {
                        return reject(error);
                    }
                    const matchingProductIds = categoryResults.map(result => result.id);
                    return resolve({ matchedProducts: matchingProductIds, amount: discount.amount });
                });
            } else {
                return resolve([]);
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