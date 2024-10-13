const connection = require("../config/database");
const fs = require("fs");
const axios = require("axios");
const path = require("path");
const sharp = require("sharp");
const { generateSlugSubCategoryByName } = require("../utils/generateSlug");
function getAllProduct() {
  const query = "SELECT * FROM product ORDER BY id DESC";
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
        resolve(results[0]);
      }
    });
  });
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

  const toNullIfEmpty = (value) => (value === "" ? null : value);
  return new Promise((resolve, reject) => {
    connection.query(
      query,
      [
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
        toNullIfEmpty(manfacterId),
      ],
      (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      }
    );
  });
}

function deleteProduct(id) {
  const query = "DELETE FROM product WHERE id = ?";

  return new Promise((resolve, reject) => {
    connection.query(query, [id], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

function deletePhoto(id, idPhoto) {
  const fetchQuery = "SELECT path FROM product WHERE id = ?";
  const updateQuery = "UPDATE product SET path = ? WHERE id = ?";

  return new Promise((resolve, reject) => {
    connection.query(fetchQuery, [id], (error, results) => {
      let photo = JSON.parse(results[0].path).filter(
        (item) => item.id != idPhoto
      );
      connection.query(
        updateQuery,
        [JSON.stringify(photo), id],
        (error, results) => {
          if (error) {
            return reject(error);
          }
          resolve(results.affectedRows > 0);
        }
      );
    });
  });
}

function updateProduct(id, data, paths) {
  const fetchPathsQuery = `SELECT path FROM product WHERE id = ?`;

  const toNullIfEmpty = (value) => {
    if (value === "" || value === "undefined" || value === "null") {
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
        fieldsToUpdate.push("name = ?");
        valuesToUpdate.push(toNullIfEmpty(data.name));
      }
      if (
        data.subcategory_id !== undefined &&
        toNullIfEmpty(data.subcategory_id) !== null
      ) {
        fieldsToUpdate.push("subcategory_id = ?");
        valuesToUpdate.push(toNullIfEmpty(data.subcategory_id));
      }
      if (
        data.subcategory_slug !== undefined &&
        toNullIfEmpty(data.subcategory_slug) !== null
      ) {
        fieldsToUpdate.push("subcategory_slug = ?");
        valuesToUpdate.push(toNullIfEmpty(data.subcategory_slug));
      }
      if (
        data.itemsubcategory_id !== undefined &&
        toNullIfEmpty(data.itemsubcategory_id) !== null
      ) {
        fieldsToUpdate.push("itemsubcategory_id = ?");
        valuesToUpdate.push(toNullIfEmpty(data.itemsubcategory_id));
      }
      if (
        data.itemsubcategory_slug !== undefined &&
        toNullIfEmpty(data.itemsubcategory_slug) !== null
      ) {
        fieldsToUpdate.push("itemsubcategory_slug = ?");
        valuesToUpdate.push(toNullIfEmpty(data.itemsubcategory_slug));
      }
      if (
        data.manufacter_id !== undefined &&
        toNullIfEmpty(data.manufacter_id) !== null
      ) {
        fieldsToUpdate.push("manufacter_id = ?");
        valuesToUpdate.push(toNullIfEmpty(data.manufacter_id));
      }
      if (data.price !== undefined && toNullIfEmpty(data.price) !== null) {
        fieldsToUpdate.push("price = ?");
        valuesToUpdate.push(toNullIfEmpty(data.price));
      }
      if (data.status !== undefined && toNullIfEmpty(data.status) !== null) {
        fieldsToUpdate.push("status = ?");
        valuesToUpdate.push(toNullIfEmpty(data.status));
      }
      if (data.instock !== undefined && toNullIfEmpty(data.instock) !== null) {
        fieldsToUpdate.push("inStock = ?");
        valuesToUpdate.push(toNullIfEmpty(data.instock));
      }
      if (
        data.warranty !== undefined &&
        toNullIfEmpty(data.warranty) !== null
      ) {
        fieldsToUpdate.push("warranty = ?");
        valuesToUpdate.push(toNullIfEmpty(data.warranty));
      }
      if (
        data.discount !== undefined &&
        toNullIfEmpty(data.discount) !== null
      ) {
        fieldsToUpdate.push("discount = ?");
        valuesToUpdate.push(toNullIfEmpty(data.discount));
      }
      if (
        data.description !== undefined &&
        toNullIfEmpty(data.description) !== null
      ) {
        fieldsToUpdate.push("description = ?");
        valuesToUpdate.push(toNullIfEmpty(data.description));
      }
      if (data.barcode !== undefined && toNullIfEmpty(data.barcode) !== null) {
        fieldsToUpdate.push("barcode = ?");
        valuesToUpdate.push(toNullIfEmpty(data.barcode));
      }
      if (data.SKU !== undefined && toNullIfEmpty(data.SKU) !== null) {
        fieldsToUpdate.push("SKU = ?");
        valuesToUpdate.push(toNullIfEmpty(data.SKU));
      }
      if (joinPath !== null) {
        fieldsToUpdate.push("path = ?");
        valuesToUpdate.push(joinPath ? JSON.stringify(joinPath) : null);
      }

      if (fieldsToUpdate.length === 0) {
        return resolve(false);
      }

      const updateQuery = `
                UPDATE product 
                SET ${fieldsToUpdate.join(", ")}
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
        resolve(results);
      }
    });
  });
}

async function createProductMeteron(data) {
  const query =
    "INSERT INTO product(category_id, category_slug, subcategory_id, subcategory_slug, itemsubcategory_id, itemsubcategory_slug, slug, name, description, price, status, inStock, path, discount, barcode, SKU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

  const checkProductQuery =
    "SELECT COUNT(*) AS count FROM product WHERE barcode = ? AND category_id = ? AND subcategory_id = ? AND itemsubcategory_id = ?";

  const categoryMap = {
    Orë: {
      category_id: 10,
      category_slug: "teknologji",
      subcategory_id: 108,
      subcategory_slug: "smart",
      itemsubcategory_id: 115,
      itemsubcategory_slug: "or-mats-aktiviteti",
    },
    Maus: {
      category_id: 10,
      category_slug: "teknologji",
      subcategory_id: 109,
      subcategory_slug: "aksesor",
      itemsubcategory_id: 134,
      itemsubcategory_slug: "maus",
    },
    Kufje: {
      category_id: 10,
      category_slug: "teknologji",
      subcategory_id: 109,
      subcategory_slug: "aksesor",
      itemsubcategory_id: 136,
      itemsubcategory_slug: "kufje-mikrofon",
    },
    Tastierë: {
      category_id: 10,
      category_slug: "teknologji",
      subcategory_id: 109,
      subcategory_slug: "aksesor",
      itemsubcategory_id: 135,
      itemsubcategory_slug: "tastier",
    },
  };

  const itemSubcategoryMap = {};

  let category_slug = null;
  let category_id = null;
  let subcategory_id = null;
  let subcategory_slug = null;
  let itemsubcategory_id = null;
  let itemsubcategory_slug = null;

  if (data.Name) {
    const categories = data.Name.split(" ").map((item) => item.trim());

    for (let category of categories) {
      if (categoryMap[category]) {
        category_id = categoryMap[category].category_id;
        category_slug = categoryMap[category].category_slug;
        subcategory_id = categoryMap[category].subcategory_id;
        subcategory_slug = categoryMap[category].subcategory_slug;
        itemsubcategory_id = categoryMap[category].itemsubcategory_id;
        itemsubcategory_slug = categoryMap[category].itemsubcategory_slug;
        const productExists = await new Promise((resolve, reject) => {
          connection.query(
            checkProductQuery,
            [data.Gtin, category_id, subcategory_id, itemsubcategory_id],
            (error, results) => {
              if (error) {
                reject(error);
              } else {
                resolve(results[0].count > 0);
              }
            }
          );
        });

        if (productExists) {
          return null;
        }

        const slug = generateSlugSubCategoryByName(data.Name);

        let price = Math.round(data.Price);
        let oldPrice = Math.round(data.OldPrice);
        let discount = null;
        if (oldPrice < price) {
          oldPrice = data.Price;
          discount = null;
        } else if (price === oldPrice) {
          oldPrice = data.Price;
          discount = null;
        } else if (oldPrice > price) {
          oldPrice = data.OldPrice;
          discount = data.Price;
        }

        // Insert product
        if (oldPrice) {
          await new Promise((resolve, reject) => {
            connection.query(
              query,
              [
                category_id,
                category_slug,
                subcategory_id,
                subcategory_slug,
                itemsubcategory_id,
                itemsubcategory_slug,
                slug,
                data.Name,
                JSON.stringify(data.ShortDescription),
                oldPrice,
                1,
                10,
                null,
                discount,
                data.Gtin,
                data.SKU,
              ],
              (error, results) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(results.insertId);
                }
              }
            );
          });
        }
        // Exit loop after successful insert
        break;
      }
    }
  }
}
async function createProductByCsv(data) {
  const query =
    "INSERT INTO product(category_id, category_slug, subcategory_id, subcategory_slug, itemsubcategory_id, itemsubcategory_slug, slug, name, description, price, status, inStock, path, discount, barcode, SKU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

  const checkProductQuery =
    "SELECT COUNT(*) AS count FROM product WHERE barcode = ? AND category_id = ? AND subcategory_id = ? AND itemsubcategory_id = ?";

  const categoryMap = {
    Buzë: {
      category_id: 11,
      category_slug: "kozmetikë",
      subcategory_id: 60,
      subcategory_slug: "grim",
      itemsubcategory_id: 16,
      itemsubcategory_slug: "buz",
    },
    Aroma: {
      category_id: 11,
      category_slug: "kozmetikë",
      subcategory_id: 59,
      subcategory_slug: "aroma",
    },
    Brushë: {
      category_id: 11,
      category_slug: "kozmetikë",
      subcategory_id: 60,
      subcategory_slug: "grim",
      itemsubcategory_id: 15,
      itemsubcategory_slug: "brusha-shpuza",
    },
    Balsam: {
      category_id: 11,
      category_slug: "kozmetikë",
      subcategory_id: 62,
      subcategory_slug: "kujdesi-pr-flok",
      itemsubcategory_id: 20,
      itemsubcategory_slug: "balsam",
    },
    "Kujdes për flokët": {
      category_id: 11,
      category_slug: "kozmetikë",
      subcategory_id: 62,
      subcategory_slug: "kujdesi-pr-flok",
      itemsubcategory_id: 21,
      itemsubcategory_slug: "mirmbajtje-t-flokve",
    },
    "Për fëmijë": {
      category_id: 11,
      category_slug: "kozmetikë",
      subcategory_id: 59,
      subcategory_slug: "aroma",
      itemsubcategory_id: 13,
      itemsubcategory_slug: "pr-fmij",
    },
    "Përkujdesje ndaj diellit": {
      category_id: 11,
      category_slug: "kozmetikë",
      subcategory_id: 61,
      subcategory_slug: "kujdesi-pr-lekur",
      itemsubcategory_id: 18,
      itemsubcategory_slug: "prkujdesje-ndaj-diellit",
    },
    "Kujdes personal": {
      category_id: 11,
      category_slug: "kozmetikë",
      subcategory_id: 61,
      subcategory_slug: "kujdesi-pr-lekur",
      itemsubcategory_id: 18,
      itemsubcategory_slug: "prkujdesje-ndaj-diellit",
    },
    Modelim: {
      category_id: 11,
      category_slug: "kozmetike",
      subcategory_id: 62,
      subcategory_slug: "kujdesi-per-flok",
      itemsubcategory_id: 22,
      itemsubcategory_slug: "modelim",
    },
    "Banjë & Dush": {
      category_id: 11,
      category_slug: "kozmetike",
      subcategory_id: 63,
      subcategory_slug: "kujdesi-personal",
      itemsubcategory_id: 24,
      itemsubcategory_slug: "banje-dush",
    },
    "Deodorant & Antiperspirant": {
      category_id: 11,
      category_slug: "kozmetike",
      subcategory_id: 63,
      subcategory_slug: "kujdesi-personal",
      itemsubcategory_id: 25,
      itemsubcategory_slug: "deodorant-antiperspirant",
    },
  };

  const itemSubcategoryMap = {
    "Për femra": {
      itemsubcategory_id: 98,
      itemsubcategory_slug: "pr-femra",
    },
    "Për meshkuj": {
      itemsubcategory_id: 99,
      itemsubcategory_slug: "pr-meshkuj",
    },
  };

  let category_slug = null;
  let category_id = null;
  let subcategory_id = null;
  let subcategory_slug = null;
  let itemsubcategory_id = null;
  let itemsubcategory_slug = null;

  if (data.Categories) {
    const categories = data.Categories.split(";").map((item) => item.trim());

    for (let category of categories) {
      if (categoryMap[category]) {
        category_id = categoryMap[category].category_id;
        category_slug = categoryMap[category].category_slug;
        subcategory_id = categoryMap[category].subcategory_id;
        subcategory_slug = categoryMap[category].subcategory_slug;

        if (category === "Aroma") {
          // console.log(categories);
          const aromaType = categories.filter(
            (item) => item === "Për femra" || item === "Për meshkuj"
          );
          const itemSubcategory = itemSubcategoryMap[aromaType[0]];

          if (itemSubcategory) {
            itemsubcategory_id = itemSubcategory.itemsubcategory_id;
            itemsubcategory_slug = itemSubcategory.itemsubcategory_slug;
          } else {
            console.log("Invalid Aroma type");
            return null;
          }
        } else {
          itemsubcategory_id = categoryMap[category].itemsubcategory_id;
          itemsubcategory_slug = categoryMap[category].itemsubcategory_slug;
        }

        const productExists = await new Promise((resolve, reject) => {
          connection.query(
            checkProductQuery,
            [data.Gtin, category_id, subcategory_id, itemsubcategory_id],
            (error, results) => {
              if (error) {
                reject(error);
              } else {
                resolve(results[0].count > 0);
              }
            }
          );
        });

        if (productExists) {
          return null;
        }

        // Check for the next category if the product exists in this one
        const slug = generateSlugSubCategoryByName(data.Name);

        // Determine Price and Discount based on OldPrice and Price
        let price = Math.round(data.Price);
        let oldPrice = Math.round(data.OldPrice);
        let discount = null;

        if (oldPrice < price) {
          oldPrice = data.Price;
          discount = null;
        } else if (price === oldPrice) {
          oldPrice = data.Price;
          discount = null;
        } else if (oldPrice > price) {
          oldPrice = data.OldPrice;
          discount = data.Price;
        }

        // Insert product
        if (oldPrice) {
          await new Promise((resolve, reject) => {
            connection.query(
              query,
              [
                category_id,
                category_slug,
                subcategory_id,
                subcategory_slug,
                itemsubcategory_id,
                itemsubcategory_slug,
                slug,
                data.Name,
                JSON.stringify(data.FullDescription),
                oldPrice,
                1,
                data.StoreStockQuantity,
                null,
                discount,
                data.Gtin,
                data.Gtin,
              ],
              (error, results) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(results.insertId);
                }
              }
            );
          });
        }
        // Exit loop after successful insert
        break;
      }
    }
  }
}

// async function createProductByCsv(data) {
//     const outputDir = 'uploads/product';
//     const query = "INSERT INTO product(category_id, category_slug, subcategory_id, subcategory_slug, itemsubcategory_id, itemsubcategory_slug, slug, name, description, price, status, inStock, path, discount, barcode, SKU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
//     const checkBarcodeQuery = "SELECT COUNT(*) AS count FROM product WHERE barcode = ?";
//     const cat = data.Categories.split(';')[0];
//     const sub = data.Categories.split(';')[1];
//     const itemSub = data.Categories.split(';')[2];
//     let category_id = null;
//     let category_slug = null;
//     let subcategory_id = null;
//     let subcategory_slug = null;
//     let itemsubcategory_id = null;
//     let itemsubcategory_slug = null;
//     if (cat === "Aksesorë" && data.Foto !== 0 && data.StoreStockQuantity !== 0) {
//         if (
//             !(cat === "Aksesorë" && (
//                 (sub === "Femra" && itemSub === "Syze") ||
//                 (sub === "Meshkuj" && itemSub === "Syze") ||
//                 (sub === "Për të dy gjinitë" && itemSub === "Syze")
//             ))
//         ) {
//             return null;
//         }
//         if (sub === "Femra" && itemSub === "Syze") {
//             category_id = 13;
//             category_slug = "aksesorë";
//             subcategory_id = 69;
//             subcategory_slug = "femra";
//             itemsubcategory_id = 37;
//             itemsubcategory_slug = "syza";
//         } else if (sub === "Meshkuj" && itemSub === "Syze") {
//             category_id = 13;
//             category_slug = "aksesorë";
//             subcategory_id = 70;
//             subcategory_slug = "meshkuj";
//             itemsubcategory_id = 40;
//             itemsubcategory_slug = "syza";
//         } else if (sub === "Për të dy gjinitë" && itemSub === "Syze") {
//             category_id = 13;
//             category_slug = "aksesorë";
//             subcategory_id = 71;
//             subcategory_slug = "meshkuj";
//             itemsubcategory_id = 43;
//             itemsubcategory_slug = "syza";
//         }

//         const slug = generateSlugSubCategoryByName(data.Name);
//         const productExists = await new Promise((resolve, reject) => {
//             connection.query(checkBarcodeQuery, [data.Gtin], (error, results) => {
//                 if (error) {
//                     reject(error);
//                 } else {
//                     resolve(results[0].count > 0);
//                 }
//             });
//         });

//         if (productExists) {
//             return null;
//         }

//         const pathPhoto = await downloadAndResizeImage(data.Foto, outputDir, 300, 200)
//         if (pathPhoto) {
//             const paths = [{ id: uuidv4(), path: pathPhoto }];
//             return new Promise((resolve, reject) => {
//                 connection.query(query, [
//                     category_id,
//                     category_slug,
//                     subcategory_id,        // subcategory_id
//                     subcategory_slug,      // subcategory_slug
//                     itemsubcategory_id,
//                     itemsubcategory_slug,
//                     slug,                  // slug (generated)
//                     data.Name,             // name
//                     JSON.stringify(data.FullDescription), // description
//                     Math.round(data.OldPrice),            // price
//                     1,                     // status
//                     data.StoreStockQuantity, // inStock
//                     JSON.stringify(paths),            // path (assuming data.image is the correct path)
//                     Math.round(data.Price), // discount (use data.warranty or null if not present)
//                     data.Gtin,                  // barcode (pass null if not provided)
//                     data.Gtin               // SKU
//                 ], (error, results) => {
//                     if (error) {
//                         reject(error);
//                     } else {
//                         resolve(results[0]);
//                     }
//                 });
//             });
//         }

//     }

// }
const downloadAndResizeImage = async (imageUrl, outputDir, width, height) => {
  try {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const fileName = `${Date.now()}-${path.basename(imageUrl.split("?")[0])}`; // Remove query parameters
    const filePath = path.join(outputDir, fileName);

    const response = await axios({
      url: imageUrl,
      method: "GET",
      responseType: "arraybuffer",
    });

    const contentType = response.headers["content-type"];
    if (!contentType.startsWith("image/")) {
      return null;
    }

    try {
      await sharp(response.data)
        .resize(width, height, {
          fit: sharp.fit.contain,
          background: { r: 255, g: 255, b: 255, alpha: 1 },
        })
        .toFile(filePath);

      return filePath;
    } catch (sharpError) {
      return null;
    }
  } catch (error) {
    return null;
  }
};

function searchDiscountQuery(data) {
  let query = `SELECT * FROM product WHERE discount IS NOT NULL`;
  const queryParams = [];
  if (data.inStock !== undefined) {
    query += ` AND inStock = ?`;
    queryParams.push(data.inStock);
  }

  if (data.discount === "true") {
    query += ` AND discount IS NOT NULL`;
  }

  if (data.arrivalTime === "true") {
    query += ` AND status = 1`;
  }

  if (data.st === "1") {
    query += ` AND created_at >= NOW() - INTERVAL 30 DAY`;
  } else if (data.st === "1.4") {
    query += ` AND created_at >= NOW() - INTERVAL 90 DAY`;
  }
  if (
    data.priceFrom !== undefined &&
    data.priceFrom !== "" &&
    data.priceTo !== undefined &&
    data.priceTo !== ""
  ) {
    query += ` AND price BETWEEN ? AND ?`;
    queryParams.push(parseInt(data.priceFrom), parseInt(data.priceTo));
  } else if (data.priceFrom !== undefined && data.priceFrom !== "") {
    query += ` AND price >= ?`;
    queryParams.push(parseInt(data.priceFrom));
  } else if (data.priceTo !== undefined && data.priceTo !== "") {
    query += ` AND price <= ?`;
    queryParams.push(parseInt(data.priceTo));
  }

  if (data.removeSold === "true") {
    query += ` AND inStock > 0`;
  }

  query += ` ORDER BY inStock DESC, id DESC `;
  const countQuery = `SELECT COUNT(*) as total FROM product WHERE discount IS NOT NULL`;
  const limit = parseInt(data.limit, 10) || 10;
  const offset = (parseInt(data.page, 10) - 1) * limit || 0;
  const fetchQuery = `SELECT * FROM product WHERE discount IS NOT NULL ORDER BY inStock DESC, id DESC LIMIT ? OFFSET ?`;
  const fetchQueryParams = [...queryParams, limit, offset];

  return new Promise((resolve, reject) => {
        connection.query(countQuery, queryParams, (countError, countResults) => {
          if (countError) {
            return reject(countError);
          }
     
          connection.query(
            fetchQuery,
            fetchQueryParams,
            (fetchError, fetchResults) => {
              if (fetchError) {
                return reject(fetchError);
              }
              resolve({
                total: countResults[0].total,
                products: fetchResults,
              });
            }
          );
        });
      });
    }

function searchByCategory(slug, data) {
  let baseQuery = `FROM product WHERE category_slug = ?`;
  const queryParams = [slug];

  if (data.inStock !== undefined) {
    baseQuery += ` AND inStock = ?`;
    queryParams.push(data.inStock);
  }

  if (data.discount === "true") {
    baseQuery += ` AND discount IS NOT NULL`;
  }

  if (data.arrivalTime === "true") {
    baseQuery += ` AND status = 1`;
  }

  if (data.st === "1") {
    baseQuery += ` AND created_at >= NOW() - INTERVAL 30 DAY`;
  } else if (data.st === "1.4") {
    baseQuery += ` AND created_at >= NOW() - INTERVAL 90 DAY`;
  }

  if (
    data.priceFrom !== undefined &&
    data.priceFrom !== "" &&
    data.priceTo !== undefined &&
    data.priceTo !== ""
  ) {
    baseQuery += ` AND price BETWEEN ? AND ?`;
    queryParams.push(data.priceFrom, data.priceTo);
  } else if (data.priceFrom !== undefined && data.priceFrom !== "") {
    baseQuery += ` AND price >= ?`;
    queryParams.push(data.priceFrom);
  } else if (data.priceTo !== undefined && data.priceTo !== "") {
    baseQuery += ` AND price <= ?`;
    queryParams.push(data.priceTo);
  }

  if (data.removeSold === "true") {
    baseQuery += ` AND inStock > 0`;
  }

  if (data.manufacter && data.manufacter.length > 0) {
    const placeholders = data.manufacter.map(() => "?").join(",");
    baseQuery += ` AND manufacter_id IN (${placeholders})`;
    queryParams.push(...data.manufacter);
  }

  const countQuery = `SELECT COUNT(*) as total ${baseQuery}`;

  const limit = parseInt(data.limit, 10) || 10;
  const page = parseInt(data.page, 10) || 1;
  const offset = (page - 1) * limit;
  const fetchQuery = `SELECT * ${baseQuery} ORDER BY inStock DESC, id DESC LIMIT ? OFFSET ?`;
  const fetchQueryParams = [...queryParams, limit, offset];

  return new Promise((resolve, reject) => {
    connection.query(countQuery, queryParams, (countError, countResults) => {
      if (countError) {
        return reject(countError);
      }

      connection.query(
        fetchQuery,
        fetchQueryParams,
        (fetchError, fetchResults) => {
          if (fetchError) {
            return reject(fetchError);
          }

          resolve({
            total: countResults[0].total,
            products: fetchResults,
          });
        }
      );
    });
  });
}

function searchQuery(slug, data) {
  let baseQuery = `FROM product WHERE subcategory_slug = ? AND subcategory_id = ?`;
  const queryParams = [slug, data.subCatId];
  console.log(data.subCatId);
  if (data.inStock !== undefined) {
    baseQuery += ` AND inStock = ?`;
    queryParams.push(data.inStock);
  }

  if (data.discount === "true") {
    baseQuery += ` AND discount IS NOT NULL`;
  }

  if (data.arrivalTime === "true") {
    baseQuery += ` AND status = 1`;
  }

  if (data.st === "1") {
    baseQuery += ` AND created_at >= NOW() - INTERVAL 30 DAY`;
  } else if (data.st === "1.4") {
    baseQuery += ` AND created_at >= NOW() - INTERVAL 90 DAY`;
  }

  if (
    data.priceFrom !== undefined &&
    data.priceFrom !== "" &&
    data.priceTo !== undefined &&
    data.priceTo !== ""
  ) {
    baseQuery += ` AND price BETWEEN ? AND ?`;
    queryParams.push(data.priceFrom, data.priceTo);
  } else if (data.priceFrom !== undefined && data.priceFrom !== "") {
    baseQuery += ` AND price >= ?`;
    queryParams.push(data.priceFrom);
  } else if (data.priceTo !== undefined && data.priceTo !== "") {
    baseQuery += ` AND price <= ?`;
    queryParams.push(data.priceTo);
  }

  if (data.removeSold === "true") {
    baseQuery += ` AND inStock > 0`;
  }

  if (data.manufacter && data.manufacter.length > 0) {
    const placeholders = data.manufacter.map(() => "?").join(",");
    baseQuery += ` AND manufacter_id IN (${placeholders})`;
    queryParams.push(...data.manufacter);
  }

  const countQuery = `SELECT COUNT(*) as total ${baseQuery}`;

  const limit = parseInt(data.limit, 10) || 10;
  const page = parseInt(data.page, 10) || 1;
  const offset = (page - 1) * limit;
  const fetchQuery = `SELECT * ${baseQuery} ORDER BY inStock DESC, id DESC LIMIT ? OFFSET ?`;
  const fetchQueryParams = [...queryParams, limit, offset];
  return new Promise((resolve, reject) => {
    connection.query(countQuery, queryParams, (countError, countResults) => {
      if (countError) {
        return reject(countError);
      }

      connection.query(
        fetchQuery,
        fetchQueryParams,
        (fetchError, fetchResults) => {
          if (fetchError) {
            return reject(fetchError);
          }
          resolve({
            total: countResults[0].total,
            products: fetchResults,
          });
        }
      );
    });
  });
}

function searchQueryItemProduct(slug, data) {
  let baseQuery = `FROM product WHERE itemsubcategory_slug = ? AND subcategory_id = ?`;
  const queryParams = [slug, data.subCatId];
  if (data.inStock !== undefined) {
    baseQuery += ` AND inStock = ?`;
    queryParams.push(data.inStock);
  }

  if (data.discount === "true") {
    baseQuery += ` AND discount IS NOT NULL`;
  }

  if (data.arrivalTime === "true") {
    baseQuery += ` AND status = 1`;
  }

  if (data.st === "1") {
    baseQuery += ` AND created_at >= NOW() - INTERVAL 30 DAY`;
  } else if (data.st === "1.4") {
    baseQuery += ` AND created_at >= NOW() - INTERVAL 90 DAY`;
  }

  if (
    data.priceFrom !== undefined &&
    data.priceFrom !== "" &&
    data.priceTo !== undefined &&
    data.priceTo !== ""
  ) {
    baseQuery += ` AND price BETWEEN ? AND ?`;
    queryParams.push(data.priceFrom, data.priceTo);
  } else if (data.priceFrom !== undefined && data.priceFrom !== "") {
    baseQuery += ` AND price >= ?`;
    queryParams.push(data.priceFrom);
  } else if (data.priceTo !== undefined && data.priceTo !== "") {
    baseQuery += ` AND price <= ?`;
    queryParams.push(data.priceTo);
  }
  if (data.removeSold === "true") {
    baseQuery += ` AND inStock > 0`;
  }

  if (data.manufacter && data.manufacter.length > 0) {
    const placeholders = data.manufacter.map(() => "?").join(",");
    baseQuery += ` AND manufacter_id  IN (${placeholders})`;
    queryParams.push(...data.manufacter);
  }

  const countQuery = `SELECT COUNT(*) as total ${baseQuery}`;

  const limit = parseInt(data.limit, 10) || 10;
  const page = parseInt(data.page, 10) || 1;
  const offset = (page - 1) * limit;
  const fetchQuery = `SELECT * ${baseQuery} ORDER BY inStock DESC, id DESC LIMIT ? OFFSET ?`;
  const fetchQueryParams = [...queryParams, limit, offset];

  return new Promise((resolve, reject) => {
    connection.query(countQuery, queryParams, (countError, countResults) => {
      if (countError) {
        return reject(countError);
      }

      connection.query(
        fetchQuery,
        fetchQueryParams,
        (fetchError, fetchResults) => {
          if (fetchError) {
            return reject(fetchError);
          }

          resolve({
            total: countResults[0].total,
            products: fetchResults,
          });
        }
      );
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
  const query =
    "INSERT INTO product_specification(product_id, specification_id, value) VALUES (?, ?, ?)";

  return new Promise((reslove, reject) => {
    connection.query(
      query,
      [productId, specificationId, value],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          reslove(results);
        }
      }
    );
  });
}

function getSingelProduct(slug) {
  const query = `
       SELECT 
        p.id AS id,
        p.name AS name,
        p.category_slug AS categoryName,
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
        ) AS specifications,
        AVG(r.rating) AS average_rating,
        COUNT(r.rating) AS rating_count
    FROM 
        product p
    LEFT JOIN 
        product_specification ps ON p.id = ps.product_id
    LEFT JOIN 
        specification s ON ps.specification_id = s.id
    LEFT JOIN 
        ratings r ON p.id = r.product_id
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
    });
  });
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
        resolve(results);
      }
    });
  });
}

