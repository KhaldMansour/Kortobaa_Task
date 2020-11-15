const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const app = express();
const { LoginValidation ,checkEmail } = require('../middlewares/AuthValidation');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');



router.post('/login' , async (req, res)=>{

    let  error  = await LoginValidation(req.body);
    if(error.error){
    res.status(400).send(error.error.details[0].message);
    }
    let emailExists = await checkEmail(req); 
    if(!emailExists){res.send("Email or Password is wrong");}
    const validPassword = await bcrypt.compareSync(req.body.password , emailExists.password  )
    if(!validPassword)
    {
        res.status(400).send('Invalid Password')
    }
    // res.send(validPassword);
    jwt.sign({user:{user_id:emailExists.id , name:emailExists.name}} , 'secret' , (err, token)=> {
        if(err){res.send(err)}
        res.status(200).json({
            token: token,
            msg: "Login Success"
        })
    })        
   

});


module.exports = router