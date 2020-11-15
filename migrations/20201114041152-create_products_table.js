'use strict';
const DataTypes = require('sequelize/lib/data-types');


module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable("products", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      title: {
        type: Sequelize.STRING,
        unique: true,
      },
      image: {
        type: Sequelize.STRING,
      },
      price: DataTypes.DECIMAL(10,2),
      user_id: Sequelize.INTEGER,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("products");

  }
};
