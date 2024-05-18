const connection = require('../config/database');
const fs = require('fs');

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

function createProduct(data, path) {
    const query = "INSERT INTO product(subcategory_id, subcategory_slug, slug, name, description, price, status, inStock, path, warranty, discount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    const slug = generateSlugSubCategoryByName(data.name);

    return new Promise((resolve, reject) => {
        connection.query(query, [data.subcategory_id, data.subcategory_slug, slug, data.name, data.description, data.price, data.status, data.instock, path, data.warranty, data.discount], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results[0])
            }
        })
    })

}

function deleteProduct(id) {
    const query = "DELETE FROM product WHERE id = ?";

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

function deletePhoto(id, idPhoto) {
    const fetchQuery = "SELECT path FROM product WHERE id = ?";
    const updateQuery = "UPDATE product SET path = ? WHERE id = ?";

    return new Promise((resolve, reject) => {
        connection.query(fetchQuery, [id], (error, results) => {
            let remove = JSON.parse(results[0].path).find((item) => item.id == idPhoto);
            fs.unlink(remove.path, (err) => { if (err) throw err; })
            let photo = JSON.parse(results[0].path).filter((item) => item.id != idPhoto);
            connection.query(updateQuery, [JSON.stringify(photo), id], (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results.affectedRows > 0);
            });
        });
    });
}

function updateProduct(id, data, photo) {
    const updateQuery = `
    UPDATE product 
    SET 
        name = COALESCE(?, name),
        price = COALESCE(?, price),
        status = COALESCE(?, status),
        inStock = COALESCE(?, inStock),
        warranty = COALESCE(?, warranty),
        discount = COALESCE(?, discount)
    WHERE id = ?
`;

    return new Promise((resolve, reject) => {
        connection.query(updateQuery, [data.name, data.price, data.status, data.inStock, data.warranty, data.discount, id], (error, results) => {
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
    deleteProduct,
    deletePhoto,
    updateProduct
}