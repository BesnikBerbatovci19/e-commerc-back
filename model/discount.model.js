const connection = require('../config/database');
const moment = require('moment');


function getAllDiscount() {
    const query = "SELECT * FROM discounts";


    return new Promise((resolve, reject) => {
        connection.query(query, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
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

function createDiscount({ code, amount, valid_from, valid_until }) {
    const query = "INSERT INTO discounts (code, amount, valid_from, valid_until) VALUES (?, ?, ?, ?)";
    return new Promise((resolve, reject) => {
        connection.query(query, [code, amount, valid_from ,valid_until], (error, results) => {
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
module.exports = {
    createDiscount,
    findDiscount,
    getAllDiscount,
    deleteDiscount
}