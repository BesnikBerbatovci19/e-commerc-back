const connection = require('../config/database');


function getAllCategory(limit, offset = 0, searchTerm = '', all = false) {
    const searchCondition = searchTerm ? `WHERE name LIKE ?` : '';
    const queryParams = searchTerm ? [`%${searchTerm}%`] : [];

    const countQuery = `
        SELECT COUNT(*) AS total
        FROM category
        ${searchCondition}
    `;

    const fetchQuery = `
        SELECT * 
        FROM category
        ${searchCondition}
        ORDER BY id DESC
        ${all ? '' : 'LIMIT ? OFFSET ?'}
    `;

    const fetchQueryParams = all ? queryParams : [...queryParams, limit, offset];

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
                    categories: fetchResults,
                });
            });
        });
    });
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


function getCategoryWithSubCategory() {
    const query = `

    SELECT 
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'id', c.id,
            'name', c.name,
            'description', c.description,
            'subcategories', (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id', sc.id,
                        'category_id', sc.category_id,
                        'name', sc.name,
                        'description', sc.description,
                        'slug', sc.slug,
                        'path', sc.path,
                        'created_at', sc.created_at,
                        'updated_at', sc.updated_at,
                        'item_subcategories', (
                            SELECT JSON_ARRAYAGG(
                                JSON_OBJECT(
                                    'id', isc.id,
                                    'subcategory_id', isc.subcategory_id,
                                    'name', isc.name,
                                    'description', isc.description,
                                    'slug', isc.slug,
                                    'created_at', isc.created_at,
                                    'updated_at', isc.updated_at
                                )
                            )
                            FROM item_subcategory isc
                            WHERE isc.subcategory_id = sc.id
                        )
                    )
                )
                FROM subcategory sc
                WHERE sc.category_id = c.id
            )
        )
    ) AS categories
FROM 
    category c;

    `


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
module.exports = {
    getAllCategory,
    getCategoryById,
    crateCategory,
    updateCategory,
    deleteCategory,
    getCategoryWithSubCategory
}