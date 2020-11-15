const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME , process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.HOST,
    dialect: process.env.DB,
  
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    },
  
   
});


module.exports = sequelize;
global.sequelize = sequelize;