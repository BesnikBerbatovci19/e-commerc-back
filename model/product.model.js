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

function createProduct(id, data, path) {
    const query = "INSERT INTO product(user_id, subcategory_id, subcategory_slug, slug, name, description, price, status, inStock, path, warranty, discount, barcode, manufacturernumber) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    const slug = generateSlugSubCategoryByName(data.name);

    return new Promise((resolve, reject) => {
        connection.query(query, [id, data.subcategory_id, data.subcategory_slug, slug, data.name, data.description, data.price, data.status, data.instock, path, data.warranty, data.discount, data.barcode, data.manufacturernumber,], (error, results) => {
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

function updateProduct(id, data, paths) {
    const fetchPathsQuery = `SELECT path FROM product WHERE id = ?`;
    const updateQuery = `
    UPDATE product 
    SET 
        name = COALESCE(?, name),
        price = COALESCE(?, price),
        status = COALESCE(?, status),
        inStock = COALESCE(?, inStock),
        warranty = COALESCE(?, warranty),
        discount = COALESCE(?, discount),
        description = COALESCE(?, description),
        barcode = COALESCE(?, barcode),
        manufacturernumber = COALESCE(?, manufacturernumber),
        path = COALESCE(?, path)
        WHERE id = ?
    `;

    return new Promise((resolve, reject) => {
        // Fetch the current paths first
        connection.query(fetchPathsQuery, [id], (error, results) => {
            const joinPath = paths != null ? results[0].path != null ? JSON.parse(results[0].path).concat(paths) : paths : null;
            if (error) {
                return reject(error);
            }
            connection.query(updateQuery, [
                data.name,
                data.price,
                data.status,
                data.inStock,
                data.warranty,
                data.discount,
                data.description,
                data.barcode,
                data.manufacturernumber,
                joinPath == null ? null : JSON.stringify(joinPath),
                id
            ], (error, results) => {
                if (error) {
                    return reject(error);
                } else {
                    return resolve(results.affectedRows > 0);
                }

            });
        });
    });
}

function getProductUser(userId) {
    const query = "SELECT * FROM product WHERE user_id = ?";

    return new Promise((resolve, reject) => {
        connection.query(query, [userId], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results)
            }
        })
    })
}
module.exports = {
    getAllProduct,
    getProductById,
    createProduct,
    deleteProduct,
    deletePhoto,
    updateProduct,
    getProductUser
}