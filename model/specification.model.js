const connection = require('../config/database');


function getSpecification() {
    const query = `
        SELECT 
            s.id AS specification_id, 
            s.name AS specification_name, 
            s.category_id, 
            s.created_at,
            s.is_show_in_filter,
            c.id AS category_id, 
            c.name AS category_name, 
            c.description AS category_description 
        FROM specification s 
        JOIN category c ON 
        s.category_id = c.id`

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

function createSpecification(name, category_id) {
    const query = "INSERT INTO specification(name, category_id) VALUE (?, ?)";

    return new Promise((resolve, reject) => {
        connection.query(query, [name, category_id], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results)
            }
        })
    })
}

function deleteSpecification(id) {
    const query = "DELETE FROM specification WHERE id = ?";

    return new Promise((resolve, reject) => {
        connection.query(query, [id], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results)
            }
        })
    })
}

function isShowInFilter(value, id) {
    const filterValue = value === 'undefined' ? 0 : parseInt(value);

    const query = "UPDATE specification SET is_show_in_filter = ?  WHERE id = ? "

    return new Promise((resolve, reject) => {
        connection.query(query, [filterValue, id], (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
        });
    });
}

module.exports = {
    createSpecification,
    getSpecification,
    deleteSpecification,
    isShowInFilter
}

