const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('sessions', 'created_at', {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    })
    await queryInterface.addColumn('sessions', 'expires_at', {
      type: DataTypes.DATE,
      allowNull: false
    })
    await queryInterface.addColumn('sessions', 'token', {
      type: DataTypes.STRING,
      allowNull: false
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('sessions', 'created_at')
    await queryInterface.removeColumn('sessions', 'expires_at')
    await queryInterface.removeColumn('sessions', 'token')
  }
}