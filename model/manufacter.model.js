const connection = require('../config/database');

const { generateSlugSubCategoryByName } = require("../utils/generateSlug");


function getManufacterName() {
    const query = "SELECT * FROM manufacter";

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

function getManufacterBySubCatId(id) {
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



module.exports = {
    getManufacterName,
    getManufacterNameById,
    createManufacterName,
    deleteManufacterName,
    getManufacterByCatId,
    getManufacterBySubCatId
}