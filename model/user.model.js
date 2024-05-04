const connection = require('../config/database');
const bcrypt = require('bcrypt');

function getAllUser() {
    const query = 'SELECT * FROM user';
    return new Promise((resolve, reject) => {
        connection.query(query, (error, results) => {
            if(error) {
                reject(error);
            } else {
                resolve(results)
            }
        })
    })
}

function findUserById(id) {
    const query = 'SELECT * FROM user where id = ?';

    return new Promise((resolve, reject) => {
        connection.query(query, [id], (error, results) => {
            if(error) {
                reject(error);
            } else {
                resolve(results[0])
            }
        })
    })
}


function createUser(name, surname, email, phone, address, password, role) {
    const query = 'INSERT INTO user (name, surname, email,  phone, address, password, role) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const hashPassword = bcrypt.hashSync(password, 10);
    return new Promise((resolve, reject) => {
        connection.query(query, [name, surname,  email, phone, address, hashPassword, role], (error, results) => {
            if(error) {
                reject(error);
            } else {
                resolve(results)
            }
        })
    })
}


function findByEmail(email) {
    const query = 'SELECT * FROM user WHERE email = ?';

    return new Promise((resolve, reject) => {
        connection.query(query, [email], (error, results) => {
            if(error) {
                reject(error);
            } else {
                resolve(results)
            }
        })
    })
}

function updateUser(name, surname, email, phone, address, password, id) {
    const query = `
    UPDATE user 
    SET 
        name = COALESCE(?, name),
        surname = COALESCE(?, surname),
        email = COALESCE(?, email),
        phone = COALESCE(?, phone),
        address = COALESCE(?, address),
        password = COALESCE(?, password)
    WHERE id = ?;`;

        return new Promise((resolve, reject) => {
            connection.query(query, [name, surname, email, phone, address, password, id], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
}


function deleteUser(id) {
    const query = "DELETE FROM user WHERE id = ?";

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
    findUserById,
    createUser,
    findByEmail,
    updateUser,
    deleteUser,
    getAllUser
}