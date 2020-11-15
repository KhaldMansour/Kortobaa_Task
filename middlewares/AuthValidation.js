const Joi = require('joi');
const User = require('../src/models/User');
const jwt = require('jsonwebtoken');

let RegisterValidation = (data) =>
{

    const  schema =  Joi.object({
        email: Joi.string()
            .email()
            .required(),
    
        name: Joi.string()
            .alphanum()
            .max(30)
            .required(),
    
        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
            .min(6)
            .required(),
    
    });

    return schema.validate(data );

}

let checkEmail = (req)=>{
    let emailExists =  User.findOne({
        where:{
            email:req.body.email
        }
     });
     return emailExists;
}

let LoginValidation = (data)=>{
    const  schema =  Joi.object({
        email: Joi.string()
            .email()
            .required(),
    
        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
            .min(6)
            .required(),
    
    });

    return schema.validate(data);

}

let  verifyToken = (req, res , next) =>
{
    const bearerHeader = req.headers['authorization'];
    if(bearerHeader)
    {
        const bearer = bearerHeader.split(' ');
        const token = bearer[1];
        jwt.verify(token, process.env.JWT_SECRET_KEY , (err, data)=>{
           if (err){res.status(400).send("Invalid Token")}
        })
        next();
    }
    else
    {
        res.status(403).send("You are not authorized")
    }
}

let currentUser = (req)=>
{
    const bearerHeader = req.headers['authorization'];
    const bearer = bearerHeader.split(' ');
    const token = bearer[1];
    let data = jwt.verify(token , process.env.JWT_SECRET_KEY)
    let user = data.user
    return user;
}


module.exports.RegisterValidation = RegisterValidation;
module.exports.LoginValidation = LoginValidation;

module.exports.checkEmail = checkEmail; 
module.exports.verifyToken = verifyToken;
module.exports.currentUser = currentUser;
