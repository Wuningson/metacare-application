require('dotenv').config();
const { Sequelize } = require('sequelize');

const url = process.env.CLEARDB_DATABASE_URL;

const db = new Sequelize(url);

module.exports = db;
