const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(require('../config/config.json').development);

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ID: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  link: {
    type: DataTypes.STRING,
    allowNull: true
  },
  lastLoginTimestamp: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isEnt: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false
  }
});

module.exports = User;
