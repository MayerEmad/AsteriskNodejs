const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Context = sequelize.define('context', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  title: Sequelize.STRING,
});

module.exports = Context;
