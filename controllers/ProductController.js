const Product = require("../src/models/Product");
const { currentUser } = require("../middlewares/AuthValidation");

exports.getAll = async (req, res) => {
  console.log(process.env.hey);
  let products = await Product.findAll()
    .then()
    .catch((err) => console.log(err));

  return res.status(200).send(products);
};

exports.myProducts = async (req, res) => {
  let user_id = currentUser(req).user_id;
  let products = await Product.findAll({ where: { user_id: user_id } })
    .then()
    .catch((err) => console.log(err));
  return res.status(200).send(products);
};

exports.show = async (req, res) => {
  let product = await Product.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then()
    .catch((err) => console.log(err));
  return res.status(200).send(product);
};

exports.update = async (req, res) => {
  let user_id = currentUser(req).user_id;
  let product = await Product.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then()
    .catch((err) => console.log(err));

  if (product.user_id != user_id) {
    return res.status(403).send("You are unauthorized to edit this product");
  }

  let productUpdated = await Product.update(
    {
      title: req.body.title || product.title,
      image: req.body.image || product.image,
      price: req.body.price || product.price,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then()
    .catch((err) => res.send(err));

  return res.status(200).send("Product Updated Successfully");
};

exports.delete = async (req, res) => {
  let user_id = currentUser(req).user_id;
  let product = await Product.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then()
    .catch((err) => console.log(err));

  if (product.user_id != user_id) {
    return res.status(403).send("You are unauthorized to delete this product");
  }

  let productDeletes = await Product.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then()
    .catch((err) => res.send(err));
  return res.status(200).send("Product Deleted Successfully");
};
