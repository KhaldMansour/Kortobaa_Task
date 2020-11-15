const { Sequelize } = require("sequelize");
const sequelize = require("../database/connection");
// const Product = require('../src/models/Product')

const User = sequelize.define(
  "users",
  {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,

    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,

    },
    password: {
        type:Sequelize.STRING,
        allowNull: false,

    },
  },
  {
    define: { freezeTableName: true },
  }
);
// User.hasMany(Product , {as:"Products" , foreignKey: "user_id"})
// User.associate = models =>{
//   User.hasMany
// }

module.exports = User;

