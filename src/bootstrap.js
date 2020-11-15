module.exports = async()=>{
   const Product = require('../src/models/Product')
   const User = require('../src/models/User')

   User.hasMany(Product ,{ onDelete: 'cascade' } ,{as:"Products" , foreignKey: "user_id"})
   Product.belongsTo(User , {as:"User" , foreignKey: "user_id"})



}