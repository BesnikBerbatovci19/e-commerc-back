const connection = require("../config/database");
const bcrypt = require("bcrypt");

function getAllUser(limit, offset = 0, searchTerm = "") {
  const searchCondition = searchTerm
    ? `WHERE name LIKE ? OR surname LIKE ?`
    : "";
  const queryParams = searchTerm ? [`%${searchTerm}%`, `%${searchTerm}%`] : [];

  const countQuery = `
        SELECT COUNT(*) AS total
        FROM user
        ${searchCondition}
    `;

  const fetchQuery = `
        SELECT * 
        FROM user
        ${searchCondition}
        ORDER BY id DESC
        LIMIT ? OFFSET ?;
    `;
  const fetchQueryParams = [...queryParams, limit, offset];

  return new Promise((resolve, reject) => {
    connection.query(countQuery, queryParams, (countError, countResults) => {
      if (countError) {
        return reject(countError);
      }
      const total = countResults[0].total;

      connection.query(
        fetchQuery,
        fetchQueryParams,
        (fetchError, fetchResults) => {
          if (fetchError) {
            return reject(fetchError);
          }
          resolve({
            total,
            users: fetchResults,
          });
        }
      );
    });
  });
}
function findUserById(id) {
  const query = "SELECT * FROM user where id = ?";

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

function createUser(name, surname, email, phone, address, password, role) {
  const query =
    "INSERT INTO user (name, surname, email,  phone, address, password, role) VALUES (?, ?, ?, ?, ?, ?, ?)";
  const hashPassword = bcrypt.hashSync(password, 10);
  return new Promise((resolve, reject) => {
    connection.query(
      query,
      [name, surname, email, phone, address, hashPassword, role],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      }
    );
  });
}

function findByEmail(email) {
  const query = "SELECT * FROM user WHERE email = ?";

  return new Promise((resolve, reject) => {
    connection.query(query, [email], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

function updateUser(name, surname, email, phone, address, password, role, id) {
  let query = `
    UPDATE user 
    SET 
        name = COALESCE(?, name),
        surname = COALESCE(?, surname),
        email = COALESCE(?, email),
        phone = COALESCE(?, phone),
        address = COALESCE(?, address),
        role = COALESCE(?, role)`;

  const params = [name, surname, email, phone, address, role];

  if (password) {
    const hashPassword = bcrypt.hashSync(password, 10);
    query += ", password = ?";
    params.push(hashPassword);
  }
  query += " WHERE id = ?;";

  return new Promise((resolve, reject) => {
    connection.query(query, [...params, id], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

function deleteUser(id) {
  const query = "DELETE FROM user WHERE id = ?";

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

function updateRoleUser(name, surname, email, phone, address, id, password) {
  let query = `
    UPDATE user 
    SET 
        name = COALESCE(?, name),
        surname = COALESCE(?, surname),
        email = COALESCE(?, email),
        phone = COALESCE(?, phone),
        address = COALESCE(?, address)
    WHERE id = ?;
    `;

  const params = [name, surname, email, phone, address, id];

  return new Promise((resolve, reject) => {
    connection.query(query, params, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

module.exports = {
  findUserById,
  createUser,
  findByEmail,
  updateUser,
  deleteUser,
  getAllUser,
  updateRoleUser,
};
