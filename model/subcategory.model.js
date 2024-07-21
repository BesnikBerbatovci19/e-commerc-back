const connection = require('../config/database');
const { generateSlugSubCategoryByName } = require('../utils/generateSlug');

function getAllSubCategory() {
    const query = `
    SELECT subcategory.*, category.name AS category_name
    FROM subcategory
    JOIN category ON subcategory.category_id = category.id
  `;

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


function getSubCategoryById(id) {
    const query = 'SELECT * FROM subcategory WHERE category_id = ?';

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

function crateSubCategory(cat_id, name, description, path) {
    const query = 'INSERT INTO subcategory(category_id, name, description, slug, path) VALUES (?, ?, ?, ?, ?)';
    const slug = generateSlugSubCategoryByName(name);

    return new Promise((resolve, reject) => {
        connection.query(query, [cat_id, name, description, slug, path], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results[0])
            }
        })
    })
}

function updateSubCategory(name, description, id, cat_id) {
    const query = `
    UPDATE subcategory 
    SET 
        name = COALESCE(?, name),
        description = COALESCE(?, description)
        WHERE id = ? AND category_id = ?;`

    return new Promise((resolve, reject) => {
        connection.query(query, [name, description, id, cat_id], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}



function deleteSubCategory(id) {
    const selectQuery = "SELECT * FROM subcategory WHERE id = ?";
    const deleteQuery = "DELETE FROM subcategory WHERE id = ?";

    return new Promise((resolve, reject) => {
        connection.query(selectQuery, [id], (selectError, selectResults) => {
            if (selectError) {
                return reject(selectError);
            }

            if (selectResults.length === 0) {
                return reject(new Error("Subcategory not found"));
            }

            const subCategoryData = selectResults[0];

            connection.query(deleteQuery, [id], (deleteError, deleteResults) => {
                if (deleteError) {
                    return reject(deleteError);
                }

                resolve(subCategoryData);
            });
        });
    });
}


module.exports = {
    getAllSubCategory,
    getSubCategoryById,
    crateSubCategory,
    updateSubCategory,
    deleteSubCategory
}