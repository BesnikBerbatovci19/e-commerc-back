const connection = require('../config/database');

const { generateSlugSubCategoryByName } = require("../utils/generateSlug");


function getManufacterName(limit, offset = 0, searchTerm = '', all = false) {
    
    const searchCondition = searchTerm ? `WHERE name LIKE ?` : '';
    const queryParams = searchTerm ? [`%${searchTerm}%`] : [];

    const countQuery = `
        SELECT COUNT(*) AS total
        FROM manufacter
        ${searchCondition}
    `;
    
    const fetchQuery = `
        SELECT * 
        FROM manufacter
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
                    manufacters: fetchResults,
                });
            });
        });
    });
}
function getManufacterNameById(id) {
    const query = "SELECT * FROM manufacter WHERE id = ?";

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


function createManufacterName(category_id, name) {
    const slug = generateSlugSubCategoryByName(name);
    const query = "INSERT INTO manufacter(category_id, name, slug) VALUES (?, ?, ?)";

    return new Promise((resolve, reject) => {
        connection.query(query, [category_id, name, slug], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results[0])
            }
        })
    })
}

function deleteManufacterName(id) {
    const query = "DELETE FROM manufacter WHERE id = ?";

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


function getManufacterByCatId(cat_id) {
    const query = `
        SELECT
            m.id ,
            m.name,
            m.slug,
            COUNT(p.id) AS product_count
        FROM
            manufacter m
        LEFT JOIN
            product p ON m.id = p.manufacter_id
        WHERE
            m.category_id = ?
        GROUP BY
            m.id, m.name
        ORDER BY
            product_count DESC;
    `;

    return new Promise((resolve, reject) => {
        connection.query(query, [cat_id], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results)
            }
        })
    })
}

function getManufacterBySubCatId(id, cat_id) {
    const query = `
    SELECT 
        m.id ,
        m.name,
        m.slug,
        COALESCE(COUNT(p.id), 0) AS product_count
    FROM 
        manufacter m
    LEFT JOIN 
        product p ON m.id = p.manufacter_id AND p.subcategory_id = ?
    WHERE 
        m.category_id = ?
    GROUP BY 
        m.id, m.name
    ORDER BY 
        product_count DESC;
`;

    return new Promise((resolve, reject) => {
        connection.query(query, [ cat_id, id], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results)
            }
        })
    })
}


function getMaunufacterByItemCategory(id, slug) {
    const query = `
    SELECT 
        m.id ,
        m.name,
        m.slug,
        COALESCE(COUNT(p.id), 0) AS product_count
    FROM 
        manufacter m
    LEFT JOIN 
        product p ON m.id = p.manufacter_id 
                AND p.itemsubcategory_slug = ?
    WHERE 
        m.category_id = ?
    GROUP BY 
        m.id, m.name
    ORDER BY 
        product_count DESC;

    `;

    return new Promise((resolve, reject) => {
        connection.query(query, [ slug, id], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results)
            }
        })
    })
}


module.exports = {
    getManufacterName,
    getManufacterNameById,
    createManufacterName,
    deleteManufacterName,
    getManufacterByCatId,
    getManufacterBySubCatId,
    getMaunufacterByItemCategory

}