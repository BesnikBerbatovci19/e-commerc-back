const connection = require('../config/database');



const getUserCounts = async () => {

    const queries = {
        allUsers: 'SELECT COUNT(*) as count FROM user',
        lastMonth: 'SELECT COUNT(*) as count FROM user WHERE created_at > DATE_SUB(NOW(), INTERVAL 1 MONTH)',
        last3Months: 'SELECT COUNT(*) as count FROM user WHERE created_at > DATE_SUB(NOW(), INTERVAL 3 MONTH)',
        last6Months: 'SELECT COUNT(*) as count FROM user WHERE created_at > DATE_SUB(NOW(), INTERVAL 6 MONTH)',
        lastYear: 'SELECT COUNT(*) as count FROM user WHERE created_at > DATE_SUB(NOW(), INTERVAL 1 YEAR)'
    };

    const results = {};
    await Promise.all(Object.keys(queries).map(key => {
        return new Promise((resolve, reject) => {
            connection.query(queries[key], (err, result) => {
                if (err) reject(err);
                results[key] = result[0].count;
                resolve();
            });
        });
    }));
    return results;
};


module.exports = {
    getUserCounts
};