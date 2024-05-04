const connection = require('../config/database');


function getAllCategory() {
    const query = 'SELECT * FROM category';

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


function getCategoryById(id) {
    const query = 'SELECT * FROM category WHERE id = ?';

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

function crateCategory(name, description) {
    const query = 'INSERT INTO category(name, description) VALUES (?, ?)';

    return new Promise((resolve, reject) => {
        connection.query(query, [name, description], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results[0])
            }
        })
    })
}

function updateCategory(name, description, id) {
    const query = `
    UPDATE category 
    SET 
        name = COALESCE(?, name),
        description = COALESCE(?, description)
    WHERE id = ?;`;

    return new Promise((resolve, reject) => {
        connection.query(query, [name, description, id], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}



function deleteCategory(id) {
    const query = "DELETE FROM category WHERE id = ?";

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
    getAllCategory,
    getCategoryById,
    crateCategory,
    updateCategory,
    deleteCategory
}