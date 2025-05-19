const mysql = require("mysql2/promise");
require("dotenv").config();
const assets_list = [
  "BTC",
  "USDT",
  "BCH",
  "DOGE",
  "ETC",
  "SHIB",
  "SOL",
  "XRP",
  "BNB",
  "ETH",
  "PEPE",
];
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Check if a value exists
async function valueExists(table, column, value) {
  const [rows] = await pool.query(
    `SELECT COUNT(*) as count FROM ?? WHERE ?? = ?`,
    [table, column, value]
  );
  return rows[0].count > 0;
}

// Insert data
async function insertData(table, data) {
  const [result] = await pool.query(`INSERT INTO ?? SET ?`, [table, data]);
  return result.insertId;
}

// Select a row
async function selectRow(table, conditions) {
  const keys = Object.keys(conditions);
  const values = Object.values(conditions);
  const whereClause = keys.map((k) => `${k} = ?`).join(" AND ");
  const [rows] = await pool.query(
    `SELECT * FROM ?? WHERE ${whereClause} LIMIT 1`,
    [table, ...values]
  );
  return rows[0] || null;
}

//select all from a table
async function selectAll(table) {
  const [rows] = await pool.query(`SELECT * FROM ??`, [table]);
  return rows;
}
//select all from a table with conditions
async function selectAllWithConditions(table, conditions) {
  const keys = Object.keys(conditions);
  const values = Object.values(conditions);
  const whereClause = keys.map((k) => `${k} = ?`).join(" AND ");
  const [rows] = await pool.query(
    `SELECT * FROM ?? WHERE ${whereClause}`,
    [table, ...values]
  );
  return rows;
}

// Alter table - add column
async function addColumn(table, columnName, columnType) {
  await pool.query(`ALTER TABLE ?? ADD COLUMN ?? ${columnType}`, [
    table,
    columnName,
  ]);
  return true;
}
//change data for multiple columns in a table
async function updateData(table, data, conditions) {
  const setClause = Object.keys(data)
    .map((key) => `${key} = ?`)
    .join(", ");
  const whereClause = Object.keys(conditions)
    .map((key) => `${key} = ?`)
    .join(" AND ");
  const values = [...Object.values(data), ...Object.values(conditions)];
  const [result] = await pool.query(
    `UPDATE ?? SET ${setClause} WHERE ${whereClause}`,
    [table, ...values]
  );
  return result.affectedRows > 0;
}
// Delete row
async function deleteRow(table, conditions) {
  const keys = Object.keys(conditions);
  const values = Object.values(conditions);
  const whereClause = keys.map((k) => `${k} = ?`).join(" AND ");
  const [result] = await pool.query(`DELETE FROM ?? WHERE ${whereClause}`, [
    table,
    ...values,
  ]);
  return result.affectedRows > 0;
}

module.exports = {
  valueExists,
  insertData,
  selectRow,
  selectAllWithConditions,
  selectAll,
  addColumn,
  updateData,
  deleteRow,
  pool,
  assets_list,
};
