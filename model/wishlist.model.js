const connection = require('../config/database');


function getProductInWishList(biskoId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT p.*, w.id AS wishlistId
        FROM product p
        JOIN wishlist w ON p.id = w.product_id
        WHERE w.bisko_Id = ?
        ORDER BY w.created_at DESC`;
  
      connection.query(query, [biskoId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }

  function createWishList(product_id, biskoId) {
    const checkQuery = "SELECT * FROM wishlist WHERE product_id = ? AND bisko_Id = ?";
    const insertQuery = "INSERT INTO wishlist(product_id, bisko_Id) VALUES (?, ?)";

    return new Promise((resolve, reject) => {
        connection.query(checkQuery, [product_id, biskoId], (checkError, results) => {
            if (checkError) {
                return reject(checkError);
            }

            if (results.length > 0) {
                return reject(new Error("Wishlist already exists"));
            }

            connection.query(insertQuery, [product_id, biskoId], (insertError, insertResults) => {
                if (insertError) {
                    return reject(insertError);
                }
                resolve(insertResults);
            });
        });
    });
}


function deleteFromWishlist(productId, biskoId) {
    const query = `DELETE FROM wishlist WHERE product_id = ${productId} AND bisko_Id = '${biskoId}'`;
    return new Promise((resolve, reject) => {
        connection.query(query,(error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}



module.exports = {
    createWishList,
    getProductInWishList,
    deleteFromWishlist
}