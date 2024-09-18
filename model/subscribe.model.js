const connection = require("../config/database");


function subscribe(email) {
    const query = 'INSERT INTO subscriptions (email) VALUES (?) ON DUPLICATE KEY UPDATE subscribed_at = NOW()';

    return new Promise((resolve, reject) => {
        connection.query(query, [email], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results)
            }
        })
    })
}


function unsubscribe(email) {
    const query = `DELETE FROM subscriptions WHERE email = ?`;
    return new Promise((resolve, reject) => {
        connection.query(query, [email], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results)
            }
        })
    })
}
module.exports = {
    subscribe,
    unsubscribe
}