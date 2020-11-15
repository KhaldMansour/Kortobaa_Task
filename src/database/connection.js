const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('kortobaa', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
  
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    },
  
   
});


module.exports = sequelize;
global.sequelize = sequelize;