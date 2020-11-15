"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable("users", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      email: {
        type: Sequelize.STRING,
        unique: true,
      },
      name: {
        type: Sequelize.STRING,
      },
      password: Sequelize.STRING,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("users");
  },
};
