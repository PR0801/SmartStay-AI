const mysql = require("mysql");
const dbConfig = require("./db.config.js");
const { table } = require("./table.js");

const connection = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
  port: 3306, 
});

connection.connect((error) => {
  if (error) throw error;
  console.log("Successfully connected to the database.");

  function createTable(tableName, query) {
    const createTableSQL = query;

    connection.query(createTableSQL, (err) => {
      if (err) {
        console.error(`Error creating table:`, err);
      } else {
        console.log(`Table created successfully`);
        if (tableName === "users") insertInitialData();
        if (tableName === "property_types") insertPropertyTypes();
      }
    });
  }

  function insertInitialData() {
    const query =
      "INSERT INTO `users` (`email`, `password`, `user_type`) VALUES ('admin@smartstay.ai', '$2a$10$4X0Vbh0SG2SZ9QnWoD67Muf/hFHO0nG31N7lbBnSwe39ZwF9lsYZK', 'admin');";
    const checkAdmin = "SELECT * FROM users WHERE email='admin@smartstay.ai'";
    connection.query(checkAdmin, (err, result) => {
      if (err) {
        console.error("Error checking admin user:", err);
      } else {
        if (result.length === 0) {
          connection.query(query, (err) => {
            if (err) {
              console.error("Error inserting admin user:", err);
            } else {
              console.log("Admin user inserted successfully");
            }
          });
        }
      }
    });
  }

  function insertPropertyTypes() {
    const query = `
      INSERT INTO property_types (category_name, description) VALUES
      ('PG', 'Managed paying guest accommodation for students.'),
      ('Hostel', 'Shared hostel rooms close to campus facilities.'),
      ('Apartment', 'Private apartments suitable for individual students.'),
      ('Shared Flat', 'Shared flats for students looking to split rent.')
      ON DUPLICATE KEY UPDATE description = VALUES(description);
    `;

    connection.query(query, (err) => {
      if (err) {
        console.error("Error inserting property types:", err);
      } else {
        console.log("Property types inserted successfully");
      }
    });
  }

  table.forEach((e) => {
    const checkTableSQL = `SHOW TABLES LIKE '${e.tableName}'`;

    connection.query(checkTableSQL, (err, results) => {
      if (err) {
        console.error(`Error checking ${e.tableName} table:`, err);
      } else {
        if (results.length === 0) {
          createTable(e.tableName, e.query);
        } else {
          console.log(`${e.tableName} table already exists`);
          if (e.tableName === 'users') {
            insertInitialData();
          }
          if (e.tableName === 'property_types') {
            insertPropertyTypes();
          }
        }
      }
    });
  });
});

module.exports = connection;
