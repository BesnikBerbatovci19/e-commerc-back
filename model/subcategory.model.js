const connection = require('../config/database');


function getAllSubCategory() {
    const query = 'SELECT * FROM subcategory';

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


function getSubCategoryById(id) {
    const query = 'SELECT * FROM subcategory WHERE id = ?';

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

function crateSubCategory(cat_id, name, description) {
    const query = 'INSERT INTO subcategory(category_id, name, description) VALUES (?, ?, ?)';

    return new Promise((resolve, reject) => {
        connection.query(query, [cat_id, name, description], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results[0])
            }
        })
    })
}

function updateSubCategory(name, description, id, cat_id) {
    const query = `
    UPDATE subcategory 
    SET 
        name = COALESCE(?, name),
        description = COALESCE(?, description)
        WHERE id = ? AND category_id = ?;`

    return new Promise((resolve, reject) => {
        connection.query(query, [name, description, id, cat_id], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}



function deleteSubCategory(id) {
    const query = "DELETE FROM subcategory WHERE id = ?";

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
    getAllSubCategory,
    getSubCategoryById,
    crateSubCategory,
    updateSubCategory,
    deleteSubCategory
}