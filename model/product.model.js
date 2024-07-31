const connection = require('../config/database');
const fs = require('fs');

const { generateSlugSubCategoryByName } = require('../utils/generateSlug');

function getAllProduct() {
    const query = 'SELECT * FROM product ORDER BY id DESC'
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


function getProductById(id) {
    const query = `
        SELECT 
            p.id ,
            p.name,
            p.description,
            p.user_id,
            p.subcategory_id,
            p.subcategory_slug,
            p.itemsubcategory_id,
            p.itemsubcategory_slug,
            p.price,
            p.SKU,
            p.barcode,
            p.discount,
            p.status,
            p.inStock,
            p.warranty,
            p.is_deal_of_week,
            p.path,
            p.created_at AS product_created_at,
            p.updated_at AS product_updated_at,
            IFNULL(
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id', ps.id,
                        'specification_id', ps.specification_id,
                        'specification_name', s.name,
                        'specification_value', ps.value,
                        'specification_created_at', s.created_at,
                        'category_id', c.id,
                        'category_name', c.name,
                        'category_description', c.description
                    )
                ),
                JSON_ARRAY()
            ) AS specifications
        FROM 
            product p
        LEFT JOIN 
            product_specification ps ON p.id = ps.product_id
        LEFT JOIN 
            specification s ON ps.specification_id = s.id
        LEFT JOIN 
            category c ON s.category_id = c.id
        WHERE 
            p.id = ?
        GROUP BY 
            p.id
        ORDER BY 
            p.id;
    `;
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

function createProduct(id, data, path) {
    const query = `
        INSERT INTO product (
            user_id, category_id, category_slug, subcategory_id, subcategory_slug, 
            itemsubcategory_id, itemsubcategory_slug, slug, name, description, 
            price, status, inStock, path, warranty, discount, 
            barcode, SKU, manufacter_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const slug = generateSlugSubCategoryByName(data.name);
    const manfacterId = data.manufacter_id || null;
    const itemSubCatId = data.itemsubcategory_id || null;
    const itemSubCatSlug = data.itemsubcategory_slug || null;

    const toNullIfEmpty = (value) => (value === '' ? null : value);
    return new Promise((resolve, reject) => {
        connection.query(query, [
            id,
            data.category_id,
            data.category_slug,
            data.subcategory_id,
            data.subcategory_slug,
            itemSubCatId,
            itemSubCatSlug,
            slug,
            data.name,
            data.description,
            toNullIfEmpty(data.price),
            data.status,
            data.instock,
            path,
            toNullIfEmpty(data.warranty),
            toNullIfEmpty(data.discount),
            toNullIfEmpty(data.barcode),
            toNullIfEmpty(data.SKU),
            toNullIfEmpty(manfacterId)
        ], (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
        });
    });
}



function deleteProduct(id) {
    const query = "DELETE FROM product WHERE id = ?";

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

function deletePhoto(id, idPhoto) {
    const fetchQuery = "SELECT path FROM product WHERE id = ?";
    const updateQuery = "UPDATE product SET path = ? WHERE id = ?";

    return new Promise((resolve, reject) => {
        connection.query(fetchQuery, [id], (error, results) => {
            let remove = JSON.parse(results[0].path).find((item) => item.id == idPhoto);
            fs.unlink(remove.path, (err) => { if (err) throw err; })
            let photo = JSON.parse(results[0].path).filter((item) => item.id != idPhoto);
            connection.query(updateQuery, [JSON.stringify(photo), id], (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results.affectedRows > 0);
            });
        });
    });
}

function updateProduct(id, data, paths) {
    const fetchPathsQuery = `SELECT path FROM product WHERE id = ?`;

    const toNullIfEmpty = (value) => {
        if (value === '' || value === 'undefined' || value === 'null') {
            return null;
        } else if (value === null || value === undefined) {
            return null;
        } else {
            return value;
        }
    };


    return new Promise((resolve, reject) => {
        connection.query(fetchPathsQuery, [id], (error, results) => {
            if (error) {
                return reject(error);
            }

            let joinPath = paths;
            if (paths && results.length > 0 && results[0].path) {
                const existingPaths = JSON.parse(results[0].path);
                joinPath = existingPaths.concat(paths);
            }

            // Create a list of fields to be updated
            const fieldsToUpdate = [];
            const valuesToUpdate = [];

            if (data.name !== undefined && toNullIfEmpty(data.name) !== null) {
                fieldsToUpdate.push('name = ?');
                valuesToUpdate.push(toNullIfEmpty(data.name));
            }
            if (data.subcategory_id !== undefined && toNullIfEmpty(data.subcategory_id) !== null) {
                fieldsToUpdate.push('subcategory_id = ?');
                valuesToUpdate.push(toNullIfEmpty(data.subcategory_id));
            }
            if (data.subcategory_slug !== undefined && toNullIfEmpty(data.subcategory_slug) !== null) {
                fieldsToUpdate.push('subcategory_slug = ?');
                valuesToUpdate.push(toNullIfEmpty(data.subcategory_slug));
            }
            if (data.itemsubcategory_id !== undefined && toNullIfEmpty(data.itemsubcategory_id) !== null) {
                fieldsToUpdate.push('itemsubcategory_id = ?');
                valuesToUpdate.push(toNullIfEmpty(data.itemsubcategory_id));
            }
            if (data.itemsubcategory_slug !== undefined && toNullIfEmpty(data.itemsubcategory_slug) !== null) {
                fieldsToUpdate.push('itemsubcategory_slug = ?');
                valuesToUpdate.push(toNullIfEmpty(data.itemsubcategory_slug));
            }
            if (data.manufacter_id !== undefined && toNullIfEmpty(data.manufacter_id) !== null) {
                fieldsToUpdate.push('manufacter_id = ?');
                valuesToUpdate.push(toNullIfEmpty(data.manufacter_id));
            }
            if (data.price !== undefined && toNullIfEmpty(data.price) !== null) {
                fieldsToUpdate.push('price = ?');
                valuesToUpdate.push(toNullIfEmpty(data.price));
            }
            if (data.status !== undefined && toNullIfEmpty(data.status) !== null) {
                fieldsToUpdate.push('status = ?');
                valuesToUpdate.push(toNullIfEmpty(data.status));
            }
            if (data.instock !== undefined && toNullIfEmpty(data.instock) !== null) {
                fieldsToUpdate.push('inStock = ?');
                valuesToUpdate.push(toNullIfEmpty(data.instock));
            }
            if (data.warranty !== undefined && toNullIfEmpty(data.warranty) !== null) {
                fieldsToUpdate.push('warranty = ?');
                valuesToUpdate.push(toNullIfEmpty(data.warranty));
            }
            if (data.discount !== undefined && toNullIfEmpty(data.discount) !== null) {
                fieldsToUpdate.push('discount = ?');
                valuesToUpdate.push(toNullIfEmpty(data.discount));
            }
            if (data.description !== undefined && toNullIfEmpty(data.description) !== null) {
                fieldsToUpdate.push('description = ?');
                valuesToUpdate.push(toNullIfEmpty(data.description));
            }
            if (data.barcode !== undefined && toNullIfEmpty(data.barcode) !== null) {
                fieldsToUpdate.push('barcode = ?');
                valuesToUpdate.push(toNullIfEmpty(data.barcode));
            }
            if (data.SKU !== undefined && toNullIfEmpty(data.SKU) !== null) {
                fieldsToUpdate.push('SKU = ?');
                valuesToUpdate.push(toNullIfEmpty(data.SKU));
            }
            if (joinPath !== null) {
                fieldsToUpdate.push('path = ?');
                valuesToUpdate.push(joinPath ? JSON.stringify(joinPath) : null);
            }

            if (fieldsToUpdate.length === 0) {
                return resolve(false);
            }

            const updateQuery = `
                UPDATE product 
                SET ${fieldsToUpdate.join(', ')}
                WHERE id = ?
            `;
            valuesToUpdate.push(id);

            connection.query(updateQuery, valuesToUpdate, (error, results) => {
                if (error) {
                    return reject(error);
                } else {
                    resolve(results.affectedRows > 0);
                }
            });
        });
    });
}




function getProductUser(userId) {
    const query = "SELECT * FROM product WHERE user_id = ?";

    return new Promise((resolve, reject) => {
        connection.query(query, [userId], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results)
            }
        })
    })
}

function createProductByCsv(data) {
    const query = "INSERT INTO product(user_id, subcategory_id, subcategory_slug, slug, name, description, price, status, inStock, path, warranty, discount, barcode, manufacturernumber) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    let subcategory_id = null;
    let subcategory_slug = null;
    if (data.category == "Home & Garden > Household Appliance Accessories") {
        subcategory_id = 9;
        subcategory_slug = "kopësht";
    }


    return new Promise((resolve, reject) => {
        connection.query(query, [null, subcategory_id, subcategory_slug, data.search_name, data.name, JSON.stringify(data.description), data.price, 1, 1, data.image, data.warranty, null, data.SKU, data.SKU], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results[0])
            }
        })
    })
}

function searchDiscountQuery(data) {
    let query = `SELECT * FROM product WHERE discount IS NOT NULL`;
    const queryParams = [];
    if (data.inStock !== undefined) {
        query += ` AND inStock = ?`;
        queryParams.push(data.inStock);
    }

    if (data.discount === 'true') {
        query += ` AND discount IS NOT NULL`;
    }

    if (data.arrivalTime === 'true') {
        query += ` AND status = 1`;
    }

    if (data.st === '1') {
        query += ` AND created_at >= NOW() - INTERVAL 30 DAY`;
    } else if (data.st === '1.4') {
        query += ` AND created_at >= NOW() - INTERVAL 90 DAY`;
    }
    if (data.priceFrom !== undefined && data.priceFrom !== '' && data.priceTo !== undefined && data.priceTo !== '') {
        query += ` AND price BETWEEN ? AND ?`;
        queryParams.push(parseInt(data.priceFrom), parseInt(data.priceTo));
    } else if (data.priceFrom !== undefined && data.priceFrom !== '') {
        query += ` AND price >= ?`;
        queryParams.push(parseInt(data.priceFrom));
    } else if (data.priceTo !== undefined && data.priceTo !== '') {
        query += ` AND price <= ?`;
        queryParams.push(parseInt(data.priceTo));
    }

    if (data.removeSold === 'true') {
        query += ` AND inStock > 0`;
    }

    query += ` ORDER BY inStock DESC, id DESC `;


    return new Promise((resolve, reject) => {
        connection.query(query, queryParams, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

function searchByCategory(slug, data) {
    let query = `SELECT * FROM product`;
    const queryParams = [];
    console.log('qqqq')

    if (data.q !== '') {
        console.log('hello')
        query += ` WHERE name LIKE ? OR description LIKE ?`;
        const searchTerm = `%${data.q}%`;
        queryParams.push(searchTerm, searchTerm);
    } else {
        query += ` WHERE category_slug = ?`;
        queryParams.push(slug);
    }

    if (data.inStock !== undefined) {
        query += ` AND inStock = ?`;
        queryParams.push(data.inStock);
    }

    if (data.discount === 'true') {
        query += ` AND discount IS NOT NULL`;
    }

    if (data.arrivalTime === 'true') {
        query += ` AND status = 1`;
    }

    if (data.st === '1') {
        query += ` AND created_at >= NOW() - INTERVAL 30 DAY`;
    } else if (data.st === '1.4') {
        query += ` AND created_at >= NOW() - INTERVAL 90 DAY`;
    }

    if (data.priceFrom !== undefined && data.priceFrom !== '' && data.priceTo !== undefined && data.priceTo !== '') {
        query += ` AND price BETWEEN ? AND ?`;
        queryParams.push(data.priceFrom, data.priceTo);
    } else if (data.priceFrom !== undefined && data.priceFrom !== '') {
        query += ` AND price >= ?`;
        queryParams.push(data.priceFrom);
    } else if (data.priceTo !== undefined && data.priceTo !== '') {
        query += ` AND price <= ?`;
        queryParams.push(data.priceTo);
    }
    if (data.removeSold === 'true') {
        query += ` AND inStock > 0`;
    }

    if (data.manufacter && data.manufacter.length > 0) {
        const placeholders = data.manufacter.map(() => '?').join(',');
        query += ` AND manufacter_id IN (${placeholders})`;
        queryParams.push(...data.manufacter);
    }

    query += ` ORDER BY inStock DESC, id DESC LIMIT ?`;
    queryParams.push(parseInt(data.limit, 10));

    return new Promise((resolve, reject) => {
        connection.query(query, queryParams, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}
function searchQuery(slug, data) {
    let query = `SELECT * FROM product WHERE subcategory_slug = ? AND subcategory_id = ?`;
    const queryParams = [slug, data.subCatId];

    if (data.inStock !== undefined) {
        query += ` AND inStock = ?`;
        queryParams.push(data.inStock);
    }

    if (data.discount === 'true') {
        query += ` AND discount IS NOT NULL`;
    }

    if (data.arrivalTime === 'true') {
        query += ` AND status = 1`;
    }

    if (data.st === '1') {
        query += ` AND created_at >= NOW() - INTERVAL 30 DAY`;
    } else if (data.st === '1.4') {
        query += ` AND created_at >= NOW() - INTERVAL 90 DAY`;
    }

    if (data.priceFrom !== undefined && data.priceFrom !== '' && data.priceTo !== undefined && data.priceTo !== '') {
        query += ` AND price BETWEEN ? AND ?`;
        queryParams.push(data.priceFrom, data.priceTo);
    } else if (data.priceFrom !== undefined && data.priceFrom !== '') {
        query += ` AND price >= ?`;
        queryParams.push(data.priceFrom);
    } else if (data.priceTo !== undefined && data.priceTo !== '') {
        query += ` AND price <= ?`;
        queryParams.push(data.priceTo);
    }
    if (data.removeSold === 'true') {
        query += ` AND inStock > 0`;
    }

    if (data.manufacter && data.manufacter.length > 0) {
        const placeholders = data.manufacter.map(() => '?').join(',');
        query += ` AND manufacter_id  IN (${placeholders})`;
        queryParams.push(...data.manufacter);
    }

    query += ` ORDER BY inStock DESC, id DESC LIMIT ?`;
    queryParams.push(parseInt(data.limit, 10));

    return new Promise((resolve, reject) => {
        connection.query(query, queryParams, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

function searchQueryItemProduct(slug, data) {
    let query = `SELECT * FROM product WHERE itemsubcategory_slug = ? AND subcategory_id = ?`;
    const queryParams = [slug, data.subCatId];
    if (data.inStock !== undefined) {
        query += ` AND inStock = ?`;
        queryParams.push(data.inStock);
    }

    if (data.discount === 'true') {
        query += ` AND discount IS NOT NULL`;
    }

    if (data.arrivalTime === 'true') {
        query += ` AND status = 1`;
    }

    if (data.st === '1') {
        query += ` AND created_at >= NOW() - INTERVAL 30 DAY`;
    } else if (data.st === '1.4') {
        query += ` AND created_at >= NOW() - INTERVAL 90 DAY`;
    }

    if (data.priceFrom !== undefined && data.priceFrom !== '' && data.priceTo !== undefined && data.priceTo !== '') {
        query += ` AND price BETWEEN ? AND ?`;
        queryParams.push(data.priceFrom, data.priceTo);
    } else if (data.priceFrom !== undefined && data.priceFrom !== '') {
        query += ` AND price >= ?`;
        queryParams.push(data.priceFrom);
    } else if (data.priceTo !== undefined && data.priceTo !== '') {
        query += ` AND price <= ?`;
        queryParams.push(data.priceTo);
    }
    if (data.removeSold === 'true') {
        query += ` AND inStock > 0`;
    }

    if (data.manufacter && data.manufacter.length > 0) {
        const placeholders = data.manufacter.map(() => '?').join(',');
        query += ` AND manufacter_id  IN (${placeholders})`;
        queryParams.push(...data.manufacter);
    }

    query += ` ORDER BY inStock DESC, id DESC LIMIT ?`;
    queryParams.push(parseInt(data.limit) ? parseInt(data.limit) : 10);

    return new Promise((resolve, reject) => {
        connection.query(query, queryParams, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

function setDealsOfTheWeek(id, value) {
    const query = `
    UPDATE product 
    SET 
        is_deal_of_week = COALESCE(?, is_deal_of_week)
        WHERE id = ?
    `;

    return new Promise((resolve, reject) => {
        connection.query(query, [value, id], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

function getDealsOfTheWeek() {
    const query = "SELECT * FROM product WHERE is_deal_of_week = 1";

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

function CreateSpecification(productId, specificationId, value) {
    const query = "INSERT INTO product_specification(product_id, specification_id, value) VALUES (?, ?, ?)";

    return new Promise((reslove, reject) => {
        connection.query(query, [productId, specificationId, value], (error, results) => {
            if (error) {
                reject(error);
            } else {
                reslove(results);
            }
        })
    })
}

function getSingelProduct(slug) {
    const query = `
        SELECT 
            p.id AS id,
            p.name AS name,
            p.description,
            p.user_id,
            p.subcategory_id,
            p.subcategory_slug,
            p.itemsubcategory_id,
            p.itemsubcategory_slug,
            p.price,
            p.slug,
            p.SKU,
            p.barcode,
            p.status,
            p.inStock,
            p.warranty,
            p.is_deal_of_week,
            p.path,
            p.discount,
            p.created_at AS product_created_at,
            p.updated_at AS product_updated_at,
            COALESCE(
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'specification_id', ps.specification_id,
                        'specification_name', s.name,
                        'value', ps.value,
                        'category_id', s.category_id,
                        'created_at', ps.created_at
                    )
                ),
                '[]'
            ) AS specifications
        FROM 
            product p
        LEFT JOIN 
            product_specification ps ON p.id = ps.product_id
        LEFT JOIN 
            specification s ON ps.specification_id = s.id
        WHERE 
            p.slug = ?
        GROUP BY 
            p.id
        ORDER BY 
            p.id DESC;
    `;

    return new Promise((reslove, reject) => {
        connection.query(query, [slug], (error, results) => {
            if (error) {
                reject(error);
            } else {
                reslove(results[0]);
            }
        })
    })
}

function getProductWithSpecification(limit) {
    const query = `
    SELECT 
        p.id AS id,
        p.name AS name,
        p.description,
        p.user_id,
        p.subcategory_id,
        p.subcategory_slug,
        p.itemsubcategory_id,
        p.itemsubcategory_slug,
        p.price,
        p.slug,
        p.SKU,
        p.barcode,
        p.status,
        p.inStock,
        p.warranty,
        p.is_deal_of_week,
        p.path,
        p.discount,
        p.created_at,
        p.updated_at
    FROM 
        product p
    LEFT JOIN 
        product_specification ps ON p.id = ps.product_id
    LEFT JOIN 
        specification s ON ps.specification_id = s.id
    GROUP BY 
        p.id
    ORDER BY 
        p.inStock DESC, p.id DESC
    LIMIT ?;
`;

    return new Promise((resolve, reject) => {
        connection.query(query, [limit], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}


function deleteSpecificationProduct(id) {
    const query = "DELETE FROM product_specification WHERE id = ?";
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
module.exports = {
    CreateSpecification,
    getAllProduct,
    getProductById,
    createProduct,
    deleteProduct,
    deletePhoto,
    updateProduct,
    getProductUser,
    createProductByCsv,
    searchQuery,
    setDealsOfTheWeek,
    getDealsOfTheWeek,
    getProductWithSpecification,
    deleteSpecificationProduct,
    searchQueryItemProduct,
    getSingelProduct,
    searchDiscountQuery,
    searchByCategory
}