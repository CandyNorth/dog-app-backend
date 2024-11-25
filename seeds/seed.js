const format = require("pg-format");
const db = require("../connection");
const { convertTimestampToDate, createRef } = require("./utils");

const seed = ({ doggy_db, doggy_db_test }) => {
  return db;
};
