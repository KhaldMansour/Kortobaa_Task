const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5001;
const bodyParser = require('body-parser');
const db = require('./src/database/connection');
const User = require('./src/models/User');
const Product = require('./src/models/Product');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {checkEmail, RegisterValidation , LoginValidation , verifyToken, currentUser} = require('./middlewares/AuthValidation')
const ProductValidation = require('./middlewares/ProductValidation');

const multer = require('multer');

const storage = multer.diskStorage(
    {
        destination: function (req, file , cb ) {
            cb(null, './uploads/')
        },
        filename: function (req, file , cb ) {
            cb(null, new Date().toISOString() + file.originalname)
        },
    }
);
const fileFilter = function (req, file , cb , res) 
{
    if(file.mimetype === "image/jpeg" || file.mimetype === "image/png" )
    {cb(null,true)}
    cb(null,false)
};

const upload = multer(
{
        storage:storage ,
         limits: {
            fileSize: 1024 * 1024 * 5
            },
            fileFilter: fileFilter
});

const users = require('./routes/UserRoutes');
const products = require('./routes/ProductRoutes')
users.use(bodyParser.json())
users.use((bodyParser.urlencoded({
    extended: true
  })))


app.use("/api/users" , users)
// app.use("/api/products" , products)




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));


app.post('/api/register' , async (req, res)=>{

    let  error  = await RegisterValidation(req.body);
    if(error.error){
        res.status(400).send(error.error.details[0].message);
    }
    let emailExists = await checkEmail(req); 
    if(emailExists){res.send("email already exists");}
    let salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hashSync(req.body.password , salt);
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    }).catch((err) => res.send(err))
    jwt.sign({user:{user_id:user.id , name:user.name}} , 'secret' , (err, token)=> {
        if(err){res.send(err)}
        res.status(200).json({
            token: token,
            msg: "User Created Sucessfully"
        })
    })
});

app.post('/api/login' , async (req, res)=>{

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







// app.get('/api/products'  , async (req, res) => {
//     let products = await Product.findAll().then().catch((err)=> console.log(err));
//     console.log(products);
//     const bearerHeader = req.headers['authorization'];

//     res.status(200).send(products);
// });


// app.get('/api/products/myproducts' ,verifyToken , async (req, res) => {
//     let user_id = currentUser(req).user_id
//     let products = await Product.findAll({where: {user_id: user_id}}).then().catch((err)=> console.log(err));
//     res.status(200).send(products);
// });

// app.get('/api/products/:id' ,  async (req, res) => {
//     let product = await Product.findOne({
//         where:{
//             id:req.params.id
//         }
//     }).then().catch((err)=> console.log(err));
//     res.status(200).send(product);
// });

app.put('/api/products/update/:id' ,verifyToken , async (req, res)=>{
    res.json({id: req.body, test: "test"})

    // let user_id = currentUser(req).user_id;
    // let product = await Product.findOne({
    //     where:{
    //         id:req.params.id
    //     }
    // }).then().catch((err)=> console.log(err));
    
    // if(product.user_id !=  user_id)
    // {
    //     res.status(403).send("You are unauthorized to edit this product")
    // }
    // res.json({id:req.body.price})
    
    // let productUpdated = await Product.update(
    //     {
    //     title: req.body.title,
    //     image: req.body.image,
    //     price:req.body.price,
    //     },  
    //     {where:
    //         {
    //         id:req.params.id
    //         }
    //     }

    // ).then(res.status(200).send("Product Updated Successfully")).catch((err) => res.send(err))


})

app.post('/api/products/create' ,upload.single('image') ,verifyToken , async (req, res)=>{
    res.send("hi");
    let user_id = currentUser(req).user_id
    let  error  = await ProductValidation(req.body);
    if(error.error){
    res.status(400).send(error.error.details[0].message);
    }
     
    const product = await Product.create({
        title: req.body.title,
        image: req.file.path,
        price:req.body.price,
        user_id: user_id
    }).then(res.status(200).send("Product Created Successfully")).catch((err) => res.send(err))
    console.log(product);  
} )



app.delete('/api/products/delete/:id' , verifyToken , async (req,res) =>{
    let user_id = currentUser(req).user_id;
    let product = await Product.findOne({
        where:{
            id:req.params.id
        }
    }).then().catch((err)=> console.log(err));

    if(product.user_id !=  user_id)
    {
        res.status(403).send("You are unauthorized to delete this product")
    }

    let productDeletes = await Product.destroy(
         
        {where:
            {
            id:req.params.id
            }
        }

    ).then(res.status(200).send("Product Deleted Successfully")).catch((err) => res.send(err))


})







app.listen(PORT , console.log("hi"));