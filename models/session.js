const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../utils/db')

class Session extends Model {}

Session.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false
  }
},
{
  sequelize,
  updatedAt: false,
  underscored: true,
  modelName: 'session'
})

module.exports = Session