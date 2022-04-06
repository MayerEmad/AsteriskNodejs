const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Extension = sequelize.define('extension', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: Sequelize.STRING,
  action: {
    type: Sequelize.STRING,
    allowNull: false
  },
  params: {
    type: Sequelize.STRING,
    allowNull: false
  },
  context_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    foreignKey: true
  }
});

module.exports = Extension;
