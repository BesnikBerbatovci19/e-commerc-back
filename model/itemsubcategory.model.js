const connection = require('../config/database');
const { generateSlugSubCategoryByName } = require('../utils/generateSlug');


function getAllItemSubCategory() {
    const query = "SELECT * FROM item_subcategory";

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

function getItemSubCategoryById(id) {
    const query = 'SELECT * FROM item_subcategory WHERE subcategory_id = ?';

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


function createItemSubCategory(subcat_id, name, description) {
    const query = "INSERT INTO item_subcategory(subcategory_id, name, description, slug) VALUES (?, ?, ?, ?)";

    const slug = generateSlugSubCategoryByName(name);

    return new Promise((resolve, reject) => {
        connection.query(query, [subcat_id, name, description, slug], (error, results) => {
            if(error) {
                reject(error)
            } else {
                resolve(results[0])
            }
        })
    })
}

function deleteItemSubCategory(id) {
    const selectQuery = "SELECT * FROM item_subcategory WHERE id = ?";
    const deleteQuery = "DELETE FROM item_subcategory WHERE id = ?";

    return new Promise((resolve, reject) => {
        connection.query(selectQuery, [id], (selectError, selectResults) => {
            if (selectError) {
                return reject(selectError);
            }

            if (selectResults.length === 0) {
                return reject(new Error("ItemSubCategory not found"));
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
    getAllItemSubCategory,
    getItemSubCategoryById,
    createItemSubCategory,
    deleteItemSubCategory
}