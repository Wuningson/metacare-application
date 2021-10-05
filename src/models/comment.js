const Sequelize = require('sequelize');
const db = require('../config/database');

const Comment = db.define('comment', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  message: {
    type: Sequelize.STRING,
    allowNull: false
  },
  film: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  ip: {
    type: Sequelize.STRING,
    allowNull: false
  },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false
  }
});

module.exports = Comment;
