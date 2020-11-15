const {
  LoginValidation,
  checkEmail,
  RegisterValidation,
} = require("../middlewares/AuthValidation");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../src/models/User");

exports.login = async (req, res) => {
  let error = await LoginValidation(req.body);
  if (error.error) {
    return res.status(400).send(error.error.details[0].message);
  }
  let emailExists = await checkEmail(req);
  if (!emailExists) {
    return res.status(400).send("Email or Password is wrong");
  }
  const validPassword = await bcrypt.compareSync(
    req.body.password,
    emailExists.password
  );
  if (!validPassword) {
    return res.status(400).send("Invalid Password");
  }
  jwt.sign(
    { user: { user_id: emailExists.id, name: emailExists.name } },
    process.env.JWT_SECRET_KEY,
    (err, token) => {
      if (err) {
        res.send(err);
      }
      return res.status(200).json({
        token: token,
        msg: "Login Success",
      });
    }
  );
};

exports.register = async (req, res) => {
  let error = await RegisterValidation(req.body);
  if (error.error) {
    return res.status(400).send(error.error.details[0].message);
  }
  let emailExists = await checkEmail(req);
  if (emailExists) {
    return res.send("email already exists");
  }
  let salt = await bcrypt.genSalt(10);
  let hashedPassword = await bcrypt.hashSync(req.body.password, salt);
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  }).catch((err) => res.send(err));
  jwt.sign(
    { user: { user_id: user.id, name: user.name } },
    process.env.JWT_SECRET_KEY,
    (err, token) => {
      if (err) {
        return res.send(err);
      }
      return res.status(200).json({
        token: token,
        msg: "User Created Sucessfully",
      });
    }
  );
};
