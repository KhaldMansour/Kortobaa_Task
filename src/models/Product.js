const { Sequelize } = require("sequelize");
const sequelize = require("../database/connection");
const DataTypes = require('sequelize/lib/data-types');
// const User = require('../src/models/User')

 const Product = sequelize.define(
  "products",
  {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    title: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,

    },
    price:{
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,

    },
    image: {
      type: Sequelize.STRING,
      allowNull: false,

    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,

    },
  },

  {
    define: { freezeTableName: true },
  }
);

// Product.belongsTo(User , {as:"User" , foreignKey: "user_id"})


module.exports = Product;