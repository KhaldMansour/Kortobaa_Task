const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const Product = require('../src/models/Product');
const {verifyToken , currentUser } = require('../middlewares/AuthValidation');
const ProductValidation = require('../middlewares/ProductValidation')

app.use(bodyParser.json());
app.use(express.json());

const multer = require('multer');

const storage = multer.diskStorage(
    {
        destination: function (req, file , cb ) {
            cb(null, '../uploads/')
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



router.get('/'  , async (req, res) => {
    let products = await Product.findAll().then().catch((err)=> console.log(err));
    console.log(products);

    res.status(200).send(products);
});


// router.put('/update/:id' ,verifyToken , async (req, res)=>{
//     res.json({id: req.body})

//     let user_id = currentUser(req).user_id;
//     let product = await Product.findOne({
//         where:{
//             id:req.params.id
//         }
//     }).then().catch((err)=> console.log(err));
    
//     if(product.user_id !=  user_id)
//     {
//         res.status(403).send("You are unauthorized to edit this product")
//     }
//     res.json({id:req.body.price})
    
//     let productUpdated = await Product.update(
//         {
//         title: req.body.title,
//         image: req.body.image,
//         price:req.body.price,
//         },  
//         {where:
//             {
//             id:req.params.id
//             }
//         }

//     ).then(res.status(200).send("Product Updated Successfully")).catch((err) => res.send(err))


// })

router.get('/myproducts' ,verifyToken , async (req, res) => {
    let user_id = currentUser(req).user_id
    let products = await Product.findAll({where: {user_id: user_id}}).then().catch((err)=> console.log(err));
    res.status(200).send(products);
});

router.get('/:id' ,  async (req, res) => {
    let product = await Product.findOne({
        where:{
            id:req.params.id
        }
    }).then().catch((err)=> console.log(err));
    res.status(200).send(product);
});


router.post('/create' ,upload.single('image') ,verifyToken , async (req, res)=>{
    res.send("hi");
    // let user_id = currentUser(req).user_id
    // let  error  = await ProductValidation(req.body);
    // if(error.error){
    // res.status(400).send(error.error.details[0].message);
    // }
     
    // const product = await Product.create({
    //     title: req.body.title,
    //     image: req.file.path,
    //     price:req.body.price,
    //     user_id: user_id
    // }).then(res.status(200).send("Product Created Successfully")).catch((err) => res.send(err))
    // console.log(product);  
} )





module.exports = router