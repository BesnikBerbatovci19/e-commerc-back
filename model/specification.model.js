const connection = require('../config/database');


function getSpecification(limit, offset = 0, searchTerm = '') {
    const searchCondition = searchTerm ? `WHERE s.name LIKE ?` : '';
    const queryParams = searchTerm ? [`%${searchTerm}%`] : [];
 

    const countQuery = `
    SELECT COUNT(*) AS total
    FROM specification
    
`;
const fetchQuery = `
SELECT 
    s.id, 
    s.name, 
    s.category_id, 
    s.created_at,
    s.is_show_in_filter,
    c.id AS category_id, 
    c.name AS category_name, 
    c.description AS category_description 
FROM 
    specification s
JOIN 
    category c ON s.category_id = c.id
${searchCondition}
ORDER BY 
    s.id DESC
LIMIT ? OFFSET ?;
`;
    const fetchQueryParams = [...queryParams, limit, offset];

    return new Promise((resolve, reject) => {
        connection.query(countQuery, queryParams, (countError, countResults) => {
            if (countError) {
                return reject(countError);
            }
            const total = countResults[0].total;

            connection.query(fetchQuery, fetchQueryParams, (fetchError, fetchResults) => {
                if (fetchError) {
                    return reject(fetchError);
                }
                resolve({
                    total,
                    specifications: fetchResults,
                });
            });
        });
    });
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

