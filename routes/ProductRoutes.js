const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const router = express.Router();
const Product = require("../src/models/Product");
const { verifyToken, currentUser } = require("../middlewares/AuthValidation");
const ProductValidation = require("../middlewares/ProductValidation");
app.use(bodyParser.json());
app.use(express.json());

const ProductController = require('../controllers/ProductController')

const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file , cb ) {
        cb(null, 'uploads/')
    },
    filename: function (req, file , cb ) {
        console.log(new Date().toISOString())
        console.log(file.originalname)
        cb(null, (new Date().toISOString() +"_" +file.originalname) )
    },
});
const fileFilter = function (req, file, cb, res) {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  }else{
  cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
    fileFilter: fileFilter,
});

router.get("/",ProductController.get_all);

router.put("/update/:id", verifyToken, ProductController.update );

router.get("/myproducts", verifyToken, ProductController.my_products);

router.delete("/delete/:id", verifyToken, ProductController.delete);
module.exports = router;
