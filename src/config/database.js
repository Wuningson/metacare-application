require('dotenv').config();
const { Sequelize } = require('sequelize');

const url = process.env.DATABASE_URL;

const db = new Sequelize(url);

module.exports = db;
