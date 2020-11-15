const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const app = express();
const UserController = require("../controllers/UserController");

router.post("/login", UserController.login);

router.post("/register", UserController.register);

module.exports = router;
