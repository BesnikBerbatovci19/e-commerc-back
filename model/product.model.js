const connection = require('../config/database');

const { generateSlugSubCategoryByName } = require('../utils/generateSlug');
function getAllProduct() {
    const query = 'SELECT * FROM product'
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


function getProductById(id) {
    const query = 'SELECT * FROM product WHERE id = ?';

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

function createProduct(data) {
    const query = "INSERT INTO product(subcategory_id, subcategory_slug, slug, name, description, price, status, inStock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    const slug = generateSlugSubCategoryByName(data.name);

    return new Promise((resolve, reject) => {
        connection.query(query, [data.subcategory_id, data.subcategory_slug, slug, data.name, data.description, data.price, data.status, data.instock], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results[0])
            }
        })
    })

}

function deleteProduct(id) {
    const query = "DELETE FROM products WHERE id = ?";

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
module.exports = {
    getAllProduct,
    getProductById,
    createProduct,
    deleteProduct
}