function countProductCategory(categoryId) {
  const query = `
            SELECT
                p.category_id,
                COUNT(p.id) AS total_products,
                SUM(CASE WHEN p.status = 1 THEN 1 ELSE 0 END) AS in_time,
                SUM(CASE WHEN p.inStock > 0 THEN 1 ELSE 0 END) AS in_stock_products,
                SUM(CASE WHEN p.inStock = 0 THEN 1 ELSE 0 END) AS sold,
                SUM(CASE WHEN p.discount > 0 THEN 1 ELSE 0 END) AS discounted_products,
                SUM(CASE WHEN p.created_at >= NOW() - INTERVAL 30 DAY THEN 1 ELSE 0 END) AS products_last_30_days,
                SUM(CASE WHEN p.created_at >= NOW() - INTERVAL 90 DAY THEN 1 ELSE 0 END) AS products_last_90_days
            FROM
                product p
            WHERE
                p.category_id = ?
            GROUP BY
                p.category_id;
        `;

  return new Promise((resolve, reject) => {
    connection.query(query, [categoryId], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

function countProductSubCategory(subcategoryId) {
  const query = `
    SELECT
        p.category_id,
        COUNT(p.id) AS total_products,
        SUM(CASE WHEN p.status = 1 THEN 1 ELSE 0 END) AS in_time,
        SUM(CASE WHEN p.inStock > 0 THEN 1 ELSE 0 END) AS in_stock_products,
        SUM(CASE WHEN p.inStock = 0 THEN 1 ELSE 0 END) AS sold,
        SUM(CASE WHEN p.discount > 0 THEN 1 ELSE 0 END) AS discounted_products,
        SUM(CASE WHEN p.created_at >= NOW() - INTERVAL 30 DAY THEN 1 ELSE 0 END) AS products_last_30_days,
        SUM(CASE WHEN p.created_at >= NOW() - INTERVAL 90 DAY THEN 1 ELSE 0 END) AS products_last_90_days
    FROM
        product p
    WHERE
        p.category_id = ?
    GROUP BY
        p.category_id;
`;

  return new Promise((resolve, reject) => {
    connection.query(query, [subcategoryId], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

function searchProductLive(searchQuery) {
  const query = `
        SELECT * FROM product WHERE name LIKE ? LIMIT 10
        `;
  const values = [`%${searchQuery}%`];
  return new Promise((resolve, reject) => {
    connection.query(query, values, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

function searchProductLives(searchQuery, data) {
  let baseQuery = `
        FROM product 
        WHERE 
        (name LIKE ? OR description LIKE ?) 
       
    `;
  const queryParams = [`%${searchQuery}%`, `%${searchQuery}%`];

  if (data.inStock !== undefined) {
    baseQuery += ` AND inStock = ?`;
    queryParams.push(data.inStock);
  }

  if (data.discount === "true") {
    baseQuery += ` AND discount IS NOT NULL`;
  }

  if (data.arrivalTime === "true") {
    baseQuery += ` AND status = 1`;
  }

  if (data.st === "1") {
    baseQuery += ` AND created_at >= NOW() - INTERVAL 30 DAY`;
  } else if (data.st === "1.4") {
    baseQuery += ` AND created_at >= NOW() - INTERVAL 90 DAY`;
  }

  if (
    data.priceFrom !== undefined &&
    data.priceFrom !== "" &&
    data.priceTo !== undefined &&
    data.priceTo !== ""
  ) {
    baseQuery += ` AND price BETWEEN ? AND ?`;
    queryParams.push(data.priceFrom, data.priceTo);
  } else if (data.priceFrom !== undefined && data.priceFrom !== "") {
    baseQuery += ` AND price >= ?`;
    queryParams.push(data.priceFrom);
  } else if (data.priceTo !== undefined && data.priceTo !== "") {
    baseQuery += ` AND price <= ?`;
    queryParams.push(data.priceTo);
  }

  if (data.removeSold === "true") {
    baseQuery += ` AND inStock > 0`;
  }

  if (data.manufacter && data.manufacter.length > 0) {
    const placeholders = data.manufacter.map(() => "?").join(",");
    baseQuery += ` AND manufacter_id IN (${placeholders})`;
    queryParams.push(...data.manufacter);
  }

  const countQuery = `SELECT COUNT(*) as total ${baseQuery}`;

  const limit = parseInt(data.limit, 10) || 10;
  const page = parseInt(data.page, 10) || 1;
  const offset = (page - 1) * limit;
  const fetchQuery = `SELECT * ${baseQuery} ORDER BY inStock DESC, id DESC LIMIT ? OFFSET ?`;
  const fetchQueryParams = [...queryParams, limit, offset];

  return new Promise((resolve, reject) => {
    connection.query(countQuery, queryParams, (countError, countResults) => {
      if (countError) {
        return reject(countError);
      }

      connection.query(
        fetchQuery,
        fetchQueryParams,
        (fetchError, fetchResults) => {
          if (fetchError) {
            return reject(fetchError);
          }

          resolve({
            total: countResults[0].total,
            products: fetchResults,
          });
        }
      );
    });
  });
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
  searchByCategory,
  countProductCategory,
  countProductSubCategory,
  searchProductLive,
  searchProductLives,
  createProductMeteron,
};
