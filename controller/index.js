require("dotenv").config();
const User = require("../model");
const jwt = require("jsonwebtoken");
const log = console.log;
const maxAge = 3 * 24 * 60 * 60;
const jwtKey = process.env.JWT_SECRET_KEY;

const createToken = (id) => {
  return jwt.sign({ id }, jwtKey, { expiresIn: maxAge });
};

const handelErrors = (err) => {
  let errors = { email: "", password: "" };

  if (err.message === "incorrect email")
    errors.email = "this email does not exist";

  if (err.message === "incorrect password")
    errors.password = "invalid password";

  if (err.code === 11000) {
    errors.email = "this email is already in use";
    return errors;
  }
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

const create = async (req, res, next) => {
  const { email, password, role } = req.body;
  try {
    const user = await User.create({ email, password, role });
    res.send(user);
  } catch (err) {
    const error = handelErrors(err);
    log(error);
    res.json(error);
  }
};

const read = async (req, res, next) => {
  try {
    const result = await User.find();
    res.send(result);
  } catch (error) {
    res.send(error.message);
  }
};

const updaterec = async (req, res, next) => {
  const { email, password, role } = req.body;
  try {
    const result = await User.findOneAndUpdate(email, { password, role });
    res.send(result);
  } catch (error) {
    res.send(error.message);
  }
};

const delrec = async (req, res, next) => {
  const email = req.body.email;
  try {
    const result = await User.findOneAndDelete({ email });
    res.send(result);
  } catch (error) {
    res.send(error.message);
  }
};

const show = async (req, res, next) => {
  const email = req.body.email;
  try {
    const result = await User.findOne({ email });
    res.send(result);
  } catch (error) {
    res.send(error.message);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    // res.json({ token }); // enable this if you wnat to send token
    res.send(user);
  } catch (err) {
    const error = handelErrors(err);
    res.json(error);
  }
};

const logout = (req, res, next) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

const chngpwd = async (req, res, next) => {
  const { password, confpswd } = req.body;

  if (password.length === 0) {
    res.send({ code: 1, error: "Password cannot be empty" });
    return;
  }
  if (password.length < 5) {
    // res.json("password must be greater than 5 characters");
    res.send({ code: 2, error: "password must be greater than 5 characters" });
    return;
  }
  if (password !== confpswd) {
    res.send({ code: 3, error: "Password does not Match" });
    return;
  }

  try {
    const id = req.token;
    const result = await User.changePassword(id, password);
    res.json(result);
  } catch (error) {
    res.json(error);
    res.send({ code: 4, error: "Soething went wrong! Please try Later" });
  }
};

const forgotpwd = async (req, res, next) => {
  res.send(ok);
};

module.exports = {
  create,
  read,
  updaterec,
  delrec,
  show,
  login,
  logout,
  chngpwd,
  forgotpwd,
};
